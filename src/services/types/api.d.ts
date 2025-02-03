import { AxiosRequestConfig } from 'axios'
export interface ResponseData<Content> {
  result: Result<Content>
  title: string
  statusCode: number
}
export interface Result<Content> {
  message: string
  isError: boolean
  content: Content
  title: string
  statusCode: number
}
export interface ApiServiceParams {
  endpoint: string
  data?: unknown
  config?: AxiosRequestConfig
  workflowToken?: string
  username?: string
  password?: string
}
