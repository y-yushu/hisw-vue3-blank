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

  type DataResponse<T> = Pick<PublicResponse<T>, 'code' | 'msg' | 'data'>
}
