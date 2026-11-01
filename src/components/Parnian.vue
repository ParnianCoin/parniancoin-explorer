<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <span>
  <span class="parc" v-if="lif != amount.value.toFixed(0)">{{amount.value.toFixed(decimals !== undefined ? decimals : 4)}} PARC</span>
  <span v-if="lif == amount.value.toFixed(0)">{{liflabel}}</span>
    </span>
</template>

<script>
export default {
  name: 'parnian',
  props: ['amount', 'decimals', 'lif', 'liflabel'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    code {
        font-family: inherit;
    }
</style>
