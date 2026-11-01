/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

/**
 * Walks the ParnianCoin blockchain over JSON-RPC and stores one aggregated row
 * per block. Runs incrementally: every invocation continues from the highest
 * block already stored, so it is safe to call repeatedly.
 *
 *   node server/indexer.js              index new blocks only
 *   node server/indexer.js --reset      rebuild from block 0
 *   node server/indexer.js --from=1000  re-index from a height (repairs a fork)
 *   node server/indexer.js --watch      keep running, poll for new blocks
 */

const { rpc, toTar } = require('./rpc');
const {
  db, typeColumns, OPTYPE_MIN, OPTYPE_MAX,
} = require('./db');

const COLUMNS = [
  'block', 'timestamp', 'duration', 'n_operations',
  'volume_tar', 'fee_tar', 'reward_tar',
  ...typeColumns,
  'day', 'week', 'month', 'year',
];

/**
 * Formats a unix timestamp into the UTC period keys used for grouping.
 * ISO week numbers keep the year that the week belongs to, so the first days of
 * January can still fall into the last week of the previous year.
 */
function periodKeys(timestamp) {
  const d = new Date(timestamp * 1000);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');

  const isoTarget = new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate()));
  const dayNumber = (isoTarget.getUTCDay() + 6) % 7; // Monday = 0
  isoTarget.setUTCDate(isoTarget.getUTCDate() - dayNumber + 3); // Thursday of this week
  const isoYear = isoTarget.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
  const week = 1 + Math.round((isoTarget - firstThursday) / (7 * 24 * 3600 * 1000));

  return {
    day: `${year}-${month}-${day}`,
    week: `${isoYear}-W${String(week).padStart(2, '0')}`,
    month: `${year}-${month}`,
    year: String(year),
  };
}

/**
 * Reads one block plus its operations and returns the aggregated row.
 */
async function collectBlock(height, previousTimestamp) {
  const block = await rpc('getblock', { block: height });
  if (!block) {
    throw new Error(`block ${height} was not returned by the node`);
  }

  const timestamp = Number(block.timestamp);
  const row = {
    block: height,
    timestamp,
    duration: previousTimestamp > 0 ? Math.max(0, timestamp - previousTimestamp) : 0,
    n_operations: Number(block.operations || 0),
    volume_tar: 0,
    fee_tar: toTar(block.fee),
    reward_tar: toTar(block.reward),
  };

  for (let t = OPTYPE_MIN; t <= OPTYPE_MAX; t += 1) {
    row[`n_type_${t}`] = 0;
  }

  if (row.n_operations > 0) {
    const operations = (await rpc('getblockoperations', { block: height })) || [];
    operations.forEach((op) => {
      const type = Number(op.optype);
      if (type >= OPTYPE_MIN && type <= OPTYPE_MAX) {
        row[`n_type_${type}`] += 1;
      }
      // Volume is the value that actually moved. A transfer appears twice, once
      // negative on the sender and once positive on the receiver, so only the
      // positive side is counted.
      const amount = toTar(op.amount);
      if (amount > 0) {
        row.volume_tar += amount;
      }
    });
    row.n_operations = Math.max(row.n_operations, operations.length);
  }

  Object.assign(row, periodKeys(timestamp));
  return row;
}

/**
 * Indexes everything the node has that is not stored yet.
 *
 * @param {Object}   options
 * @param {boolean}  options.reset  wipe the table first
 * @param {number}   options.from   re-index starting at this height
 * @param {Function} options.log
 * @returns {Promise<number>} how many blocks were written
 */
async function index({ reset = false, from = null, log = () => {} } = {}) {
  const handle = db();

  if (reset) {
    handle.exec('DELETE FROM blocks');
    log('database cleared');
  }

  const tip = Number(await rpc('getblockcount')) - 1;

  let start;
  if (from !== null) {
    start = Math.max(0, from);
    handle.prepare('DELETE FROM blocks WHERE block >= ?').run(start);
  } else {
    const highest = handle.prepare('SELECT MAX(block) AS b FROM blocks').get().b;
    start = highest === null || highest === undefined ? 0 : Number(highest) + 1;
  }

  if (start > tip) {
    return 0;
  }

  let previous = 0;
  if (start > 0) {
    const row = handle.prepare('SELECT timestamp FROM blocks WHERE block = ?').get(start - 1);
    previous = row ? Number(row.timestamp) : 0;
  }

  const insert = handle.prepare(
    `INSERT OR REPLACE INTO blocks (${COLUMNS.join(', ')}) `
    + `VALUES (${COLUMNS.map(() => '?').join(', ')})`,
  );

  log(`indexing blocks ${start} .. ${tip}`);
  let done = 0;
  handle.exec('BEGIN');

  try {
    for (let height = start; height <= tip; height += 1) {
      // Blocks must be read in order, because each one needs the timestamp of
      // its predecessor to compute the duration.
      // eslint-disable-next-line no-await-in-loop
      const row = await collectBlock(height, previous);
      previous = row.timestamp;

      insert.run(...COLUMNS.map(c => row[c]));
      done += 1;

      // Commit in batches so a long initial run stays crash safe and never
      // holds one huge write lock.
      if (done % 500 === 0) {
        handle.exec('COMMIT');
        handle.exec('BEGIN');
        log(`  ${done} blocks (at ${height})`);
      }
    }
    handle.exec('COMMIT');
  } catch (error) {
    try {
      handle.exec('ROLLBACK');
    } catch (ignored) {
      // the transaction was already closed by the batch commit
    }
    throw error;
  }

  handle.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)')
    .run('last_run', String(Math.floor(Date.now() / 1000)));

  return done;
}

// ------------------------------------------------------------------ CLI ----

if (require.main === module) {
  const args = process.argv.slice(2);
  const has = flag => args.includes(flag);
  const valueOf = (name) => {
    const found = args.find(a => a.startsWith(`--${name}=`));
    return found ? Number(found.split('=')[1]) : null;
  };

  const quiet = has('--quiet');
  const log = (message) => {
    if (!quiet) {
      process.stdout.write(`[${new Date().toTimeString().slice(0, 8)}] ${message}\n`);
    }
  };

  const once = async (options) => {
    const written = await index({ ...options, log });
    log(written === 0 ? 'nothing to do, already up to date' : `done, ${written} blocks indexed`);
  };

  const run = async () => {
    await once({ reset: has('--reset'), from: valueOf('from') });

    if (has('--watch')) {
      log('watching for new blocks, press Ctrl+C to stop');
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 30000));
        try {
          // eslint-disable-next-line no-await-in-loop
          const written = await index({ log: () => {} });
          if (written > 0) {
            log(`${written} new blocks`);
          }
        } catch (error) {
          log(`indexing failed, will retry: ${error.message}`);
        }
      }
    }
  };

  run().catch((error) => {
    process.stderr.write(`indexer failed: ${error.message}\n`);
    process.exit(1);
  });
}

module.exports = { index, collectBlock, periodKeys };
