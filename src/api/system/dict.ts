import { request } from '@/utils/request'

// 将 getDictType 改为泛型函数，适应新的返回结构
export const getDictType = <Q extends Record<string, any>, T extends Record<string, any>>({
  params,
  data
}: {
  params: QueryPaging & Partial<Q>
  data: Partial<Q>
}): Promise<TableResponse<T>> => {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params,
    data
  })
}
