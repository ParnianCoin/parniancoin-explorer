<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <span>
    <i18n v-if="operation.fee.toTar() < 0" path="opText.feePaid" tag="span">
      <account-number place="account" :account="operation.signerAccount"></account-number>
      <parnian place="fee" :amount="operation.fee.toPositive()"></parnian>
    </i18n>
    <i18n v-if="operation.fee.toTar() === 0" path="opText.noFee" tag="span">
      <account-number place="account" :account="operation.signerAccount"></account-number>
    </i18n>
  </span>
</template>

<script>

import AccountNumber from './AccountNumber.vue';
import Parnian from './Parnian.vue';

/**
 * The "who paid how much fee" sentence, repeated after almost every operation
 * description. Kept in its own component so the sentence exists once.
 */
export default {
  name: 'fee-text',
  props: ['operation'],
  components: {
    AccountNumber,
    Parnian,
  },
};
</script>

<style scoped lang="scss">
</style>
