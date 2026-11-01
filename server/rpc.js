/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

const config = require('./config');

let requestId = 0;

/**
 * Calls a single JSON-RPC method on the node and returns its result.
 *
 * @param {string} method
 * @param {Object} params
 * @param {number} timeoutMs
 */
async function rpc(method, params = {}, timeoutMs = 120000) {
  requestId += 1;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(config.nodeRpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: requestId, jsonrpc: '2.0', method, params,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`cannot reach the node at ${config.nodeRpc}: ${error.message}`);
  } finally {
    clearTimeout(timer);
  }

  const body = await response.json().catch(() => null);
  if (body === null) {
    throw new Error('the node returned invalid JSON');
  }
  if (body.error) {
    throw new Error(`RPC error ${body.error.code || ''}: ${body.error.message || 'unknown'}`);
  }

  return body.result;
}

/**
 * Converts a PARC amount coming from the node into integer TAR.
 */
function toTar(parc) {
  return Math.round(Number(parc || 0) * config.tarPerParc);
}

module.exports = { rpc, toTar };
