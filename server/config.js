/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

const path = require('path');

module.exports = {
  // JSON-RPC endpoint of the ParnianCoin node (rpcport in your node config).
  nodeRpc: process.env.PARNIAN_RPC || 'http://127.0.0.1:38003',

  // Port the explorer backend listens on.
  port: Number(process.env.PORT) || 38101,

  // SQLite database file. Created on the first indexer run.
  dbFile: process.env.PARNIAN_DB || path.resolve(__dirname, 'data', 'explorer.sqlite'),

  // Folder with the built frontend, served as static files.
  distDir: path.resolve(__dirname, '..', 'dist'),

  // 1 PARC = 10000 TAR. Amounts are stored as integer TAR to avoid float drift.
  tarPerParc: 10000,

  // Run the indexer in the background while the server is up. Set to 0 to
  // disable and drive the indexer from Task Scheduler or cron instead.
  autoIndexSeconds: process.env.PARNIAN_AUTOINDEX === '0'
    ? 0
    : Number(process.env.PARNIAN_AUTOINDEX || 60),
};
