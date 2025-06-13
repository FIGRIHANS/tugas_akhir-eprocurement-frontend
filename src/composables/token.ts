import { useLoginStore } from '@/stores/views/login'

const getParamCookie = () => {
  const cookies = document.cookie.split('; ').find((row) => row.startsWith('session_data='))
  if (cookies) {
    const cookieValue = cookies.split("=").slice(1).join("=")
    const params = new URLSearchParams(cookieValue)
    return params
  }
}

export const useCheckToken = () => {
  const loginApi = useLoginStore()
  let token = ''

  const paramCookie = getParamCookie()
  token = paramCookie?.get('token_dts') || ''
  loginApi.isVendor = !Boolean(paramCookie?.get('isAdmin'))

  return token
}

export const getToken = () => {
  const paramCookie = getParamCookie()
  return paramCookie?.get('token_dts') || ''
}

export const useGetUsername = () => {
  const paramCookie = getParamCookie()
  return paramCookie?.get('username')
}