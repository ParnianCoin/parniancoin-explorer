/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

/**
 * Central endpoint configuration for the ParnianCoin explorer.
 *
 * RPC_URL   JSON-RPC proxy served by the backend, which forwards to the node.
 *           Same origin, so the browser never runs into CORS.
 * API_BASE  Base path of the aggregated statistics endpoints.
 *
 * Both can be overridden at build time with VUE_APP_RPC_URL / VUE_APP_API_BASE.
 */
export const RPC_URL = process.env.VUE_APP_RPC_URL || '/rpc';
export const API_BASE = process.env.VUE_APP_API_BASE || '/api';

export default { RPC_URL, API_BASE };
