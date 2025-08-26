import { request } from '@/utils/request'

/**
 * 获取验证码
 */
interface CodeImgResponse {
  code: number
  msg: string
  uuid: string
  img: string
}
export const getCodeImg = () => {
  return request<CodeImgResponse>({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

/**
 * 登录方法
 */
export interface LoginRequest {
  username: string
  password: string
  code: string
  uuid: string
  rememberMe?: boolean
}
interface LogingResponse {
  code: number
  msg: string
  token: string
}
export const login = (data: LoginRequest) => {
  return request<LogingResponse>({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

/**
 * 获取用户信息
 */
interface UserInfoResponse {
  code: number
  msg: string
  permissions: string[]
  roles: string[]
  user: UserInfo
}
export const getInfo = () => {
  return request<UserInfoResponse>({
    url: '/getInfo',
    method: 'get'
  })
}

/**
 * 登出方法
 */
export const logout = () => {
  return request({
    url: '/logout',
    method: 'post'
  })
}
