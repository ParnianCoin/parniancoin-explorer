/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import attachBlockStats from '../parnian/stats';

export default {
  namespaced: true,
  state: {
    blocks: [],
  },
  mutations: {
    setBlocks(state, blocks) {
      state.blocks = blocks;
    },
  },
  actions: {
    async fetchBlocks({ commit, dispatch }, { latestBlock, blocksPage, blocksAmount }) {
      const blocks = await dispatch('listBlocks', {
        total: latestBlock,
        page: blocksPage,
        amount: blocksAmount,
      }, { root: true });

      commit('setBlocks', await attachBlockStats(blocks));
    },
  },
};
