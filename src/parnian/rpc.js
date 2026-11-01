/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

/* eslint-disable */
import Client from 'parniancoin/src/RPC/Client';
import Executor from 'parniancoin/src/RPC/Executor';
import Caller from 'parniancoin/src/RPC/Caller';
import { RPC_URL } from '../config';

export default new Client(
  new Executor(
    new Caller(RPC_URL),
    100,
  ),
);
