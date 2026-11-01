<!--
  Copyright (c) 2026 by Amir Reza Zamani
  This file is a part of the ParnianCoin Project, an infinitely scalable
  cryptocurrency. Find us here:
  Web: https://parniancoin.com
  THIS LICENSE HEADER MUST NOT BE REMOVED.
-->
<template>
  <div id="app" :class="{ 'nav-open': menuVisible, 'nav-open-absolute': menuVisible }">
    <div id="bodyClick" v-if="menuVisible"></div>
    <nav class="navbar  bg-white   fixed-top  navbar-expand-lg " id="sectionsNav">
      <div class="container">
        <div class="navbar-translate">
          <router-link
                  :to="{name: 'home'}"
                  class="navbar-brand"
          >
            <img src="/logo.png" class="brand-logo" alt="ParnianCoin" style="width:45px;height:45px;"/> <span style="font-weight:1000">  ParnianCoin</span>
          </router-link>
          <button class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  :aria-label="$t('nav.toggle')"
                  v-on:click="toggleMenu"
                  :class="{ 'toggled': menuVisible }">
            <span class="sr-only">{{ $t('nav.toggle') }}</span>
            <span class="navbar-toggler-icon"></span>
            <span class="navbar-toggler-icon"></span>
            <span class="navbar-toggler-icon"></span>
          </button>
          <a class="search-toggler d-md-none"
             style="position: absolute; right: 55px;"
             v-on:click="toggleSearch"><i class="fas fa-search"></i>
          </a>
        </div>
        <div class="collapse navbar-collapse show">
          <p class="bootstrap-tagsinput rose-badge">
            <router-link
                    :to="{name: 'home'}"
                    class="tag badge"
                    v-on:click.native="toggleMenu && hideSearch()">
              {{ $t('nav.badge', { latest: latestBlock, count: blockCount, pendings: pendingCount }) }}
            </router-link>

          </p>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link
                      :to="{name: 'home'}"
                      class="nav-link"
                      v-on:click.native="toggleMenu && hideSearch()">
                <i class="fas fa-home"></i> {{ $t('nav.home') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                      :to="{name: 'blocks'}"
                      class="nav-link"
                      v-on:click.native="toggleMenu && hideSearch()">
                <i class="fa fa-square"></i> {{ $t('nav.blocks') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                      :to="{name: 'accounts'}"
                      class="nav-link"
                      :activeClass="'active'"
                      v-on:click.native="toggleMenu && hideSearch()">
                <i class="fa fa-user"></i> {{ $t('nav.accounts') }}
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-on:click="toggleSearch()"><i class="fas fa-search"></i> {{ $t('nav.search') }}</a>
            </li>
            <li class="nav-item dropdown language-switcher" :class="{ show: languageMenuOpen }">
              <a href="#"
                 class="nav-link dropdown-toggle"
                 :aria-label="$t('nav.language')"
                 v-on:click.prevent="languageMenuOpen = !languageMenuOpen">
                <i class="fas fa-globe"></i> {{ locales[locale].native }}
              </a>
              <div class="dropdown-menu" :class="{ show: languageMenuOpen }">
                <a v-for="(meta, code) in locales"
                   :key="code"
                   href="#"
                   class="dropdown-item"
                   :class="{ active: code === locale }"
                   :lang="code"
                   v-on:click.prevent="changeLanguage(code)">
                  {{ meta.native }}
                </a>
              </div>
            </li>
            <!--li class="dropdown nav-item" :class="{ show: chartsMenuOpen }">
              <a href="#"
                 class="dropdown-toggle nav-link"
                 data-toggle="dropdown"
                 aria-expanded="true"
                 v-on:click="chartsMenuOpen = !chartsMenuOpen">
                <i class="material-icons">apps</i> Statistics
                <div class="ripple-container"></div></a>
              <div class="dropdown-menu dropdown-with-icons" :class="{show: chartsMenuOpen}">
                <router-link
                        :to="{name: 'charts-operations'}"
                        class="dropdown-item"
                        v-on:click.native="chartsMenuOpen = !chartsMenuOpen">
                    <i class="fa fa-square" style="font-size:20px; margin-right: 18px;"></i> Operations
                    <div class="ripple-container"></div>
                </router-link>
                <a href="./index.html" class="dropdown-item">
                  <i class="material-icons">line_style</i> All Components
                </a>
              </div>
            </li-->
          </ul>
        </div>
      </div>
    </nav>
  <div style="background-color: #f0f0f0; margin-top: 75px;" v-if="searchVisible">
    <div class="container">
  <div class="row">
    <div class="col-md-12 ml-auto mr-auto">
      <h4 class="title mb-0">{{ $t('nav.search') }}<i class="fas fa-times"
                                                     style="float: right; cursor: pointer;"
                                                     v-on:click="toggleSearch"></i></h4>
      <div class="card card-raised card-form-horizontal mt-0">
        <div class="card-body ">
          <form>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group bmd-form-group">
                  <input ref="searchField"
                         v-model="search"
                         type="text"
                         value=""
                         :placeholder="$t('nav.searchPlaceholder')"
                         class="form-control search">
                </div>
              </div>
            </div>
          </form>
          <h5 class="title mt-0 mb-0"><i class="fas fa-spinner fa-spin" v-if="searchOperationActive"></i> {{ $t('search.operation') }}</h5>
          <span v-if="searchOperationError !== null">{{searchOperationError}}</span>
          <span v-if="searchOperationError === null && searchOperation === null && search !== ''">{{ $t('search.noOperation') }}</span>
          <span v-if="searchOperationError === null && searchOperation === null && search === ''">{{ $t('search.enterAbove') }}</span>
          <div v-if="searchOperationError === null && searchOperation !== null" v-on:click="hideSearch()">
            <operation-link :label="searchOperation.opHash.encode().toHex()"
                            :ophash="searchOperation.opHash"></operation-link>
            - <date :timestamp="searchOperation.time"></date><br />
          </div>
          <h5 class="title mt-0 mb-0"><i class="fas fa-spinner fa-spin" v-if="searchAccountsActive"></i> {{ $t('nav.accounts') }}</h5>
          <span v-if="searchAccountsError !== null">{{searchAccountsError}}</span>
          <span v-if="noAccountResults && search !== ''">{{ $t('search.noAccounts') }}</span>
          <span v-if="noAccountResults && search === ''">{{ $t('search.enterAbove') }}</span>
          <ul v-if="searchAccountsError === null">
            <li v-for="searchAccount in searchAccounts" :key="searchAccount.account" v-on:click="hideSearch()">
              <account-number :account="searchAccount.account"></account-number>
              <span v-if="searchAccount.name !== ''"> - {{ searchAccount.name }}</span>
            </li>
          </ul>
          <h5 class="title mt-0 mb-0"><i class="fas fa-spinner fa-spin" v-if="searchBlocksActive"></i> {{ $t('nav.blocks') }}</h5>
          <span v-if="searchBlocksError !== null">{{searchBlocksError}}</span>
          <span v-if="noBlockResults && search !== ''">{{ $t('search.noBlocks') }}</span>
          <span v-if="noBlockResults && search === ''">{{ $t('search.enterAbove') }}</span>
          <ul v-if="searchBlocksError === null">
            <li v-for="searchBlock in searchBlocks" :key="searchBlock.block" v-on:click="hideSearch()">
              <block-number :block="searchBlock.block"></block-number> - <date :timestamp="searchBlock.timestamp"></date>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
    <router-view/>
    <footer class="footer footer-white footer-big">
      <div class="container">
        <div class="content">
          <div class="row">
            <div class="col-md-12 text-center">
              <img src="/logo.png" style="width:60px;height:60px;" />
              <hr />
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <h5>{{ $t('footer.aboutUs') }}</h5>
              <ul class="links-vertical">
                <li>
                  <a href="https://parniancoin.com">
                    parniancoin.com
                  </a>
                </li>
                <li>
                  <a href="https://pay.parniancoin.com">
                    pay.parniancoin.com
                  </a>
                </li>
                <li>
                  <a href="https://wallet.parniancoin.com">
                    wallet.parniancoin.com
                  </a>
                </li>
 		<li>
                  <a href="https://pool.parniancoin.com">
                    pool.parniancoin.com
                  </a>
                </li>

              </ul>
            </div>
            <div class="col-md-4">
              <h5>{{ $t('footer.markets') }}</h5>
              <ul class="links-vertical">
                <li>
                  <a href="https://wallet.parniancoin.com/market">
                    Marketplace
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5>{{ $t('footer.followUs') }}</h5>
              <ul class="social-buttons">
                <li>
		<a href="https://github.com/parniancoin" class="btn btn-just-icon btn-link btn-github" target="_blank" rel="noopener noreferrer">
		  <i class="fab fa-github"></i>
		</a>                
		</li>
                <li>
                  <a href="https://t.me/parniancoin" class="btn btn-just-icon btn-link btn-telegram">
                    <i class="fab fa-telegram"></i>
                  </a>
              </li>
                <li>
                  <a href="https://discord.gg/m4AcMMReSs" class="btn btn-just-icon btn-link btn-discord">
                    <i class="fab fa-discord"></i>
                  </a>
                 </li>
              </ul>
            </div>
          </div>
        </div>
        <hr>
        <div class="copyright pull-center">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

import AccountObj from 'parniancoin/src/Types/Account';
import BlockObj from 'parniancoin/src/Types/Block';
import OperationObj from 'parniancoin/src/Types/Operation';
import { mapActions, mapState } from 'vuex';
import { LOCALES, setLocale } from './i18n';
import rpc from './parnian/rpc';
import AccountNumber from './components/AccountNumber.vue';
import BlockNumber from './components/BlockNumber.vue';
import Date from './components/Date.vue';
import OperationLink from './components/OperationLink.vue';

export default {
  data() {
    return {
      search: '',
      searchAccounts: [],
      searchAccountsActive: false,
      searchAccountsError: null,
      searchBlocks: [],
      searchBlocksError: null,
      searchBlocksActive: false,
      searchOperation: null,
      searchOperationActive: false,
      searchOperationError: null,
      timer: null,
      searchVisible: false,
      iv1: null,
      iv2: null,
      menuVisible: false,
      chartsMenuOpen: false,
      languageMenuOpen: false,
      locales: LOCALES,
    };
  },
  components: {
    OperationLink,
    BlockNumber,
    AccountNumber,
    Date,
  },
  created() {
    this.fetchBlockCount();
    this.fetchPendingCount();
    if (this.iv1 === null) {
      this.iv1 = setInterval(() => this.fetchBlockCount(), 5000);
    }
    if (this.iv2 === null) {
      this.iv2 = setInterval(() => this.fetchPendingCount(), 5000);
    }
  },
  methods: {
    ...mapActions([
      'fetchBlockCount',
      'fetchPendingCount',
    ]),
    changeLanguage(code) {
      setLocale(code);
      this.languageMenuOpen = false;
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
      if (this.menuVisible) {
        // setTimeout(function() {
        //  $toggle.removeClass('toggled');
        // }, 550);
      } else {
        // setTimeout(function() {
        //  $toggle.addClass('toggled');
        // }, 580);
      }
    },
    toggleSearch() {
      this.searchVisible = !this.searchVisible;
      if (this.menuVisible) {
        this.menuVisible = false;
      }
      if (this.searchVisible) {
        setTimeout(() => this.$refs.searchField.focus(), 200);
      }
    },
    hideSearch() {
      this.searchVisible = false;

      if (this.menuVisible) {
        this.menuVisible = false;
      }
    },
    performSearch() {
      this.searchAccountsError = null;
      this.searchAccountsActive = false;
      this.searchBlockError = null;
      this.searchBlocksActive = false;
      this.searchAccounts = [];
      this.searchBlocks = [];
      this.searchOperation = null;
      this.searchOperationActive = false;
      this.searchOperationError = null;
      if (this.search.trim() === '') {
        return;
      }
      if (this.search.match(/^\d+$/)) {
        const num = parseInt(this.search, 10);
        if (num > this.latestBlock) {
          this.searchBlockError = `Number larger as the available number of blocks (${this.latestBlock}).`;
        } else {
          this.searchBlocksActive = true;
          const searchBlockNumbers = [num];
          for (let i = 1; i <= 4; i += 1) {
            const suggestion = parseInt(`${num}${'0'.repeat(i)}`, 10);
            if (suggestion < this.latestBlock) {
              searchBlockNumbers.push(suggestion);
            }
          }
          Promise.all(searchBlockNumbers.map(blockNumber => rpc.getBlock(blockNumber).executeTransformItem(BlockObj))).then((blocks) => {
            this.searchBlocksActive = false;
            this.searchBlocks = blocks;
          });
        }
        if (num > this.accountCount) {
          this.searchAccountsError = `Number larger as the available number of Accounts (${this.accountCount}).`;
        } else {
          this.searchAccountsActive = true;
          const searchAccountNumbers = [num];
          for (let i2 = 1; i2 <= 4; i2 += 1) {
            const suggestion = parseInt(`${num}${'0'.repeat(i2)}`, 10);
            if (suggestion < this.accountCount) {
              searchAccountNumbers.push(suggestion);
            }
          }
          const lookups = searchAccountNumbers
            .map(accountNumber => rpc.getAccount(accountNumber).executeTransformItem(AccountObj));
          Promise.all(lookups).then((accounts) => {
            this.searchAccounts = accounts;
            this.searchAccountsActive = false;
          });
        }
      } else if (this.search.length === 64) {
        this.searchOperationError = null;
        this.searchOperationActive = true;
        rpc.findOperation(this.search).executeTransformItem(OperationObj).then((op) => {
          this.searchOperationActive = false;
          if (op === undefined) {
            this.searchOperationError = 'Operation not found.';
          } else {
            this.searchOperation = op;
          }
        });
      } else {
        this.searchOperationError = 'Not a valid operation hash.';
        this.searchAccountsActive = true;
        const request = rpc.findAccounts(this.search, -1, false, false);
        request.start = 0;
        request.max = 5;
        request.executeTransformArray(AccountObj).then((accounts) => {
          this.searchAccounts = accounts;
          this.searchAccountsActive = false;
        });
      }
    },
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    },
    noAccountResults() {
      return this.searchAccountsError === null && this.searchAccounts.length === 0;
    },
    noBlockResults() {
      return this.searchBlocksError === null && this.searchBlocks.length === 0;
    },
    ...mapState({
      pendingCount: state => state.pendingCount,
      blockCount: state => state.blockCount,
      latestBlock: state => state.latestBlock,
      accountCount: state => state.accountCount,
    }),
  },
  watch: {
    search() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setTimeout(() => this.performSearch(), 250);
    },
  },
};

</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "assets/material-kit";
@import "assets/settings";
@import "assets/fonts";
@import "assets/rtl";

.language-switcher {
  .dropdown-menu {
    min-width: 8rem;
  }

  .dropdown-item.active {
    font-weight: bold;
  }
}

body {
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a899bf' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
}

.page-header {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  background-position: left top !important;
  background-size: inherit !important;
}

.home .page-header {
  @media (min-width: 768px) {
    height: 60vh;
  }
}

.text-white small {
  color: white !important;
}

.insite .page-header {
  h1 {
    margin-top: -15vh !important;
    margin-bottom: 0;
  }
  height: 42vh;
  @media (max-width: 768px) {
    height: 60vh;
    h1 {
      margin-top: -18vh !important;
    }
  }
}


.form-control.search {
  font-family: monospace;
  font-size: 1.1rem;
}

.btn i {
  margin-right: 10px;
}

dd {
  font-family: monospace;
}

dt {
  text-transform: uppercase;
}

td, th {
  white-space: nowrap;
}

td.pubkey {
  white-space: normal;
  word-break: break-all;
}

thead tr th {
  border-bottom: 3px solid #3C4858 !important;
}
tr th {
  font-weight: bold !important;
}


.parc {
  font-family: 'Roboto Mono', monospace !important;
  font-weight: bold;
}
td .parc {
  font-size: .9rem;
}

.info {
  max-width: none;
  padding: 0;
}

td {
  vertical-align: top !important;
}

.block-color {
  color: $parc-color-block !important;
}
.block-bgcolor {
  background-color: $parc-color-block !important;
  dt, dd {
    color: white !important;
  }
}
.block-color-dark {
  color: $parc-color-block-dark !important;
}
.block-bgcolor-dark {
  background-color: $parc-color-block-dark !important;
  dt, dd, small {
    color: white !important;
  }
}
.account-color {
  color: $parc-color-account !important;
}
.account-bgcolor {
  background-color: $parc-color-account !important;
}
.account-color-dark {
  color: $parc-color-account-dark !important;
}
.account-bgcolor-dark {
  background-color: $parc-color-operations-dark !important;
}
.operation-color {
  color: $parc-color-operations !important;
}
.operation-bgcolor {
  background-color: $parc-color-operations !important;
}
.operation-color-dark {
  color: $parc-color-operations-dark !important;
}
.operation-bgcolor-dark {
  background-color: $parc-color-operations-dark !important;
  dt, dd, small {
    color: white !important;
  }
}

.btn-block-color {
    background-color: $parc-color-block;
}
.btn-account-color {
    background-color: $parc-color-account;
}

dt.help i {
  cursor: pointer !important;
}

dd.help {
  color: $parc-color-misc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: .7rem;
}

.card-body {
  padding: 15px !important;
}

table tr.subtotal {
  border-top: 3px solid #3C4858 !important;
  font-weight: bold;
}
table tr.fee {
  font-weight: bold;
}
table tr.total {
  border-top: 3px solid $parc-color-operations !important;
  font-weight: bold;
  color: $parc-color-operations;
}

.main.main-raised {
  margin-top: -25vh;
  min-height: 200px;
  padding: 40px;
  @media (max-width: 768px) {
    padding: 40px 10px;
    margin-top: -30vh;
  }
  box-shadow: 0 8px 12px 1px rgba(0, 0, 0, 0.14), 0 3px 15px 2px rgba(0, 0, 0, 0.12), 0 4px 5px -2px rgba(0, 0, 0, 0.2);
}
  .btn-discord i {
    color: #7289DA;
  }

.modal .modal-dialog {
  margin-top: 75px;
}
@media (max-width: 768px) {
  .container {
    max-width: 100%;
  }
}
</style>
