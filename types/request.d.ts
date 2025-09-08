import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    headers?:
      | (AxiosRequestConfig['headers'] & {
          isToken?: boolean
          repeatSubmit?: boolean
        })
      | any
  }
}

declare global {
  interface PublicResponse<T> {
    code: number
    msg: string
    data: T
  }

  // 后端默认返回
  type DataResponse<T> = Pick<PublicResponse<T>, 'code' | 'msg' | 'data'>

  // 全局分页查询参数
  interface QueryPaging {
    pageNum: number
    pageSize: number
  }

  // 默认的列表接口返回结构
  interface TableResponse<T> {
    code: number
    msg: string
    rows: T[]
    total: number
  }

  // 默认表格接口类型 - 适应新的响应结构
  type ApiTabelFunction<Q extends Record<string, any>, T extends Record<string, any>> = (options: {
    params: QueryPaging
    data: (Q | Partial<Q>) & Record<string, any>
  }) => Promise<TableResponse<T>>
}
