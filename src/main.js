/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import Vue from 'vue';
import VueMoment from 'vue-moment';
import VueApexCharts from 'vue-apexcharts';
import Loading from './components/Loading.vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

// Fonts and icons are bundled locally so the explorer needs no external CDN.
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto-slab/400.css';
import '@fontsource/roboto-slab/700.css';
import '@fontsource/roboto-mono/300.css';
import '@fontsource/roboto-mono/700.css';
import 'material-icons/iconfont/filled.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'nprogress/nprogress.css';

Vue.config.productionTip = false;

Vue.use(Loading);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);
Vue.use(VueMoment);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
