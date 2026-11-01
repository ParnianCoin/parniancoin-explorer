<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <div class="insite">
        <div class="page-header header-filter">
            <div class="container">
                <div class="row">
                    <div class="col-md-8 ml-auto mr-auto text-center">
                        <h1 class="title">{{ $t('charts.volume') }}</h1>
                        <p>
                            {{ $t('charts.volume') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="container">
                <div class="main main-raised">
                    <div style="position: absolute; top: -24px; left: 18px;">
                        <router-link
                                :to="{name: 'accounts'}"
                                class="btn btn-fab btn-account-color btn-round">
                            <i class="fa fa-arrow-left"></i><div class="ripple-container"></div>
                        </router-link>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <ul class="nav nav-pills nav-pills-rose mb-5">
                                <li class="nav-item">
                                    <router-link
                                            :to="{name: 'charts-volume' }"
                                            class="nav-link"
                                            exact-active-class="active show">
                                        {{ $t('charts.yearly') }}
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link
                                            :to="{name: 'charts-volume', query: { type: 'monthly'} }"
                                            class="nav-link"
                                            exact-active-class="active show">
                                        {{ $t('charts.monthly') }}
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link
                                            :to="{name: 'charts-volume', query: { type: 'weekly'} }"
                                            class="nav-link"
                                            exact-active-class="active show">
                                        {{ $t('charts.weekly') }}
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link
                                            :to="{name: 'charts-volume', query: { type: 'daily'} }"
                                            class="nav-link"
                                            exact-active-class="active show">
                                        {{ $t('charts.daily') }}
                                    </router-link>
                                </li>
                            </ul>
                            <div id="chart">
                                <apexchart type=line height=350 :options="chartOptions" :series="series" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';


export default {
  name: 'charts-volume',
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          height: 350,
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 3,
        },
        tooltip: {
          fixed: {
            enabled: true,
            position: 'bottom',
            offsetX: 0,
            offsetY: 0,
          },
        },
        stroke: {
          curve: 'straight',
          width: 1,
        },
        title: {
          text: this.$t('charts.chartTitle.volume'),
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
          title: {
            text: this.$t('charts.axis.days'),
          },
        },
      },
    };
  },
  components: {},
  methods: {
    onAreaChange(type) {
      this.type = type;
      this.redirect();
    },
    redirect() {
      this.$router.push({
        name: 'charts-volume',
        query: {
          type: this.type,
        },
      });
    },
    fetchChartData(type) {
      return this.fetchData(type);
    },
    ...mapActions('charts', [
      'fetchData',
    ]),
    updateChart(data, xField, xLabel) {
      const series = {};
      const x = [];
      for (let i = 0; i < data.length; i += 1) {
        if (series.volume === undefined) {
          series.volume = {
            name: this.$t('charts.series.volume'),
            data: [],
          };
          series.volume_avg = {
            name: this.$t('charts.series.volumeAvg'),
            data: [],
          };
        }
        series.volume.data.push(data[i].sum_volume_parc);
        series.volume_avg.data.push(data[i].avg_volume_parc);
        x.push(data[i][xField]);
      }
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: x,
            type: 'string',
            title: {
              text: xLabel,
            },
          },
        },
      };
      this.series = Object.values(series);
    },
  },
  computed: {
    ...mapState({
      daily: state => state.charts.daily,
      weekly: state => state.charts.weekly,
      monthly: state => state.charts.monthly,
      yearly: state => state.charts.yearly,
    }),
  },
  watch: {
    daily() {
      this.updateChart(this.daily, 'day', this.$t('charts.axis.days'));
    },
    weekly() {
      this.updateChart(this.weekly, 'week', this.$t('charts.axis.weeks'));
    },
    monthly() {
      this.updateChart(this.monthly, 'month', this.$t('charts.axis.months'));
    },
    yearly() {
      this.updateChart(this.yearly, 'year', this.$t('charts.axis.years'));
    },
  },
  created() {
    this.type = this.$route.query.type || 'yearly';
    this.fetchChartData(this.type);
  },
  beforeRouteUpdate(to, from, next) {
    this.type = to.query.type || 'yearly';
    this.fetchChartData(this.type)
      .then(() => {
        next();
      });
  },
};
</script>

<style scoped lang="scss">
@import "./../../assets/settings";
.page-header {
    background-color: $parc-color-account;
}
</style>
