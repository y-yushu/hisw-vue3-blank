// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'

export default [
  // 基础ESLint推荐配置
  js.configs.recommended,

  // TypeScript推荐配置
  ...tseslint.configs.recommended,

  // 全局配置
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        // 对.vue文件使用ts解析器
        parser: tseslint.parser,
        extraFileExtensions: ['.vue']
      },
      // 添加环境全局变量
      globals: {
        // 浏览器环境
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        // Node.js环境
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly'
      }
    }
  },

  // 注册并启用Vue插件
  {
    plugins: {
      vue
    },
    // 手动添加Vue的规则
    rules: {
      // Vue核心规则
      'vue/comment-directive': 'error',
      'vue/jsx-uses-vars': 'error',
      'vue/no-dupe-v-else-if': 'error',
      'vue/no-duplicate-attributes': 'error',
      'vue/no-parsing-error': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-reserved-keys': 'error',
      'vue/no-textarea-mustache': 'error',
      'vue/no-unused-components': 'error',
      'vue/no-unused-vars': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/require-v-for-key': 'error',
      'vue/valid-template-root': 'error',
      'vue/valid-v-bind': 'error',
      'vue/valid-v-cloak': 'error',
      'vue/valid-v-else-if': 'error',
      'vue/valid-v-else': 'error',
      'vue/valid-v-for': 'error',
      'vue/valid-v-html': 'error',
      'vue/valid-v-if': 'error',
      'vue/valid-v-model': 'error',
      'vue/valid-v-on': 'error',
      'vue/valid-v-once': 'error',
      'vue/valid-v-pre': 'error',
      'vue/valid-v-show': 'error',
      'vue/valid-v-slot': 'error',
      'vue/valid-v-text': 'error',

      // Vue样式规则 - 自定义
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
      ],
      'vue/multi-word-component-names': 'off'
    }
  },

  // TypeScript 特定规则
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  // Vue文件的特殊规则
  {
    files: ['**/*.vue'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },

  // Prettier配置
  {
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  },

  // 最后应用eslint-config-prettier来避免冲突
  eslintConfigPrettier,

  // 忽略文件配置
  {
    ignores: ['node_modules/', 'dist/', 'build/', '*.log', '.DS_Store', 'types/**/*.d.ts']
  }
]
