/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import axios from 'axios';
import Currency from 'parniancoin/src/Types/Currency';
import { API_BASE } from '../config';

/**
 * A plain node answers getblock without any aggregated figures, so the volume
 * of a block and the time since its predecessor come from the explorer index
 * instead. Everything else on the page still comes straight from the node.
 */

/**
 * Attaches the indexed statistics to a list of blocks, in place, and returns
 * it. Blocks the index has not reached yet keep the "unknown" placeholders, so
 * a lagging or empty index degrades the page instead of breaking it.
 *
 * @param {Array} blocks
 * @returns {Promise<Array>}
 */
export default async function attachBlockStats(blocks) {
  const unknown = () => ({ volume: new Currency(-1), duration: null });

  if (blocks.length === 0) {
    return blocks;
  }

  const numbers = blocks.map(b => b.block);
  const start = Math.min(...numbers);
  const end = Math.max(...numbers);

  let stats = {};
  try {
    stats = (await axios.get(`${API_BASE}/blockstats`, { params: { start, end } })).data;
  } catch (error) {
    // The index is optional. Without it the page still lists every block.
    stats = {};
  }

  blocks.forEach((block) => {
    const indexed = stats[block.block];

    if (indexed === undefined) {
      block.raw.explorer = { stats: unknown() };
      return;
    }

    block.raw.explorer = {
      stats: {
        volume: Currency.fromTar(indexed.volume),
        duration: indexed.duration,
        n_operations: indexed.n_operations,
      },
    };
  });

  return blocks;
}
