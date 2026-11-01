<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <div class="table-responsive">
        <table class="table table-striped" style="width: 100%;">
            <thead>
            <tr>
                <th>#</th>
                <th>{{ $t('common.name') }}</th>
                <th>{{ $t('common.balance') }}</th>
                <th>{{ $t('common.numOperations') }}</th>
                <th>{{ $t('common.type') }}</th>
                <th>{{ $t('common.price') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="account in accounts" :key="account.account.account">
                <td>
                    <i v-if="account.isForSale()" class="fa fa-shopping-cart"></i>
                    <router-link
                            :to="{name: 'account', params: { account: account.account.account }}">
                        <account-number :account="account.account"></account-number>
                    </router-link>
                </td>
                <td>{{account.name}}</td>
                <td><parnian :amount="account.balance"></parnian></td>
                <td>{{account.nOperation}}</td>
                <td>{{account.type}}</td>
                <td><parnian v-if="isListed(account)" :amount="account.price"></parnian></td>
            </tr>
            </tbody>
        </table>
        <div v-if="accounts.length === 0" class="alert bg-light">
            <div class="container">
                <div class="alert-icon">
                    <i class="material-icons">info_outline</i>
                </div>
                <b>{{ $t('common.info') }}</b> {{ $t('lists.noAccounts') }}
            </div>
        </div>
    </div>
</template>

<script>

import Account from 'parniancoin/src/Types/Account';
import AccountNumber from './AccountNumber.vue';
import Parnian from './Parnian.vue';

export default {
  name: 'accounts-list',
  props: ['accounts'],
  components: {
    AccountNumber,
    Parnian,
  },
  methods: {
    isListed(account) {
      return account.state === Account.STATE_LISTED;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
