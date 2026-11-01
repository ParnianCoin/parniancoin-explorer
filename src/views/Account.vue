<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <div>
    <div v-if="account === null" class="insite">
      <loading
        :title="$t('common.account')"
        cls="account"
        :show-error="doesNotExist"
        :error="$t('common.notFoundAccount')"></loading>
    </div>
  <div v-if="account !== null" class="insite">
    <social></social>
    <div class="page-header header-filter">
      <div class="container">
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto text-center">
            <h1 class="title">Account <account-number :complement="true" :account="account.account"></account-number></h1>
            <p v-if="account.isForSale()" class="bootstrap-tagsinput rose-badge">
                <span class="tag badge">
                  {{ $t('account.forSale') }} <parnian :amount="account.price"></parnian>
                </span>
              </p>
            <p>
              last updated in block <block-number complement="true" :block="account.updatedB"></block-number>
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
          <div style="position: absolute; top: -24px; right: 18px; white-space: nowrap">
            <router-link
                    :to="{name: 'account', params: { account: account.account.account - 1}}"
                    class="btn btn-account-color btn-fill"
                    v-if="account.account.account > 0">
              &laquo; <account-number hidelink="true" :account="newAccountNumber(account.account.account - 1)"></account-number>
              <div class="ripple-container"></div>
            </router-link>
            <router-link
                    :to="{name: 'account', params: { account: account.account.account + 1}}"
                    class="btn btn-account-color btn-fill"
                    v-if="account.account.account < accountCount">
            <account-number hidelink="true" :account="newAccountNumber(account.account.account + 1)"></account-number> &raquo;
              <div class="ripple-container"></div>
            </router-link>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h3 class="title mb-0 mt-0">{{ $t('account.data') }}</h3>
              <div class="card mt-1 block-bgcolor-dark">
                <div class="card-body ">
                  <!--h6 class="card-category text-white">
                      <i class="material-icons">trending_up</i> Block Key Data
                  </h6-->
                  <div class="row">
                    <div class="col-md-6">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('account.number') }}</template>
                          <template slot="help">{{ $t('account.numberHelp') }}</template>
                          <template slot="value">
                        <account-number :complement="true"
                                        :hidelink="true"
                                        :account="account.account"></account-number>
                      </template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.name') }}</template>
                          <template slot="help">{{ $t('account.nameHelp') }}</template>
                          <template slot="value">
                            <span v-if="account.name === ''">{{ $t('account.noName') }}</span>
                            <span v-if="account.name !== ''">{{account.name}}</span>
                          </template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.type') }}</template>
                          <template slot="help">{{ $t('account.typeHelp') }}</template>
                          <template slot="value">{{account.type}}</template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-6">
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.balance') }}</template>
                        <template slot="help">{{ $t('account.balanceHelp') }}</template>
                        <template slot="value">
                          <parnian :amount="account.balance"></parnian>
                        </template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('account.numOperations') }}</template>
                        <template slot="help">{{ $t('account.numOperationsHelp') }}</template>
                        <template slot="value">{{account.nOperation}}</template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('account.initialOwner') }}</template>
                        <template slot="help">{{ $t('account.initialOwnerHelp') }}</template>
                        <template slot="value">
                          <span v-if="isDeveloperAccount">{{ $t('account.developer') }}</span>
                          <span v-else>
                            {{ $t('account.minerOfBlock') }}
                            <block-number :block="creatingBlock"></block-number>
                          </span>
                        </template>
                      </info-value>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h3 class="title mb-0 mt-0">{{ $t('account.info') }}</h3>
              <div class="card mt-1">
                <div class="card-body ">
                  <dl>
                    <info-value :help="true">
                      <template slot="label">{{ $t('account.owningKey') }}</template>
                      <template slot="help">{{ $t('account.owningKeyHelp') }}</template>
                      <template slot="value">
                        <public-key :pubkey="account.publicKey"></public-key>
                      </template>
                    </info-value>
                    <info-value :help="true">
                      <template slot="label">{{ $t('account.createdIn') }}</template>
                      <template slot="help">{{ $t('account.createdInHelp') }}</template>
                      <template slot="value"><block-number :block="account.account.createdInBlock"></block-number></template>
                    </info-value>
                    <info-value :help="true">
                      <template slot="label">{{ $t('account.lastOperation') }}</template>
                      <template slot="help">{{ $t('account.lastOperationHelp') }}</template>
                      <template slot="value"><block-number :block="account.updatedB"></block-number></template>
                    </info-value>
                    <info-value :help="true">
                      <template slot="label">{{ $t('common.state') }}</template>
                      <template slot="help">{{ $t('account.stateHelp') }}</template>
                      <template slot="value">{{account.state}}</template>
                    </info-value>
                  </dl>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <h3 class="title mb-0 mt-0">{{ $t('account.salesInfo') }}</h3>
              <div class="card mt-1">
                <div class="card-body" v-if="!account.isForSale()">
                  {{ $t('account.notForSale') }}
                </div>
                <div class="card-body" v-if="account.isForSale()">
                  <div v-if="account.privateSale" class="alert bg-light">
                    <div class="container">
                      <div class="alert-icon">
                        <i class="material-icons">info_outline</i>
                      </div>
                      <b>{{ $t('common.info') }}</b> {{ $t('account.privateSale') }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.price') }}</template>
                          <template slot="help">{{ $t('account.priceHelp') }}</template>
                          <template slot="value">
                            <parnian :amount="account.price"></parnian>
                          </template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-4">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.seller') }}</template>
                          <template slot="help">
                            {{ $t('account.sellerHelp') }}
                          </template>
                          <template slot="value">
                            <account-number :account="account.sellerAccount"></account-number>
                          </template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-4">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('account.lockedUntil') }}</template>
                          <template slot="help">{{ $t('account.lockedUntilHelp') }}</template>
                          <template slot="value">{{account.lockedUntilBlock}}</template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-12" v-if="account.privateSale">
                      <dl>
                        <info-value :help="true" v-if="account.privateSale">
                          <template slot="label">{{ $t('account.newPublicKey') }}</template>
                          <template slot="help">{{ $t('account.newPublicKeyHelp') }}</template>
                          <template slot="value">
                            <public-key pubkey="account.new_enc_pubkey"></public-key>
                          </template>
                        </info-value>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              <div class="col-md-12">
                  <h3 class="title mb-0">{{ $t('account.states') }}</h3>
                  <div class="table-responsive">
                      <table class="table table-striped">
                          <thead>
                          <tr>
                              <th>{{ $t('common.operation') }}</th>
                              <th>{{ $t('account.fromBlock') }}</th>
                              <th>{{ $t('account.toBlock') }}</th>
                              <th>{{ $t('common.name') }}</th>
                              <th>{{ $t('common.type') }}</th>
                              <th>{{ $t('common.publicKey') }}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <template v-for="(owner, idx) in account.raw.explorer.public_keys">
                          <tr :key="`owner${idx}`">
                              <td>
                                  <operation-link v-if="owner.op !== undefined"
                                                  :label="`${owner.block}/${owner.opblock}`"
                                                  :ophash="owner.op.opHash"></operation-link>
                                  <block-number v-if="owner.op === undefined"
                                                :label="$t('common.created')"
                                                :block="owner.block"></block-number>
                              </td>
                              <td>
                                  <block-number :block="owner.block"></block-number>
                              </td>
                            <td>
                                  <span v-if="account.raw.explorer.public_keys[idx-1] !== undefined">
                                      <block-number :block="account.raw.explorer.public_keys[idx-1].block"></block-number>
                                  </span>
                            </td>
                            <td>
                                  <span>
                                      {{owner.name}}
                                  </span>
                            </td>
                            <td>
                                    {{owner.type}}
                            </td>
                              <td class="pubkey"><public-key :pubkey="owner.enc_pubkey"></public-key></td>
                          </tr>
                            <tr v-if="owner.op !== undefined" :key="`ownerop${idx}`">
                              <td colspan="10"><operation-text-short :operation="owner.op"></operation-text-short></td>
                            </tr>
                          </template>
                          </tbody>
                      </table>
                  </div>
              </div>
              <div class="col-md-12">
              <h3 class="title mb-0">{{ $t('common.operations') }}</h3>
              <operations-list v-bind:operations="operations"></operations-list>
              <pagination
                      :total-pages="-1"
                      :total="-1"
                      :per-page="operationsAmount"
                      :current-page="opsPage"
                      @pagechanged="onPageChange"
              />
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
import AccountNumberObj from 'parniancoin/src/Types/AccountNumber';
import AccountNumber from '../components/AccountNumber.vue';
import BlockNumber from '../components/BlockNumber.vue';
import OperationsList from '../components/OperationsList.vue';
import Pagination from '../components/Pagination.vue';
import Parnian from '../components/Parnian.vue';
import InfoValue from '../components/InfoValue.vue';
import PublicKey from '../components/PublicKey.vue';
import OperationLink from '../components/OperationLink.vue';
import OperationTextShort from '../components/OperationTextShort.vue';
import Social from '../components/Social.vue';
import Disqus from '../components/Disqus.vue';
import Loading from '../components/Loading.vue';
import { isDeveloperAccount, creatingBlock } from '../parnian/protocol';

export default {
  name: 'account',
  data() {
    return {
      opsPage: 1,
      operationsAmount: 10,
    };
  },
  components: {
    OperationTextShort,
    OperationLink,
    PublicKey,
    AccountNumber,
    OperationsList,
    Pagination,
    Parnian,
    BlockNumber,
    InfoValue,
    Social,
    Disqus,
    Loading,
  },
  methods: {
    newAccountNumber(acc) {
      return new AccountNumberObj(acc);
    },
    onPageChange(page) {
      this.opsPage = page;
      this.redirect(this.account.account.account);
    },
    redirect(account) {
      this.$router.push({
        name: 'account',
        params: {
          account,
        },
        query: {
          ops_page: this.opsPage,
        },
      });
    },
    fetchData(account) {
      this.fetchOperations({
        account,
        operationsPage: this.opsPage,
        operationsAmount: this.operationsAmount,
      });

      return this.fetchAccountData({
        account,
        operationsPage: this.opsPage,
        operationsAmount: this.operationsAmount,
      });
    },
    ...mapActions('account', [
      'fetchAccountData',
      'fetchOperations',
    ]),
  },
  watch: {
    accountCount() {
      if (this.accountCount >= parseInt(this.$router.currentRoute.params.account, 10) && this.doesNotExist === true) {
        this.fetchData(this.$router.currentRoute.params.account);
      }
    },
  },
  computed: {
    /**
     * The last of the five accounts a block creates receives the developer
     * share of the block reward; the other four belong to the miner.
     */
    isDeveloperAccount() {
      return this.account !== null && isDeveloperAccount(this.account.account.account);
    },
    creatingBlock() {
      return this.account === null ? 0 : creatingBlock(this.account.account.account);
    },
    ...mapState({
      doesNotExist: state => state.account.doesNotExist,
      account: state => state.account.account,
      operations: state => state.account.operations,
      accountCount: state => state.accountCount,
    }),
  },
  created() {
    this.opsPage = parseInt(this.$route.query.ops_page, 10) || 1;
    this.fetchData(this.$route.params.account);
  },
  beforeRouteUpdate(to, from, next) {
    this.opsPage = parseInt(to.query.ops_page, 10) || 1;
    if (to.params.account !== this.account.account.account) {
      this.fetchData(to.params.account).then(() => {
        next();
      });
    } else {
      this.fetchOperations({
        account: to.params.account,
        operationsPage: this.opsPage,
        operationsAmount: this.operationsAmount,
      }).then(() => {
        next();
      });
    }
  },
};
</script>

<style scoped lang="scss">
  @import "./../assets/settings";
  .page-header {
    background-color: $parc-color-account;
  }
</style>
