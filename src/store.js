/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import Operation from 'parniancoin/src/Types/Operation';
import Account from 'parniancoin/src/Types/Account';
import Block from 'parniancoin/src/Types/Block';
import Currency from 'parniancoin/src/Types/Currency';
import OperationStore from './stores/operation';
import AccountStore from './stores/account';
import AccountsStore from './stores/accounts';
import BlockStore from './stores/block';
import BlocksStore from './stores/blocks';
import ChartsStore from './stores/charts';
import rpc from './parnian/rpc';
import attachBlockStats from './parnian/stats';
import { supplyUpTo, ACCOUNTS_PER_BLOCK } from './parnian/protocol';
import { API_BASE } from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account: AccountStore,
    accounts: AccountsStore,
    block: BlockStore,
    blocks: BlocksStore,
    operation: OperationStore,
    charts: ChartsStore,
  },
  state: {
    blockCount: 0,
    latestBlock: 0,
    latestBlocks: 0,
    last100: [],
    accountCount: 0,
    pendings: [],
    pendingCount: 0,
    searchVisible: true,
    supply: new Currency(0),
    allSupply: null,
  },
  mutations: {
    setBlockCount(state, blockCount) {
      state.blockCount = blockCount;
      state.latestBlock = blockCount - 1;
      state.accountCount = blockCount * ACCOUNTS_PER_BLOCK;
      state.supply = Currency.fromTar(supplyUpTo(state.latestBlock));
    },
    setPendings(state, pendings) {
      // eslint-disable-next-line
      state.pendings = pendings;
    },
    setPendingCount(state, pendingCount) {
      state.pendingCount = pendingCount;
    },
    setLatestBlocks(state, latestBlocks) {
      state.latestBlocks = latestBlocks;
    },
    setLast100Blocks(state, last100) {
      state.last100 = last100;
    },
  },
  actions: {
    fetchPendings(context, { total, page, amount }) {
      const request = rpc.getPendings();
      request.start = total > amount ? total - (page * amount) : 0;
      request.max = amount;
      request.executeTransformArray(Operation).then((pendings) => {
        context.commit('setPendings', pendings.reverse());
      });
    },
    fetchPendingCount(context) {
      const requestCount = rpc.getPendingsCount();
      requestCount.execute().then((pendingCount) => {
        context.commit('setPendingCount', pendingCount);
      });
    },
    fetchAccountOperations(context, { account, page, amount }) {
      const request = rpc.getAccountOperations(account, 10000000);
      request.start = page * amount - amount;
      request.max = amount;
      return request.executeTransformArray(Operation);
    },
    fetchAccount(context, account) {
      const request = rpc.getAccount(account);
      return request.executeTransformItem(Account);
    },
    fetchOperation(context, ophash) {
      const request = rpc.findOperation(ophash);
      return request.executeTransformItem(Operation);
    },
    fetchBlock(context, blockNumber) {
      const request = rpc.getBlock(blockNumber);
      return request.executeTransformItem(Block);
    },
    fetchBlockOperations(context, { blockNumber, page, amount }) {
      const request = rpc.getBlockOperations(blockNumber);
      request.start = page * amount - amount;
      request.max = amount;
      return request.executeTransformArray(Operation);
    },
    fetchAccounts(context, accounts) {
      return Promise.all(
        accounts.map(account => rpc.getAccount(account).executeTransformItem(Account)),
      );
    },
    listAccounts(context, { page, amount }) {
      const request = rpc.findAccounts();
      request.start = page * amount - amount;
      request.max = amount;
      return request.executeTransformArray(Account);
    },
    fetchLatestBlocks(context) {
      const request = rpc.getBlocks(5);
      request.executeTransformArray(Block)
        .then(blocks => attachBlockStats(blocks))
        .then((blocks) => {
          context.commit('setLatestBlocks', blocks);
        });
    },
    listBlocks(context, { total, page, amount }) {
      let start = total - (page * amount);
      let end = total - (page * amount) + amount;
      if (end > total) {
        end = total;
      }
      if (start <= 0) {
        start = 1;
      }
      const request = rpc.getBlocks(null, start, end);
      return request.executeTransformArray(Block);
    },
    async fetchLast100({ commit }) {
      commit('setLast100Blocks', (await axios.get(`${API_BASE}/last100`)).data);
    },
    async fetchBlockCount({ commit }) {
      const request = rpc.getBlockCount();
      commit('setBlockCount', await request.execute());
    },
  },
});
