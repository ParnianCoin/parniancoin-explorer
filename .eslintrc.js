/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Vue templates hold long attribute chains and the airbnb limit of 100 is
    // unrealistic for them. 140 still catches genuinely unreadable lines.
    'max-len': ['error', { code: 140, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],

    // Vuex mutations exist precisely to assign to the state object they are
    // handed, which is what this rule forbids. Every mutation would otherwise
    // need its own disable comment.
    'no-param-reassign': ['error', { props: false }],

    // The node reports its JSON fields in snake_case (enc_pubkey, state_before,
    // public_keys). Renaming them on the way in would only hide what the RPC
    // actually returns.
    camelcase: 'off',

    // Single file components are imported with their .vue extension, which the
    // airbnb config does not expect.
    'import/extensions': ['error', 'ignorePackages', { js: 'never', vue: 'always' }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
