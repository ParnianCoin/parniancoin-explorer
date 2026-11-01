/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import ParnianBlock from 'parniancoin/src/Types/Block';
import Currency from 'parniancoin/src/Types/Currency';

const P_EXPLORER_STATS = Symbol('explorer_stats');

// How many accounts every mined block creates.
const ACCOUNTS_PER_BLOCK = 5;

export default class Block extends ParnianBlock {
  constructor(data) {
    super(data);

    this[P_EXPLORER_STATS] = {};
    if (data.explorer === undefined) {
      return;
    }

    this[P_EXPLORER_STATS] = data.explorer.stats;
    this[P_EXPLORER_STATS].volume = Currency.fromTar(this[P_EXPLORER_STATS].volume);
    this[P_EXPLORER_STATS].fee = Currency.fromTar(this[P_EXPLORER_STATS].fee);
    this[P_EXPLORER_STATS].reward = Currency.fromTar(this[P_EXPLORER_STATS].reward);
  }

  get explorerStats() {
    return this[P_EXPLORER_STATS];
  }

  /**
     * The account numbers this block brought into existence. Each mined block
     * creates a fixed number of accounts, numbered consecutively from the block
     * height, so they can be derived instead of asked for.
     *
     * @returns {Array}
     */
  get createdAccounts() {
    const first = this.block * ACCOUNTS_PER_BLOCK;

    return Array.from({ length: ACCOUNTS_PER_BLOCK }, (unused, i) => first + i);
  }
}
