/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import PublicKey from 'parniancoin/src/Keys/PublicKey';
import Currency from 'parniancoin/src/Types/Currency';
import AccountNumber from 'parniancoin/src/Types/AccountNumber';
import ByteCollection from 'parniancoin/src/ByteCollection';

export default {
  namespaced: true,
  state: {
    operation: null,
    block: null,
  },
  mutations: {
    setOperation(state, operation) {
      if (operation !== null && operation.raw.explorer && operation.raw.explorer.account_states) {
        // The node hands back plain JSON. Every account state has a "before"
        // and an "after" snapshot, and both need the same three fields turned
        // into real objects.
        const hydrate = (snapshot) => {
          snapshot.balance = new Currency(snapshot.balance);
          snapshot.account = new AccountNumber(snapshot.account);
          snapshot.enc_pubkey = PublicKey.decode(ByteCollection.fromHex(snapshot.enc_pubkey));
        };

        Object.values(operation.raw.explorer.account_states).forEach((accountState) => {
          hydrate(accountState.before);
          hydrate(accountState.after);
        });
      }
      state.operation = operation;
    },
    setBlock(state, block) {
      // eslint-disable-next-line
      state.block = block;
    },
  },
  actions: {
    async fetchOperationData({ commit, dispatch }, { ophash }) {
      commit('setOperation', null);
      dispatch('fetchOperation', ophash, { root: true }).then((operation) => {
        commit('setOperation', operation);
        dispatch('fetchBlock', operation.block, { root: true }).then((block) => {
          commit('setBlock', block);
        });
      });
    },
  },
};
