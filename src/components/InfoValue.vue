<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <div>
    <dt class="{ help: help }">
        <slot name="label"></slot>
        &nbsp;<i class="far fa-question-circle" v-on:click="isVisible = !isVisible" v-if="help"></i>
    </dt>
    <dd class="help" v-if="isVisible">
        <slot name="help"></slot>
    </dd>
    <dd>
        <slot name="value"></slot>
    </dd>
    </div>
</template>

<script>
export default {
  name: 'info-value',
  props: ['help'],
  data() {
    return {
      isVisible: false,
    };
  },
};
</script>
