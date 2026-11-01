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
                <th>{{ $t('common.opBlock') }}</th>
                <th>{{ $t('common.block') }}</th>
                <th>{{ $t('common.time') }}</th>
                <th>{{ $t('common.type') }}</th>
                <th class="text-right">{{ $t('common.amount') }}</th>
                <th class="text-right">{{ $t('common.fee') }}</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(operation, idx) in operations">
            <tr :key="`op${idx}`">
                <td v-if="operation.isPending() && !operation.isBlockchainReward()" colspan="2">
                    <operation-link :label="$t('common.pending')" :ophash="operation.opHash"></operation-link>
                </td>
                <td v-if="!operation.isPending() && !operation.isBlockchainReward()">
                    <operation-link :label="operation.opblock + '/' + operation.block" :ophash="operation.opHash"></operation-link>
                </td>
                <td v-if="!operation.isPending() && operation.isBlockchainReward()">
                    <block-number :block="operation.block"></block-number>
                </td>
                <td v-if="!operation.isPending()">
                    <block-number :block="operation.block"></block-number>
                </td>
                <td>
                    <span v-if="operation.time === 0">XXX</span>
                    <date v-if="operation.time > 0" :timestamp="operation.time"></date>
                </td>
                <td width="100%">
                    <operation-type :operation="operation"></operation-type>
                    <payload v-if="operation.payload.length > 0" :value="operation.payload"></payload>
                </td>
                <td class="text-right">
                    <parnian :amount="operation.amount.toPositive()"></parnian>
                </td>
                <td><parnian :amount="operation.fee.toPositive()"></parnian></td>
            </tr>
            <tr :key="`optext${idx}`">
                <td colspan="10"><strong><operation-text-short :operation="operation"></operation-text-short></strong></td>
            </tr>
            </template>
            </tbody>
        </table>
        <div v-if="operations.length === 0" class="alert bg-light">
            <div class="container">
                <div class="alert-icon">
                    <i class="material-icons">info_outline</i>
                </div>
                <b>{{ $t('common.info') }}</b> {{ $t('lists.noOperations') }}
            </div>
        </div>
    </div>

</template>

<script>
import Parnian from './Parnian.vue';
import OperationType from './OperationType.vue';
import Date from './Date.vue';
import BlockNumber from './BlockNumber.vue';
import OperationLink from './OperationLink.vue';
import OperationTextShort from './OperationTextShort.vue';
import Payload from './Payload.vue';

export default {
  name: 'operations-list',
  props: ['operations'],
  components: {
    BlockNumber,
    Parnian,
    OperationType,
    Date,
    OperationLink,
    Payload,
    OperationTextShort,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
