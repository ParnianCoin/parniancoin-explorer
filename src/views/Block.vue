<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <div>
    <div v-if="block === null" class="insite">
      <loading
        :title="$t('block.heading')"
        cls="block"
        :show-error="doesNotExist"
        :error="$t('common.notFoundBlock')"></loading>
    </div>

    <div class="insite" v-if="block !== null">
      <social></social>
    <div class="page-header header-filter">
      <div class="container">
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto text-center">
            <h1 class="title">Block {{block.block}}</h1>
            <p>
              <date :timestamp="block.timestamp" class="text-white"></date>
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
                    :to="{name: 'blocks'}"
                    class="btn btn-fab btn-block-color btn-round">
              <i class="fa fa-arrow-left"></i><div class="ripple-container"></div>
            </router-link>
          </div>
          <div style="position: absolute; top: -24px; right: 18px; white-space: nowrap">
            <router-link
                    :to="{name: 'block', params: { block: block.block - 1}}"
                    class="btn btn-block-color btn-fill"
                    v-if="block.block - 1 >= 0">
              &laquo; {{block.block - 1}}
              <div class="ripple-container"></div>
            </router-link>
            <router-link
                    :to="{name: 'block', params: { block: block.block + 1}}"
                    class="btn btn-block-color btn-fill"
                    v-if="block.block < blockCount - 1">
              {{block.block + 1}} &raquo;
              <div class="ripple-container"></div>
            </router-link>

          </div>
          <div class="row">
            <div class="col-md-6">
              <h3 class="title mb-0 mt-0">{{ $t('block.data') }}</h3>
              <div class="card mt-1 block-bgcolor-dark">
                <div class="card-body ">
                  <!--h6 class="card-category text-white">
                      <i class="material-icons">trending_up</i> Block Key Data
                  </h6-->
                  <div class="row">
                    <div class="col-md-6">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('block.number') }}</template>
                          <template slot="help">{{ $t('block.numberHelp') }}</template>
                          <template slot="value">{{block.block}}</template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('block.createdAt') }}</template>
                          <template slot="help">{{ $t('block.createdAtHelp') }}</template>
                          <template slot="value">
                            <date :timestamp="block.timestamp"></date>
                          </template>
                        </info-value>
                        <info-value :help="false">
                          <template slot="label">{{ $t('block.numOperations') }}</template>
                          <template slot="value">{{block.operations}}</template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-6">
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.volume') }}</template>
                        <template slot="help">{{ $t('block.volumeHelp') }}</template>
                        <template slot="value">
                          <parnian :amount="block.raw.explorer.stats.volume" :lif="-1" :liflabel="$t('common.unknown')"></parnian>
                        </template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.fee') }}</template>
                        <template slot="help">{{ $t('block.feeHelp') }}</template>
                        <template slot="value">
                          <parnian :amount="block.fee"></parnian>
                        </template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.reward') }}</template>
                        <template slot="help">{{ $t('block.rewardHelp') }}</template>
                        <template slot="value">
                          <parnian :amount="block.reward"></parnian>
                        </template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.maturation') }}</template>
                        <template slot="help">{{ $t('common.maturationHelp') }}</template>
                        <template slot="value">{{block.maturation}}</template>
                      </info-value>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h3 class="title mb-0 mt-0">{{ $t('block.info') }}</h3>
              <div class="card mt-1">
                <div class="card-body ">
                  <dl>
                    <info-value :help="true">
                      <template slot="label">{{ $t('block.duration') }}</template>
                      <template slot="help">{{ $t('block.durationHelp') }}</template>
                      <template slot="value">
                        <span v-if="block.raw.explorer.stats.duration !== null">
                          {{ $t('common.durationSeconds', { n: block.raw.explorer.stats.duration }) }}
                        </span>
                        <span v-else>{{ $t('common.unknown') }}</span>
                      </template>
                    </info-value>
                    <info-value :help="true">
                      <template slot="label">{{ $t('block.version') }}</template>
                      <template slot="help">{{ $t('block.versionHelp') }}</template>
                      <template slot="value">{{block.ver}}</template>
                    </info-value>
                    <info-value :help="true">
                      <template slot="label">{{ $t('block.opHash') }}</template>
                      <template slot="help">{{ $t('block.opHashHelp') }}</template>
                      <template slot="value">{{block.oph.toHex()}}</template>
                    </info-value>
                    <info-value :help="true">
                      <template slot="label">{{ $t('block.safeboxHash') }}</template>
                      <template slot="help">{{ $t('block.safeboxHashHelp') }}</template>
                      <template slot="value">{{block.sbh.toHex()}}</template>
                    </info-value>
                  </dl>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <h3 class="title mb-0 mt-0">{{ $t('block.mining') }}</h3>
              <div class="card mt-1">
                <div class="card-body ">
                  <div class="row">
                    <div class="col-md-6">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('block.minerName') }}</template>
                          <template slot="help">{{ $t('block.minerNameHelp') }}</template>
                          <template slot="value">{{block.payload}}</template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.publicKey') }}</template>
                          <template slot="help">{{ $t('block.minerKeyHelp') }}</template>
                          <template slot="value">
                            <public-key :pubkey="block.publicKey"></public-key>
                          </template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('block.minerProtocol') }}</template>
                          <template slot="help">{{ $t('block.minerProtocolHelp') }}</template>
                          <template slot="value">{{block.verA}}</template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-6">
                      <dl>
                        <info-value :help="false">
                          <template slot="label">{{ $t('block.target') }}</template>
                          <template slot="value">{{block.target}}</template>
                        </info-value>
                        <info-value :help="false">
                          <template slot="label">{{ $t('block.nonce') }}</template>
                          <template slot="value">{{block.nonce}}</template>
                        </info-value>
                        <info-value :help="false">
                          <template slot="label">{{ $t('block.hashrate') }}</template>
                          <template slot="value">{{block.hashratekhs}} KH/s</template>
                        </info-value>
                        <info-value :help="false">
                          <template slot="label">{{ $t('block.pow') }}</template>
                          <template slot="value">{{block.pow.toHex()}}</template>
                        </info-value>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <h3 class="title mb-0">{{block.operations}} Operations</h3>
              <hr class="block-background block-color">
              <operations-list v-bind:operations="operations"></operations-list>
              <pagination
                      :total-pages="Math.ceil(block.operations / operationsAmount)"
                      :total="block.operations"
                      :per-page="operationsAmount"
                      :current-page="opsPage"
                      @pagechanged="onPageChange"
              />
            </div>
            <div class="col-md-12">
              <h3 class="title mb-0">{{ $t('block.createdAccounts') }}</h3>
              <accounts-list v-bind:accounts="accounts"></accounts-list>
            </div>
          </div>
          <disqus></disqus>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import OperationsList from '../components/OperationsList.vue';
