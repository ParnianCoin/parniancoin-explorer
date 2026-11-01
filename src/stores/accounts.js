/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

export default {
  namespaced: true,
  state: {
    accounts: [],
  },
  mutations: {
    setAccounts(state, accounts) {
      // eslint-disable-next-line
      state.accounts = accounts;
    },
  },
  actions: {
    async fetchAccounts({ commit, dispatch }, { accountsPage, accountsAmount }) {
      const accounts = await dispatch('listAccounts', {
        page: accountsPage,
        amount: accountsAmount,
      }, { root: true });

      commit('setAccounts', accounts);
    },
  },
};
