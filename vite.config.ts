import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
// 自动注入 naive-ui
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// const baseUrl = 'http://192.168.78.170:9207/anjian-check'
const baseUrl = 'https://vue.ruoyi.vip/prod-api'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH } = loadEnv(mode, process.cwd(), '') as ImportMetaEnv
  return {
    plugins: [
      vue(),
      legacy({
        // 指定目标浏览器版本（Chrome 85 对应 es2020）
        targets: ['Chrome >= 85'],
        // 自动注入 polyfill
        polyfills: [
          'es.promise.allSettled', // Chrome 85 不支持此API
          'es.string.at', // Chrome 85 不支持此API
          'es.array.at' // 补充数组的at方法
        ],
        // 不生成IE兼容的产物（我们不需要）
        modernPolyfills: true
      }),
      tailwindcss(),
      svgLoader(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ],
        dts: 'types/auto/auto-imports.d.ts'
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: 'types/auto/components.d.ts'
      })
    ],
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': '/src',
        '@types': '/types'
      }
    },
    // 服务配置
    server: {
      // 代理
      proxy: {
        '/api': {
          target: baseUrl, // Spring Boot 地址
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      },
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: [
          // './src/router/**/*.*'
        ]
      }
    },
    // 构建配置
    build: {
      // 是否开启 gzip 压缩大小报告，禁用时能略微提高构建性能
      reportCompressedSize: false,
      // 单个 chunk 文件的大小超过 2048kB 时发出警告
      chunkSizeWarningLimit: 2048
    },
    // 混淆器
    esbuild:
      mode === 'development'
        ? undefined
        : {
            // 打包构建时移除 console.log
            pure: ['console.log'],
            // 打包构建时移除 debugger
            drop: ['debugger'],
            // 打包构建时移除所有注释
            legalComments: 'none'
          }
  }
})
