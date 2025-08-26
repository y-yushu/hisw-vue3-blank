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
