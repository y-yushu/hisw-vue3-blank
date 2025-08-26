import Cookies from 'js-cookie'

const TokenKey = 'Hisw-Admin-Token'

// 是否视图cookie进行存储
const isUseCookie = true

export const getToken = (): string => {
  if (isUseCookie) {
    return Cookies.get(TokenKey) || ''
  } else {
    return localStorage.getItem(TokenKey) || ''
  }
}

export const setToken = (token: string) => {
  const prefix = 'Bearer '
  let _token = token
  if (!token.startsWith(prefix)) {
    _token = prefix + _token
  }
  if (isUseCookie) {
    return Cookies.set(TokenKey, _token)
  } else {
    return localStorage.setItem(TokenKey, _token)
  }
}

export const removeToken = () => {
  if (isUseCookie) {
    return Cookies.remove(TokenKey)
  } else {
    return localStorage.removeItem(TokenKey)
  }
}
