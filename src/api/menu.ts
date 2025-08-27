import { request } from '@/utils/request'

// // 获取路由
// interface RouterResponse {
//   name?: string
//   path: string
//   hidden: boolean
//   redirect?: string
//   component: string
//   alwaysShow?: boolean
//   meta: AppRouteMeta
//   children?: RouterResponse[]
// }
export const getRouters = () => {
  return request<DataResponse<AppRouteRecordRaw[]>>({
    url: '/getRouters',
    method: 'get'
  })
}
