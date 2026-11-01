<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
<span>
  <!--
    Short one line summaries. Same rule as OperationText: one translation key
    per sentence with named places, never fragments glued together, because
    Persian and Arabic put the verb and the objects in a different order.
  -->
  <span v-if="operation.isBlockchainReward()">
    {{ $t('opText.reward') }}
  </span>

  <span v-if="operation.isTransaction()">
    <span v-if="operation.subtype === 12">
      <i class="fas fa-arrow-right"></i>
      <i18n path="opText.received" tag="span">
        <account-number place="receiver" :account="operation.receivers[0].account"></account-number>
        <parnian place="amount" :amount="operation.receivers[0].amount"></parnian>
        <account-number place="sender" :account="operation.senders[0].account"></account-number>
      </i18n>
    </span>
    <span v-if="operation.subtype === 11">
      <i class="fas fa-arrow-left"></i>
      <i18n path="opText.sentShort" tag="span">
        <account-number place="sender" :account="operation.senders[0].account"></account-number>
        <parnian place="amount" :amount="operation.receivers[0].amount"></parnian>
        <account-number place="receiver" :account="operation.receivers[0].account"></account-number>
      </i18n>
    </span>
  </span>

  <span v-if="operation.isChangeKey()">
    <i class="fas fa-user-lock"></i>
    <i18n path="opText.keyChangedShort" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <span place="curve">{{ operation.changers[0].newPublicKey.curve.name }}</span>
    </i18n>
  </span>

  <span v-if="operation.isRecoverFunds()">
    {{ $t('opText.recover') }}
  </span>

  <span v-if="operation.isListForSale()">
    <i class="fas fa-shopping-cart"></i>
    <i18n path="opText.listedShort" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <parnian place="price" :amount="operation.changers[0].accountPrice"></parnian>
    </i18n>
  </span>

  <span v-if="operation.isDelist()">
    <span class="fa-stack fa-2x">
      <i class="fas fa-shopping-cart fa-stack-1x"></i>
      <i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
    </span>
    <i18n path="opText.delistedShort" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
    </i18n>
  </span>

  <span v-if="operation.isBuy()">
    <i class="fas fa-cash-register"></i>
    <i18n path="opText.boughtShort" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <account-number place="buyer" :account="operation.account"></account-number>
      <parnian place="price" :amount="operation.receivers[1].amount"></parnian>
      <account-number place="seller" :account="operation.receivers[1].account"></account-number>
    </i18n>
  </span>

  <span v-if="operation.isChangeKeyAccount()">
    <i class="fas fa-user-lock"></i>
    <i18n path="opText.keyChangedBy" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <account-number place="signer" :account="operation.signerAccount"></account-number>
      <span place="curve">{{ operation.changers[0].newPublicKey.curve.name }}</span>
    </i18n>
  </span>

  <span v-if="operation.isChangeAccountInfo()">
    <i class="fas fa-cogs"></i>
    <i18n v-if="renamed && !retyped" path="opText.renamed" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <code place="name">{{ operation.changers[0].newName }}</code>
    </i18n>
    <i18n v-if="!renamed && retyped" path="opText.retyped" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <code place="type">{{ operation.changers[0].newType }}</code>
    </i18n>
    <i18n v-if="renamed && retyped" path="opText.renamedRetyped" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <code place="name">{{ operation.changers[0].newName }}</code>
      <code place="type">{{ operation.changers[0].newType }}</code>
    </i18n>
  </span>

  <span v-if="operation.isMultiOperation()">
    <i class="fas fa-exchange-alt"></i>
    <i18n path="opText.multi" tag="span">
      <span place="senderCount">{{ operation.senders.length }}</span>
      <span place="senders">
        <span v-for="(sender, idx) in operation.senders" :key="`s${idx}`">
          <account-number :account="sender.account"></account-number>
          <span v-if="idx + 1 < operation.senders.length">, </span>
        </span>
      </span>
      <parnian place="amount" :amount="operation.amount"></parnian>
      <span place="receiverCount">{{ operation.receivers.length }}</span>
      <span place="receivers">
        <span v-for="(receiver, idx) in operation.receivers" :key="`r${idx}`">
          <account-number :account="receiver.account"></account-number>
          <span v-if="idx + 1 < operation.receivers.length">, </span>
        </span>
      </span>
    </i18n>
  </span>

  <span v-if="operation.isData()">
    {{ $t('opText.data') }}
  </span>
</span>
</template>

<script>

import AccountNumber from './AccountNumber.vue';
import Parnian from './Parnian.vue';

export default {
  name: 'operation-text-short',
  props: ['operation'],
  components: {
    AccountNumber,
    Parnian,
  },
  computed: {
    renamed() {
      return this.operation.changers[0].newName !== null;
    },
    retyped() {
      return this.operation.changers[0].newType !== null;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
