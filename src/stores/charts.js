/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import axios from 'axios';
import { API_BASE } from '../config';

export default {
  namespaced: true,
  state: {
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
  },
  mutations: {
    setDaily(state, daily) {
      // eslint-disable-next-line
      state.daily = daily;
    },
    setMonthly(state, monthly) {
      // eslint-disable-next-line
      state.monthly = monthly;
    },
    setWeekly(state, weekly) {
      // eslint-disable-next-line
      state.weekly = weekly;
    },
    setYearly(state, yearly) {
      // eslint-disable-next-line
      state.yearly = yearly;
    },
  },
  actions: {
    async fetchData({ commit }, type) {
      const mutations = {
        daily: 'setDaily',
        weekly: 'setWeekly',
        monthly: 'setMonthly',
        yearly: 'setYearly',
      };

      const mutation = mutations[type];
      if (mutation === undefined) {
        throw new Error(`unknown timeline type: ${type}`);
      }

      const { data } = await axios.get(`${API_BASE}/timeline/${type}`);
      commit(mutation, data);
    },
  },
};
