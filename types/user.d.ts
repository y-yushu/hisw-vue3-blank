// 用户部门
interface UserDept {
  searchValue: string | null
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
  remark: string | null
  params: {}
  deptId: number
  parentId: number
  ancestors: string
  deptName: string
  orderNum: number
  leader: string
  phone: string | null
  email: string | null
  status: string
  delFlag: string | null
  parentName: string | null
  children: []
}

// 用户角色
interface UserRole {
  searchValue: string | null
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
  remark: string | null
  params: {}
  roleId: number
  roleName: string
  roleKey: string
  roleSort: string
  dataScope: string
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  status: string
  delFlag: string | null
  flag: boolean
  menuIds: string | null
  deptIds: string | null
  admin: boolean
}

// 用户信息
interface UserInfo {
  searchValue: string | null
  createBy: string
  createTime: string
  updateBy: string | null
  updateTime: string | null
  remark: string
  params: {}
  userId: number
  deptId: number
  userName: string
  nickName: string
  email: string | null
  phonenumber: string | null
  sex: string | null
  avatar: string | null
  password: string
  status: string | null
  delFlag: string | null
  loginIp: string | null
  loginDate: string | null
  dept: UserDept
  roles: UserRole[]
  roleIds: string | null
  postIds: string | null
  roleId: string | null
  admin: boolean
}
