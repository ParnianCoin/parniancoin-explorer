<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <span :title="timestamp">
        {{ timestamp | moment("YYYY-MM-DD HH:mm:ss") }}
        <br />
        <small>{{ relative }}</small>
    </span>
</template>

<script>

/**
 * Shows an absolute timestamp with a relative one underneath. The relative part
 * is built from the translation catalogue rather than a date library, so it
 * follows the active language including the right-to-left ones.
 */
export default {
  name: 'date',
  props: ['timestamp'],
  data() {
    return {
      now: Math.floor(Date.now() / 1000),
      timer: null,
    };
  },
  created() {
    this.timer = setInterval(() => {
      this.now = Math.floor(Date.now() / 1000);
    }, 10000);
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  computed: {
    relative() {
      const seconds = Math.max(0, this.now - Number(this.timestamp));

      if (seconds < 10) {
        return this.$t('time.justNow');
      }

      const units = [
        [31536000, 'time.yearsAgo'],
        [2592000, 'time.monthsAgo'],
        [86400, 'time.daysAgo'],
        [3600, 'time.hoursAgo'],
        [60, 'time.minutesAgo'],
        [1, 'time.secondsAgo'],
      ];

      const [size, key] = units.find(([unit]) => seconds >= unit);
      const n = Math.floor(seconds / size);

      // English needs the singular/plural choice, Persian and Arabic do not —
      // $tc falls back to the single form when a catalogue has no plural.
      return this.$tc(key, n, { n });
    },
  },
};
</script>

<style scoped lang="scss">

</style>
