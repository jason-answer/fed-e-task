module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
  ],
  // parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {},
}
