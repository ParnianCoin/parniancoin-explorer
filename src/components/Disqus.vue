<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <div class="row">
        <div class="col-md-12">
            <h3 class="title">{{ $t('comments.title') }}</h3>
            <button v-if="visible === false"  class="btn btn-primary" v-on:click="showComments">{{ $t('comments.show') }}</button>
            <div v-if="visible === true" id="disqus_thread"></div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'disqus',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    showComments() {
      this.visible = true;
      const d = document; const
        s = d.createElement('script');
      s.src = 'https://parniancoin-explorer.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    },
  },
};
</script>
