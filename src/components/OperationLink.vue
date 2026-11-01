<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <router-link
          :to="{name: 'operation', params: { ophash: ophash.encode().toHex() }}">
    {{label}}
  </router-link>
</template>

<script>
export default {
  name: 'operation-link',
  props: ['ophash', 'label'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./../assets/settings.scss";

a {
  font-family: "Roboto Slab", "Times New Roman", serif;
  font-weight: bold;
  color: $parc-color-operations;
  &.complement {
    color: white;
  }
}
</style>
