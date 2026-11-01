/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import PublicKey from 'parniancoin/src/Keys/PublicKey';
import Operation from 'parniancoin/src/Types/Operation';
import ByteCollection from 'parniancoin/src/ByteCollection';

export default {
  namespaced: true,
  state: {
    account: null,
    operations: [],
    doesNotExist: false,
  },
  mutations: {
    setDoesNotExist(state, doesNotExist) {
      // eslint-disable-next-line
      state.doesNotExist = doesNotExist;
    },
    setAccount(state, account) {
      // eslint-disable-next-line
      state.account = account;

      // A plain node reports no ownership history, so the table of previous
      // owners stays empty instead of the page failing to render.
      if (account !== null) {
        const history = (account.raw.explorer && account.raw.explorer.public_keys) || [];

        account.raw.explorer = {
          ...account.raw.explorer,
          public_keys: history.map((pk) => {
            pk.enc_pubkey = PublicKey.decode(ByteCollection.fromHex(pk.enc_pubkey));
            if (pk.op !== undefined) {
              pk.op = new Operation(pk.op);
            }
            return pk;
          }),
        };
      }
    },
    setOperations(state, operations) {
      // eslint-disable-next-line
      state.operations = operations;
    },
  },
  actions: {
    async fetchAccountData({ commit, dispatch }, { account }) {
      commit('setDoesNotExist', false);
      commit('setAccount', null);
      Promise.all([
        dispatch('fetchAccount', account, { root: true }),
      ]).then((values) => {
        commit('setAccount', values[0]);
      }).catch(() => commit('setDoesNotExist', true));
    },
    async fetchOperations({ commit, dispatch }, { account, operationsPage, operationsAmount }) {
      dispatch('fetchAccountOperations', {
        account,
        page: operationsPage,
        amount: operationsAmount,
      }, { root: true }).then((values) => {
        commit('setOperations', values);
      });
    },
  },
};
