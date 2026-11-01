<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
            <tr>
                <th>#</th>
                <th>{{ $t('common.date') }}</th>
                <th>{{ $t('common.miner') }}</th>
                <th class="text-right">{{ $t('common.operations') }}</th>
                <th class="text-right">{{ $t('common.volume') }}</th>
                <th class="text-right">{{ $t('common.fee') }}</th>
                <th class="text-right">{{ $t('common.reward') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="block in blocks" :key="block.block">
                <td>
                    <block-number :block="block.block"></block-number>
                </td>
                <td>
                    <date :timestamp="block.timestamp"></date><br />
                    <small v-if="block.raw.explorer.stats.duration !== null">
                      {{ $t('common.durationLabel', { n: block.raw.explorer.stats.duration }) }}
                    </small>
                </td>
                <td>{{block.payload}}</td>
                <td class="text-right">{{block.operations}}</td>
                <td class="text-right">
                    <parnian :amount="block.raw.explorer.stats.volume"
                             :lif="-1"
                             :liflabel="$t('common.unknown')"></parnian>
                  </td>
                <td class="text-right"><parnian :amount="block.fee"></parnian></td>
                <td class="text-right"><parnian :amount="block.reward"></parnian></td>
            </tr>
            </tbody>
        </table>
        <div v-if="blocks.length === 0">{{ $t('lists.noBlocks') }}</div>
    </div>
</template>

<script>

import Date from './Date.vue';
import BlockNumber from './BlockNumber.vue';
import Parnian from './Parnian.vue';

export default {
  name: 'blocks-list',
  props: ['blocks'],
  components: {
    Date,
    BlockNumber,
    Parnian,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
