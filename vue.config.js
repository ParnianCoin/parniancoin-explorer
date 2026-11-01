/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

const path = require('path');

// The explorer backend (server/index.js). `npm run serve` forwards /rpc and
// /api to it; in production the backend serves dist/ itself and no proxy is
// involved at all.
const BACKEND = process.env.VUE_APP_BACKEND || 'http://127.0.0.1:38101';

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // All `import ... from 'parniancoin/src/...'` statements resolve to the
        // ParnianCoin javascript client library that ships inside this repo.
        parniancoin: path.resolve(__dirname, 'vendor/parniancoin-js'),

        // The client library is CommonJS and does `require('bignumber.js')`.
        // Recent releases also ship an ESM build and advertise it in their
        // `module` field, which webpack prefers — the require would then hand
        // back a namespace object instead of the constructor. Pin it to the
        // CommonJS entry point. (node-fetch is left alone on purpose: webpack
        // picks its `browser` field, which is what a browser build needs.)
        'bignumber.js$': path.resolve(__dirname, 'node_modules/bignumber.js/bignumber.js'),
      },
    },
  },
  // The bundled client library is plain CommonJS. Babel would otherwise treat
  // it as an ES module (because it lives inside the project rather than in
  // node_modules) and make `exports` read only, which breaks every
  // `module.exports = ...` in it at runtime.
  chainWebpack: (config) => {
    config.module.rule('js').exclude.add(path.resolve(__dirname, 'vendor'));
  },
  devServer: {
        allowedHosts: ['explorer.parniancoin.ir','explorer.parniancoin.com','explorer.parniancoin.net'],
    proxy: {
      '/rpc': { target: BACKEND, changeOrigin: true },
      '/api': { target: BACKEND, changeOrigin: true },
    },
  },
};
