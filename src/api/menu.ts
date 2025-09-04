import { request } from '@/utils/request'

export const getRouters = () => {
  return request<DataResponse<AppRouteRecordRaw[]>>({
    url: '/getRouters',
    method: 'get'
  })
}
