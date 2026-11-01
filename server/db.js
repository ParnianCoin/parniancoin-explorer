/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

/**
 * Opens the database.
 *
 * Prefers node:sqlite, which ships with Node itself (22.13+ / 24) and needs no
 * compilation. Falls back to better-sqlite3 when running on an older Node and
 * that package happens to be installed. Both expose prepare()/run()/all()/get()
 * and exec(), so the rest of the backend does not care which one is in use.
 */
function openDatabase() {
  const dir = path.dirname(config.dbFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let handle;
  let driver;

  try {
    // eslint-disable-next-line global-require
    const { DatabaseSync } = require('node:sqlite');
    handle = new DatabaseSync(config.dbFile);
    driver = 'node:sqlite';
  } catch (builtinError) {
    try {
      // eslint-disable-next-line global-require, import/no-unresolved
      const BetterSqlite3 = require('better-sqlite3');
      handle = new BetterSqlite3(config.dbFile);
      driver = 'better-sqlite3';
    } catch (fallbackError) {
      throw new Error(
        'No SQLite driver available. Use Node 22.13+ (which has node:sqlite '
        + 'built in), or run: npm install better-sqlite3',
      );
    }
  }

  // WAL lets the API keep reading while the indexer writes.
  handle.exec('PRAGMA journal_mode = WAL');
  handle.exec('PRAGMA synchronous = NORMAL');
  handle.exec('PRAGMA busy_timeout = 10000');

  handle.driver = driver;
  return handle;
}

// Operation types reported by the node. The charts expect exactly the columns
// n_type_0 .. n_type_10.
const OPTYPE_MIN = 0;
const OPTYPE_MAX = 10;

const typeColumns = [];
for (let t = OPTYPE_MIN; t <= OPTYPE_MAX; t += 1) {
  typeColumns.push(`n_type_${t}`);
}

/**
 * Creates the schema. Safe to call on every start.
 */
function migrate(handle) {
  const typeDefs = typeColumns
    .map(c => `${c} INTEGER NOT NULL DEFAULT 0`)
    .join(',\n            ');

  handle.exec(`
    CREATE TABLE IF NOT EXISTS blocks (
      block        INTEGER PRIMARY KEY,
      timestamp    INTEGER NOT NULL,
      duration     INTEGER NOT NULL DEFAULT 0,
      n_operations INTEGER NOT NULL DEFAULT 0,
      volume_tar   INTEGER NOT NULL DEFAULT 0,
      fee_tar      INTEGER NOT NULL DEFAULT 0,
      reward_tar   INTEGER NOT NULL DEFAULT 0,
      ${typeDefs},
      day          TEXT NOT NULL,
      week         TEXT NOT NULL,
      month        TEXT NOT NULL,
      year         TEXT NOT NULL
    )
  `);

  ['day', 'week', 'month', 'year'].forEach((period) => {
    handle.exec(`CREATE INDEX IF NOT EXISTS idx_blocks_${period} ON blocks(${period})`);
  });

  handle.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}

let singleton = null;

/**
 * Returns the shared, migrated database handle.
 */
function db() {
  if (singleton === null) {
    singleton = openDatabase();
    migrate(singleton);
  }
  return singleton;
}

module.exports = {
  db, migrate, openDatabase, typeColumns, OPTYPE_MIN, OPTYPE_MAX,
};
