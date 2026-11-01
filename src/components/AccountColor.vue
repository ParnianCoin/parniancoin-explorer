<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <div :style="style"></div>
</template>

<script>
const percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
  { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
  { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
];

export default {
  name: 'account-color',
  data() {
    return {
      style: {
        width: '10px',
        height: '10px',
      },
    };
  },
  props: ['age'],
  methods: {
    setColorForPercentage(pct) {
      // Find the first stop the percentage falls below; the gradient is then
      // interpolated between that stop and the one before it. `i` has to live
      // outside the loop, otherwise the two lookups below have nothing to read.
      let i = 1;
      while (i < percentColors.length - 1 && pct >= percentColors[i].pct) {
        i += 1;
      }

      const lower = percentColors[i - 1];
      const upper = percentColors[i];
      const range = upper.pct - lower.pct;
      const rangePct = (pct - lower.pct) / range;
      const pctLower = 1 - rangePct;
      const pctUpper = rangePct;
      const color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
      };
      this.style.backgroundColor = `rgb(${[color.r, color.g, color.b].join(',')})`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
