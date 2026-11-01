<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <div>
    <div v-if="operation=== null" class="insite">
      <loading :title="$t('operation.heading')" cls="operation"></loading>
    </div>
  <div v-if="operation !== null" class="insite">
      <social></social>
    <div class="page-header header-filter">
      <div class="container">
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto text-center">
            <h1 class="title">Operation {{operation.block}}/{{operation.opblock}}</h1>
            <p>
              <span v-if="operation.isPending()">{{ $t('operation.pending') }}</span>
              <span v-if="!operation.isPending()">
                created in block <block-number complement="true" :block="operation.block"></block-number>
              </span>
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
                    :to="{name: 'block', params: { block: operation.block} }"
                    class="btn btn-fab btn-account-color btn-round">
              <i class="fa fa-arrow-left"></i><div class="ripple-container"></div>
            </router-link>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h3 class="title mb-0 mt-0">{{ $t('operation.data') }}</h3>
              <div class="card mt-1 operation-bgcolor-dark">
                <div class="card-body ">
                  <div class="row">
                    <div class="col-md-6">
                      <dl>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.type') }}</template>
                          <template slot="help">{{ $t('operation.typeHelp') }}</template>
                          <template slot="value"><operation-type :operation="operation"></operation-type></template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.date') }}</template>
                          <template slot="help">{{ $t('operation.dateHelp') }}</template>
                          <template slot="value"><date :timestamp="operation.time" class="text-white"></date></template>
                        </info-value>
                        <info-value :help="true">
                          <template slot="label">{{ $t('common.signer') }}</template>
                          <template slot="help">{{ $t('operation.signerHelp') }}</template>
                          <template slot="value">
                        <account-number :account="operation.signerAccount"
                                        :complement="true"></account-number>
                      </template>
                        </info-value>
                      </dl>
                    </div>
                    <div class="col-md-6">
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.block') }}</template>
                        <template slot="help">{{ $t('operation.blockHelp') }}</template>
                        <template slot="value">
                          <block-number :block="operation.block"></block-number>
                        </template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('operation.opBlock') }}</template>
                        <template slot="help">{{ $t('operation.opBlockHelp') }}</template>
                        <template slot="value">
                        {{ $t('operation.position', { position: operation.opblock }) }}
                        <span v-if="block !== null">
                          {{ $t('operation.positionOf', { total: block.operations }) }}
                        </span>
                      </template>
                      </info-value>
                      <info-value :help="true">
                        <template slot="label">{{ $t('common.maturation') }}</template>
                        <template slot="help">{{ $t('common.maturationHelp') }}</template>
                        <template slot="value">{{operation.maturation}} Blocks</template>
                      </info-value>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h4 class="title"><operation-type :operation="operation"></operation-type></h4>
              <operation-text :operation="operation"></operation-text>
            </div>
            <div class="col-md-12">
              <h3 class="title">{{ $t('operation.accountStates') }}</h3>
              <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                <tr>
                  <th>{{ $t('common.account') }}</th>
                  <th>{{ $t('common.name') }}</th>
                  <th class="text-right">{{ $t('common.type') }}</th>
                  <th>{{ $t('common.publicKey') }}</th>
                </tr>
                </thead>
                <tbody v-for="(account_state, idx) in operation.raw.explorer.account_states" :key="idx">
                <tr>
                  <td><account-number :account="account_state.before.account"></account-number></td>
                  <td>{{ account_state.before.name }}</td>
                  <td class="text-right">{{ account_state.before.type }}</td>
                  <td class="pubkey"><public-key :pubkey="account_state.before.enc_pubkey"></public-key></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>{{ account_state.after.name}}</td>
                  <td class="text-right">{{ account_state.after.type}}</td>
                  <td class="pubkey"><public-key :pubkey="account_state.after.enc_pubkey"></public-key></td>
                </tr>
               </tbody>
              </table>
              </div>
            </div>
            <div class="col-md-12">
              <div v-if="operation.isMultiOperation()">
                <h3 class="title">{{ $t('operation.senders') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('operation.sender') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(sender, idx) in operation.senders" :key="idx">
                    <td><account-number :account="sender.account"></account-number></td>
                    <td><payload :value="sender.payload"></payload></td>
                    <td class="text-right"><parnian :amount="sender.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>

                  </tbody>
                </table>
                </div>
                <h3 class="title">{{ $t('operation.receivers') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('operation.receiver') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(receiver, idx) in operation.receivers" :key="idx">
                    <td><account-number :account="receiver.account"></account-number></td>
                    <td><payload :value="receiver.payload"></payload></td>
                    <td class="text-right"><parnian :amount="receiver.amount"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                </div>

                <h3 class="title">{{ $t('operation.changers') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('operation.newPublicKey') }}</th>
                    <th>{{ $t('operation.newName') }}</th>
                    <th>{{ $t('operation.newType') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(changer, idx) in operation.changers" :key="idx">
                    <td><account-number :account="changer.account"></account-number></td>
                    <td><public-key :pubkey="changer.newPublicKey"></public-key></td>
                    <td>{{changer.newName}}</td>
                    <td>{{changer.newType}}</td>
                  </tr>
                  </tbody>
                </table>
                </div>

              </div>
              <div v-if="operation.isChangeAccountInfo()">
                <h3 class="title">{{ $t('operation.changers') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('operation.newName') }}</th>
                    <th>{{ $t('operation.newType') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(changer, idx) in operation.changers" :key="idx">
                    <td><account-number :account="changer.account"></account-number></td>
                    <td>{{changer.newName}}</td>
                    <td>{{changer.newType}}</td>
                    <td><payload :value="operation.payload"></payload></td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <div v-if="operation.isDelist()">
                <h3 class="title">{{ $t('operation.changers') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.signer') }}</th>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(changer, idx) in operation.changers" :key="idx">
                    <td><account-number :account="operation.signerAccount"></account-number></td>
                    <td><account-number :account="changer.account"></account-number></td>
                    <td><payload :value="operation.payload"></payload></td>
                    <td class="text-right"><parnian :amount="operation.amount"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td colspan="2"></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td colspan="2"></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td colspan="2"></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
                <div v-if="operation.isListForSale()">
                <h3 class="title">{{ $t('operation.changers') }}</h3>
                  <div class="table-responsive">

                  <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('common.seller') }}</th>
                    <th>{{ $t('common.price') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(changer, idx) in operation.changers" :key="idx">
                    <td><account-number :account="changer.account"></account-number></td>
                    <td><account-number :account="changer.sellerAccount"></account-number></td>
                    <td><parnian :amount="changer.accountPrice"></parnian></td>
                    <td><payload :value="operation.payload"></payload></td>
                    <td class="text-right"><parnian :amount="operation.amount"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                  </div>
              </div>
                <div v-if="operation.isTransaction()">
                <h3 class="title">{{ $t('operation.transfers') }}</h3>
                  <div class="table-responsive">

                  <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.from') }}</th>
                    <th>{{ $t('common.to') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(sender, idx) in operation.senders" :key="idx">
                    <td><account-number :account="sender.account"></account-number></td>
                    <td><account-number :account="operation.receivers[idx].account"></account-number></td>
                    <td><payload :value="sender.payload"></payload></td>
                    <td class="text-right"><parnian :amount="operation.receivers[idx].amount"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td colspan="2"></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td colspan="2"></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td colspan="2"></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.senders[0].amount.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                  </div>
              </div>
              <div v-if="operation.isChangeKeyAccount()">
                <h3 class="title">{{ $t('operation.changes') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.signer') }}</th>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('operation.newPublicKey') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th>{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><account-number :account="operation.signerAccount"></account-number></td>
                    <td><account-number :account="operation.changers[0].account"></account-number></td>
                    <td class="pubkey"><public-key :pubkey="operation.changers[0].newPublicKey"></public-key></td>
                    <td><payload :value="operation.payload"></payload></td>
                    <td><parnian :amount="operation.amount"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>

                  </tbody>
                </table>
                </div>
              </div>
              <div v-if="operation.isChangeKey()">
                <h3 class="title">{{ $t('operation.changes') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('operation.newPublicKey') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><account-number :account="operation.changers[0].account"></account-number></td>
                    <td class="pubkey"><public-key :pubkey="operation.changers[0].newPublicKey"></public-key></td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <div v-if="operation.isBuy()">
                <h3 class="title">{{ $t('operation.changes') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.signer') }}</th>
                    <th>{{ $t('common.account') }}</th>
                    <th>{{ $t('operation.newPublicKey') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(changer, idx) in operation.changers" :key="idx">
                    <td><account-number :account="operation.signerAccount"></account-number></td>
                    <td><account-number :account="changer.account"></account-number></td>
                    <td class="pubkey"><public-key :pubkey="changer.newPublicKey"></public-key></td>
                  </tr>
                  </tbody>
                </table>
                </div>
                <h3 class="title">{{ $t('operation.transfers') }}</h3>
                <div class="table-responsive">

                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>{{ $t('common.signer') }}</th>
                    <th>{{ $t('common.from') }}</th>
                    <th>{{ $t('common.to') }}</th>
                    <th>{{ $t('common.payload') }}</th>
                    <th class="text-right">{{ $t('common.amount') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(receiver, idx) in operation.receivers" :key="idx">
                    <td><account-number :account="operation.signerAccount"></account-number></td>
                    <td><account-number :account="operation.senders[0].account"></account-number></td>
                    <td><account-number :account="receiver.account"></account-number></td>
                    <td><payload :value="receiver.payload"></payload></td>
                    <td class="text-right"><parnian :amount="receiver.amount"></parnian></td>
                  </tr>
                  <tr class="subtotal">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.subtotal') }}</td>
                    <td class="text-right"><parnian :amount="operation.amount.toPositive()"></parnian></td>
                  </tr>
                  <tr class="fee">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.fee') }}</td>
                    <td class="text-right"><parnian :amount="operation.fee.toPositive()"></parnian></td>
                  </tr>
                  <tr class="total">
                    <td colspan="3"></td>
                    <td class="text-right">{{ $t('common.total') }}</td>
                    <td class="text-right"><parnian :amount="operation.senders[0].amount.toPositive()"></parnian></td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
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
import AccountNumber from '../components/AccountNumber.vue';
import BlockNumber from '../components/BlockNumber.vue';
import Parnian from '../components/Parnian.vue';
import InfoValue from '../components/InfoValue.vue';
import Date from '../components/Date.vue';
import PublicKey from '../components/PublicKey.vue';
import OperationType from '../components/OperationType.vue';
import Payload from '../components/Payload.vue';
import OperationText from '../components/OperationText.vue';
import Social from '../components/Social.vue';
import Disqus from '../components/Disqus.vue';
import Loading from '../components/Loading.vue';

export default {
  name: 'operation',
  components: {
    OperationType,
    PublicKey,
    AccountNumber,
    Parnian,
    BlockNumber,
    InfoValue,
    Date,
    Payload,
    OperationText,
    Social,
    Disqus,
    Loading,
  },
  methods: {
    redirect(ophash) {
      this.$router.push({
        name: 'operation',
        params: {
          ophash,
        },
      });
    },
    fetchData(ophash) {
      return this.fetchOperationData({
        ophash,
      });
    },
    ...mapActions('operation', [
      'fetchOperationData',
    ]),
  },
  computed: {
    ...mapState({
      operation: state => state.operation.operation,
      block: state => state.operation.block,
    }),
  },
  created() {
    this.fetchData(this.$route.params.ophash);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params.ophash).then(() => {
      next();
    });
  },
};
</script>

<style scoped lang="scss">
  @import "./../assets/settings";
  .page-header {
    background-color: $parc-color-operations;
  }
</style>
