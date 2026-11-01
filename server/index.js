/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

/**
 * Explorer backend. Serves the built frontend from dist/, proxies JSON-RPC to
 * the node, and answers the aggregation endpoints the charts need.
 *
 *   node server/index.js
 *
 * The routes keep their original .php names so src/config.js needs no change.
 */

const fs = require('fs');
const path = require('path');
const express = require('express');


const config = require('./config');
const { db } = require('./db');
const { rpc } = require('./rpc');
const {
  supplyUpTo,
  TAR_PER_PARC,
  ACCOUNTS_PER_BLOCK,
} = require('./protocol');
const { index } = require('./indexer');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});


app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    res.set('Cache-Control', 'public, s-maxage=15, max-age=0');
  }
  next();
});


const fail = (res, error) => {
  process.stderr.write(`[parnian-explorer] ${error.message}\n`);
  res.status(500).json({ error: 'backend error' });
};

// ------------------------------------------------------------ RPC proxy ----

// Same-origin JSON-RPC endpoint the frontend talks to, so the browser never
// needs CORS against the node and the node's RPC port stays closed outside.
const ALLOWED_RPC = new Set([
  'getblockcount', 'getblock', 'getblocks',
  'getblockoperation', 'getblockoperations',
  'getaccount', 'findaccounts', 'getaccountoperations',
  'getpendings', 'getpendingscount',
  'findoperation', 'nodestatus',
  'findoperation', 'nodestatus', 'nodeservers',
]);

