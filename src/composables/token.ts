import { useLoginStore } from '@/stores/views/login'

interface QueryParams {
  token_dts?: string
  isAdmin?: string
  username?: string
  [key: string]: string | undefined
}

const getParamCookie = () => {
  const cookies = document.cookie.split('; ').find((row) => row.startsWith('session_data='))
  if (cookies) {
    const cookieValue = cookies.split("=").slice(1).join("=")
    const params = new URLSearchParams(cookieValue)
    const result: QueryParams = {}
    params.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
}

export const useCheckToken = () => {
  const loginApi = useLoginStore()
  let token = ''

  const paramCookie = getParamCookie()
  token = paramCookie?.token_dts || ''
  loginApi.isVendor = paramCookie?.isAdmin === 'false'

  return token
}

export const getToken = () => {
  const paramCookie = getParamCookie()
  return paramCookie?.token_dts || ''
}

export const useGetUsername = () => {
  const paramCookie = getParamCookie()
  return paramCookie?.username || ''
}