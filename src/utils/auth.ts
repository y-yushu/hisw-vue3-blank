import Cookies from 'js-cookie'
import { useUserStoreOutside } from '@/store/user'

/**
 * 用户token储存
 */
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

/**
 * 用户页面权限
 */
function authPermission(permission: string) {
  const all_permission = '*:*:*'
  const permissions = useUserStoreOutside().permissions as string[]
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role: string) {
  const super_admin = 'admin'
  const roles = useUserStoreOutside().roles as string[]
  if (role && role.length > 0) {
    return roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export const auth = {
  // 验证用户是否具备某权限
  hasPermi(permission: string) {
    return authPermission(permission)
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions: string[]) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },
  // 验证用户是否含有指定权限，必须全部拥有
  hasPermiAnd(permissions: string[]) {
    return permissions.every(item => {
      return authPermission(item)
    })
  },
  // 验证用户是否具备某角色
  hasRole(role: string) {
    return authRole(role)
  },
  // 验证用户是否含有指定角色，只需包含其中一个
  hasRoleOr(roles: string[]) {
    return roles.some(item => {
      return authRole(item)
    })
  },
  // 验证用户是否含有指定角色，必须全部拥有
  hasRoleAnd(roles: string[]) {
    return roles.every(item => {
      return authRole(item)
    })
  }
}
