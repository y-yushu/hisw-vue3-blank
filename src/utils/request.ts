// src/utils/request.ts
import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { Message, Notification, Dialog } from '@/utils/message'
// import { ElLoading } from 'element-plus'
// import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
// import { blobValidate } from '@/utils/hisw'
import cache from '@/utils/cache'
// import { saveAs } from 'file-saver'
import { useUserStoreOutside } from '@/store/user'

// 下载加载实例
// let downloadLoadingInstance: ReturnType<typeof ElLoading.service> | null = null

interface CacheItem<T = any> {
  url: string
  data: T
  time: number
}

// 是否显示重新登录
export const isRelogin = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // Vite 写法
  timeout: 10000
})

// request 拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers as any)?.isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers as any)?.repeatSubmit === false

    if (getToken() && !isToken) {
      ;(config.headers as any)['Authorization'] = 'Bearer ' + getToken()
    }

    // 防止重复提交
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON<CacheItem>('sessionObj')
      if (!sessionObj) {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url
        const s_data = sessionObj.data
        const s_time = sessionObj.time
        const interval = 1000
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交'
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }

    return config
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg: string = errorCode[code] || res.data.msg || errorCode['default']

    // 二进制数据直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }

    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        Dialog.warning({
          title: '提示',
          content: '登录过期，请重新登录',
          positiveText: '确定',
          closable: false,
          maskClosable: false,
          onPositiveClick: () => {
            const userStore = useUserStoreOutside()
            userStore.toLogout().then(() => {
              // 执行登出逻辑
              Message.success('请重新登录')
              window.location.href = '/login'
              isRelogin.show = false
            })
          }
        })
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      Message.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({ content: '接口异常', meta: msg })
      return Promise.reject(new Error('error'))
    } else {
      return res.data
    }
  },
  error => {
    console.error('err' + error)
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口 ' + message.slice(-3) + ' 异常'
    }
    Message.error(message, { duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

// 类型安全的 request 方法
function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>
}
export { request }