app.post('/rpc', async (req, res) => {
  const calls = Array.isArray(req.body) ? req.body : [req.body];
  if (calls.length === 0 || calls.some((c) => !c || !ALLOWED_RPC.has(c.method))) {
    res.status(403).json({
      jsonrpc: '2.0',
      id: (req.body && req.body.id) || null,
      error: { code: -32601, message: 'method not allowed' },
    });
    return;
  }
  try {
    const upstream = await fetch(config.nodeRpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    res.status(upstream.status).type('application/json').send(await upstream.text());
  } catch (error) {
    fail(res, error);
  }
});
// ------------------------------------------------------------ node stats ----

// Small plain-text endpoints, handy for monitoring and external tooling.
app.get('/api/blockcount', async (req, res) => {
  try {
    res.type('text/plain').send(String(Number(await rpc('getblockcount'))));
  } catch (error) {
    fail(res, error);
  }
});

app.get('/api/coinsupply', async (req, res) => {
  try {
    const blockCount = Number(await rpc('getblockcount'));
    const parc = supplyUpTo(blockCount - 1) / TAR_PER_PARC;
    res.type('text/plain').send(parc.toFixed(4));
  } catch (error) {
    fail(res, error);
  }
});

app.get('/api/accountsupply', async (req, res) => {
  try {
    const blockCount = Number(await rpc('getblockcount'));
    res.type('text/plain').send(String(blockCount * ACCOUNTS_PER_BLOCK));
  } catch (error) {
    fail(res, error);
  }
});

// ------------------------------------------------------------ aggregates ----

app.get('/api/last100', (req, res) => {
  try {
    const rows = db().prepare(`
      SELECT block, duration, n_operations
      FROM (
        SELECT block, duration, n_operations
        FROM blocks
        ORDER BY block DESC
        LIMIT 100
      )
      ORDER BY block ASC
    `).all();

    res.json(rows.map(r => ({
      block: Number(r.block),
      duration: Number(r.duration),
      n_operations: Number(r.n_operations),
    })));
  } catch (error) {
    fail(res, error);
  }
});

/**
 * Per block statistics for a height range. A plain node reports no aggregated
 * figures with getblock, so the explorer reads the volume and the block
 * duration from the index instead. Keyed by block number for a direct lookup.
 */
app.get('/api/blockstats', (req, res) => {
  try {
    const start = Number(req.query.start);
    const end = Number(req.query.end);

    if (!Number.isInteger(start) || !Number.isInteger(end) || end < start) {
      res.status(400).json({ error: 'start and end must be integers, end >= start' });
      return;
    }

    // A generous cap: the list pages ask for ten blocks, the home page five.
    if (end - start > 1000) {
      res.status(400).json({ error: 'range too large, 1000 blocks maximum' });
      return;
    }

    const rows = db().prepare(`
      SELECT block, duration, n_operations, volume_tar, fee_tar, reward_tar
      FROM blocks
      WHERE block BETWEEN ? AND ?
    `).all(start, end);

    const stats = {};
    rows.forEach((r) => {
      stats[Number(r.block)] = {
        duration: Number(r.duration),
        n_operations: Number(r.n_operations),
        volume: Number(r.volume_tar),
        fee: Number(r.fee_tar),
        reward: Number(r.reward_tar),
      };
    });

    res.json(stats);
  } catch (error) {
    fail(res, error);
  }
});

const PERIODS = {
  daily: 'day',
  weekly: 'week',
  monthly: 'month',
  yearly: 'year',
};

/**
 * One aggregated row per period. The period column is also the name of the
 * x-axis field the charts read, so 'day' produces rows keyed by "day".
 */
function timeline(period, limit = 400) {
  const typeSums = [];
  for (let t = 0; t <= 10; t += 1) {
    typeSums.push(`SUM(n_type_${t}) AS sum_n_type_${t}`);
  }

  const rows = db().prepare(`
    SELECT ${period} AS period,
           ${typeSums.join(', ')},
           AVG(duration)   AS avg_duration,
           SUM(volume_tar) AS sum_volume_tar,
           AVG(volume_tar) AS avg_volume_tar,
           SUM(fee_tar)    AS sum_fee_tar,
           AVG(fee_tar)    AS avg_fee_tar,
           COUNT(*)        AS n_blocks
    FROM blocks
    GROUP BY ${period}
    ORDER BY ${period} DESC
    LIMIT ?
  `).all(limit).reverse();

  const round = (value, digits) => Number(Number(value).toFixed(digits));

  return rows.map((r) => {
    const out = { [period]: String(r.period) };
    for (let t = 0; t <= 10; t += 1) {
      out[`sum_n_type_${t}`] = Number(r[`sum_n_type_${t}`]);
    }
    out.avg_duration = round(r.avg_duration, 2);
    out.sum_volume_parc = round(Number(r.sum_volume_tar) / config.tarPerParc, 4);
    out.avg_volume_parc = round(Number(r.avg_volume_tar) / config.tarPerParc, 4);
    out.sum_fee_parc = round(Number(r.sum_fee_tar) / config.tarPerParc, 4);
    out.avg_fee_tar = Math.round(Number(r.avg_fee_tar));
    out.n_blocks = Number(r.n_blocks);
    return out;
  });
}

Object.entries(PERIODS).forEach(([name, column]) => {
  app.get(`/api/timeline/${name}`, (req, res) => {
    try {
      res.json(timeline(column));
    } catch (error) {
      fail(res, error);
    }
  });
});

// Small status endpoint, handy when something looks stale.
app.get('/api/status', (req, res) => {
  try {
    const row = db().prepare('SELECT COUNT(*) AS blocks, MAX(block) AS tip FROM blocks').get();
    const meta = db().prepare('SELECT value FROM meta WHERE key = ?').get('last_run');
    res.json({
      indexed_blocks: Number(row.blocks || 0),
      indexed_tip: row.tip === null ? null : Number(row.tip),
      last_run: meta ? Number(meta.value) : null,
      driver: db().driver,
    });
  } catch (error) {
    fail(res, error);
  }
});

// -------------------------------------------------------------- frontend ----

if (fs.existsSync(config.distDir)) {
  app.use(express.static(config.distDir));
  // vue-router runs in history mode, so unknown paths must return index.html.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path === '/rpc') {
      next();
      return;
    }
    res.sendFile(path.join(config.distDir, 'index.html'));
  });
}

// ---------------------------------------------------------------- start ----

if (require.main === module) {
  db(); // fail fast if no SQLite driver is available

  app.listen(config.port, () => {
    process.stdout.write(`ParnianCoin explorer on http://127.0.0.1:${config.port}\n`);
    process.stdout.write(`  node RPC : ${config.nodeRpc}\n`);
    process.stdout.write(`  database : ${config.dbFile}\n`);
    if (!fs.existsSync(config.distDir)) {
      process.stdout.write('  frontend : dist/ not found, run "npm run build" first\n');
    }
  });

  if (config.autoIndexSeconds > 0) {
    const tick = async () => {
      try {
        const written = await index({});
        if (written > 0) {
          process.stdout.write(`indexed ${written} new blocks\n`);
        }
      } catch (error) {
        process.stderr.write(`indexing skipped: ${error.message}\n`);
      }
    };
    tick();
    setInterval(tick, config.autoIndexSeconds * 1000);
  }
}

module.exports = app;
