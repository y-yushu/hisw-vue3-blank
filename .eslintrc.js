/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // ⚡ 保证 ESLint 和 Prettier 一致
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    /* ---------- 基础规则 ---------- */
    'no-unused-vars': 'off', // 交给 TS 处理
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    /* ---------- Vue 规则 ---------- */
    'vue/multi-word-component-names': 'off', // 允许单词组件名
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ]

    /* ---------- Tailwind 推荐 ---------- */
    // 不对 class 排序做强制限制，交给 prettier-plugin-tailwindcss
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
}
