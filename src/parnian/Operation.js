/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import ParnianOperation from 'parniancoin/src/Types/Operation';

const P_STATE_BEFORE = Symbol('state_before');
const P_STATE_AFTER = Symbol('state_after');

export default class Operation extends ParnianOperation {
  constructor(data) {
    super(data);

    if (!data.explorer) {
      return;
    }

    this[P_STATE_BEFORE] = data.explorer.state_before;
    this[P_STATE_AFTER] = data.explorer.state_after;
  }
}
