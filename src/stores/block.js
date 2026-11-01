/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import Currency from 'parniancoin/src/Types/Currency';
import attachBlockStats from '../parnian/stats';

export default {
  namespaced: true,
  state: {
    block: null,
    operations: [],
    accounts: [],
    doesNotExist: false,
  },
  mutations: {
    setBlock(state, block) {
      state.block = block;
    },
    setOperations(state, operations) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      state.operations = operations.map((op) => {
        let state_before = {
          balance: new Currency(-1),
        };
        let state_after = {
          balance: new Currency(-1),
        };
        // A plain node reports no explorer block, so the balances before and
        // after the operation simply are not known; -1 is the placeholder the
        // list renders as "unknown".
        const explorer = op.raw.explorer || {};

        if (explorer.state_before !== undefined && explorer.state_before !== null) {
          ({ state_before } = explorer);
          state_before.balance = new Currency(state_before.balance);
        }

        if (explorer.state_after !== undefined && explorer.state_after !== null) {
          ({ state_after } = explorer);
          state_after.balance = new Currency(state_after.balance);
        }
        op.raw.explorer = {
          state_before, state_after,
        };
        return op;
      });
    },
    setAccounts(state, accounts) {
      // eslint-disable-next-line
      state.accounts = accounts;
    },
    setDoesNotExist(state, doesNotExist) {
      // eslint-disable-next-line
      state.doesNotExist = doesNotExist;
    },
  },
  actions: {
    async fetchBlockData({ commit, dispatch }, { blockNumber }) {
      commit('setDoesNotExist', false);
      commit('setBlock', null);
      dispatch('fetchBlock', blockNumber, { root: true }).then(async (block) => {
        commit('setBlock', (await attachBlockStats([block]))[0]);
        dispatch('fetchAccounts', block.createdAccounts, { root: true }).then((accounts) => {
          commit('setAccounts', accounts);
        });
      }).catch(() => {
        commit('setDoesNotExist', true);
      });
    },
    async fetchBlockOperations({ commit, dispatch }, { blockNumber, operationsPage, operationsAmount }) {
      dispatch('fetchBlockOperations', {
        blockNumber,
        page: operationsPage,
        amount: operationsAmount,
      }, { root: true }).then((operations) => {
        commit('setOperations', operations);
      });
    },
  },
};
