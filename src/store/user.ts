import { defineStore } from 'pinia'
import { pinia } from './index'
import { login, type LoginRequest, getInfo, logout } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'

// 定义状态的类型
interface UserState {
  token: string
  name: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  // 使用泛型为 state 提供类型
  state: (): UserState => ({
    token: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }),
  getters: {
    // 是否已获取用户信息，以是否获取用户名判断
    obtained: state => !!state.name
  },
  actions: {
    // 登录
    async toLogin(data: LoginRequest) {
      const res = await login(data)
      this.token = res.token
      setToken(res.token)
      return res
    },

    // 获取用户信息及权限
    async getUserInfo() {
      if (this.name) {
        return
      }
      const res = await getInfo()
      this.name = res.user.userName
      this.avatar = res.user.avatar || ''
      this.roles = res.roles
      this.permissions = res.permissions
      return res
    },

    // 登出
    toLogout() {
      logout() // 触发登出，无论是否成功，不妨碍前端清空数据
      return new Promise(resolve => {
        removeToken() // 清理token
        this.token = ''
        this.name = ''
        this.avatar = ''
        this.roles = []
        this.permissions = []
        resolve(true)
      })
    }
  }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export const useUserStoreOutside = () => {
  return useUserStore(pinia)
}
