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
    Every sentence is a single translation key with named places, so a
    translator can move the account, amount and verb wherever the grammar of
    the language puts them. Persian and Arabic order these very differently
    from English, which is why the sentences are not stitched together from
    fragments.
  -->
  <span v-if="operation.isBlockchainReward()">
    {{ $t('opText.reward') }}
  </span>

  <span v-if="operation.isTransaction()">
    <i18n path="opText.sent" tag="span">
      <account-number place="sender" :account="operation.senders[0].account"></account-number>
      <parnian place="amount" :amount="operation.receivers[0].amount"></parnian>
      <account-number place="receiver" :account="operation.receivers[0].account"></account-number>
    </i18n>
    <br/><br/>
    <fee-text :operation="operation"></fee-text>
  </span>

  <span v-if="operation.isChangeKey() || operation.isChangeKeyAccount()">
    <i18n path="opText.keyChanged" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <account-number place="signer" :account="operation.signerAccount"></account-number>
      <span place="curve">{{ operation.changers[0].newPublicKey.curve.name }}</span>
    </i18n>
    <br/><br/>
    <fee-text :operation="operation"></fee-text>
  </span>

  <span v-if="operation.isRecoverFunds()">
    {{ $t('opText.recover') }}
  </span>

  <span v-if="operation.isListForSale()">
    <i18n path="opText.listed" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <parnian place="price" :amount="operation.changers[0].accountPrice"></parnian>
    </i18n>
    <i18n path="opText.listedTo" tag="span">
      <account-number place="seller" :account="operation.changers[0].sellerAccount"></account-number>
    </i18n>
    <br/><br/>
    <fee-text :operation="operation"></fee-text>
  </span>

  <span v-if="operation.isDelist()">
    <i18n path="opText.delisted" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
    </i18n>
    <br/><br/>
    <fee-text :operation="operation"></fee-text>
  </span>

  <span v-if="operation.isBuy()">
    <i18n path="opText.bought" tag="span">
      <account-number place="account" :account="operation.changers[0].account"></account-number>
      <account-number place="buyer" :account="operation.account"></account-number>
      <parnian place="price" :amount="operation.receivers[1].amount"></parnian>
      <account-number place="seller" :account="operation.receivers[1].account"></account-number>
    </i18n>
    <span v-if="operation.receivers[0].amount.toTar() > 0">
      <br/><br/>
      <i18n path="opText.overpaid" tag="span">
        <account-number place="buyer" :account="operation.account"></account-number>
        <parnian place="amount" :amount="operation.receivers[0].amount"></parnian>
        <account-number place="account" :account="operation.changers[0].account"></account-number>
      </i18n>
    </span>
    <br/><br/>
    <fee-text :operation="operation"></fee-text>
  </span>

  <span v-if="operation.isChangeAccountInfo()">
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
    <br/><br/>
    <fee-text :operation="operation"></fee-text>
  </span>

  <span v-if="operation.isMultiOperation()">
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
    <br/><br/>
    <span v-if="operation.fee.toTar() < 0">
      <i18n path="opText.totalFee" tag="span">
        <parnian place="fee" :amount="operation.fee.toPositive()"></parnian>
      </i18n>
    </span>
    <span v-if="operation.fee.toTar() === 0">
      {{ $t('opText.noFeePaid') }}
    </span>
  </span>

  <span v-if="operation.isData()">
    {{ $t('opText.data') }}
  </span>
</span>
</template>

<script>

import AccountNumber from './AccountNumber.vue';
import Parnian from './Parnian.vue';
import FeeText from './FeeText.vue';

export default {
  name: 'operation-text',
  props: ['operation'],
  components: {
    AccountNumber,
    Parnian,
    FeeText,
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
