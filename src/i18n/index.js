/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './locales/en.json';
import fa from './locales/fa.json';
import ar from './locales/ar.json';

Vue.use(VueI18n);

export const DEFAULT_LOCALE = 'en';

// Everything the language switcher needs to know about a locale lives here.
export const LOCALES = {
  en: { name: 'English', native: 'English', dir: 'ltr' },
  fa: { name: 'Persian', native: 'فارسی', dir: 'rtl' },
  ar: { name: 'Arabic', native: 'العربية', dir: 'rtl' },
};

const STORAGE_KEY = 'parniancoin.locale';

/**
 * Picks the locale to start with: an explicit earlier choice wins, then the
 * languages the browser asks for, and English as the final fallback.
 */
export function detectLocale() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES[saved]) {
      return saved;
    }
  } catch (error) {
    // private mode or storage disabled — fall through to detection
  }

  const requested = (window.navigator.languages || [window.navigator.language || ''])
    .map(tag => String(tag).toLowerCase());

  const found = requested
    .map((tag) => {
      const base = tag.split('-')[0];
      // Persian is also tagged as "pes" or reaches us as the Dari variant.
      if (base === 'fa' || base === 'pes' || base === 'prs') return 'fa';
      if (base === 'ar') return 'ar';
      if (base === 'en') return 'en';
      return null;
    })
    .find(Boolean);

  return found || DEFAULT_LOCALE;
}

const i18n = new VueI18n({
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  silentFallbackWarn: true,
  messages: { en, fa, ar },
});

/**
 * Switches the active language and keeps the document in sync: the lang and
 * dir attributes drive the right-to-left layout and the correct font shaping.
 */
export function setLocale(locale) {
  const next = LOCALES[locale] ? locale : DEFAULT_LOCALE;

  i18n.locale = next;

  const html = document.documentElement;
  html.setAttribute('lang', next);
  html.setAttribute('dir', LOCALES[next].dir);
  html.classList.toggle('rtl', LOCALES[next].dir === 'rtl');

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    // nothing we can do, the choice simply will not survive a reload
  }

  return next;
}

setLocale(detectLocale());

export default i18n;