import AccountsList from '../components/AccountsList.vue';
import Parnian from '../components/Parnian.vue';
import Pagination from '../components/Pagination.vue';
import Date from '../components/Date.vue';
import PublicKey from '../components/PublicKey.vue';
import InfoValue from '../components/InfoValue.vue';
import Social from '../components/Social.vue';
import Disqus from '../components/Disqus.vue';
import Loading from '../components/Loading.vue';

export default {
  name: 'block',
  data() {
    return {
      opsPage: 1,
      operationsAmount: 5,
      help: {},
    };
  },
  components: {
    OperationsList,
    Parnian,
    AccountsList,
    Pagination,
    Date,
    PublicKey,
    InfoValue,
    Social,
    Disqus,
    Loading,
  },
  methods: {
    onPageChange(page) {
      this.opsPage = page;
      this.redirect(this.block.block);
    },
    redirect(block) {
      this.$router.push({
        name: 'block',
        params: {
          block,
        },
        query: {
          ops_page: this.opsPage,
        },
      });
    },
    fetchAllData(blockNumber) {
      this.fetchOperationData(blockNumber);
      return this.fetchBlockData({
        blockNumber,
      });
    },
    fetchOperationData(blockNumber) {
      return this.fetchBlockOperations({
        blockNumber,
        operationsPage: this.opsPage,
        operationsAmount: this.operationsAmount,
      });
    },
    ...mapActions('block', [
      'fetchBlockData',
      'fetchBlockOperations',
    ]),
  },
  computed: {
    ...mapState({
      block: state => state.block.block,
      doesNotExist: state => state.block.doesNotExist,
      blockCount: state => state.blockCount,
      latestBlock: state => state.latestBlock,
      operations: state => state.block.operations,
      accounts: state => state.block.accounts,
    }),
  },
  watch: {
    latestBlock() {
      if (this.latestBlock === Number(this.$router.currentRoute.params.block) && this.doesNotExist === true) {
        this.fetchAllData(this.$router.currentRoute.params.block);
      }
    },
  },
  created() {
    this.opsPage = parseInt(this.$route.query.ops_page, 10) || 1;
    this.fetchAllData(this.$route.params.block);
  },
  beforeRouteUpdate(to, from, next) {
    this.opsPage = parseInt(to.query.ops_page, 10) || 1;
    if (to.params.block !== this.block.block) {
      this.fetchAllData(to.params.block).then(() => {
        next();
      });
    } else {
      this.fetchOperationData(to.params.block).then(() => {
        next();
      });
    }
    // next();
  },
};
</script>


<style scoped lang="scss">
  @import "./../assets/settings";
  .page-header {
    background-color: $parc-color-block;
  }
</style>
