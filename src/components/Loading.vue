<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
    <div>
    <social></social>
    <div class="page-header header-filter" :class="`page-header-${cls}`">
        <div class="container">
            <div class="row">
                <div class="col-md-8 ml-auto mr-auto text-center" v-if="!showError">
                    <h1 class="title"><i class="fas fa-spinner fa-spin"></i>{{ $t('loading.title', { what: title }) }}</h1>
                    <p>
                        {{ $t('loading.wait') }}
                    </p>
                </div>
                <div class="col-md-8 ml-auto mr-auto text-center" v-if="showError">
                    <h1 class="title"><i class="fas fa-cogs"></i>{{ $t('loading.error') }}</h1>
                    <p>
                        {{ $t('loading.errorOccured') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
        <div class="section">
            <div class="container">
                <div class="main main-raised">
                    <span v-if="showError" style="color: tomato; font-weight: bold;">{{error}}</span>
                    <span v-if="showError === false">{{ $t('loading.loadingData') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Social from './Social.vue';

export default {
  name: 'loading',
  props: ['title', 'cls', 'showError', 'error'],
  components: {
    Social,
  },
};
</script>

<style scoped lang="scss">

@import "./../assets/settings";
.page-header-account {
    background-color: $parc-color-account;
}
.page-header-block {
    background-color: $parc-color-block;
}
.page-header-operation {
    background-color: $parc-color-operations;
}

</style>
