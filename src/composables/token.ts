import { useLoginStore } from '@/stores/views/login'

export const useCheckToken = () => {
  const loginApi = useLoginStore()
  let token = ''

  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === 'token_dts') token = decodeURIComponent(value)
    if (key === 'isAdmin') loginApi.isVendor = !Boolean(value)
  }

  return token
}

export const getToken = () => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; token_dts=`)
  if (parts.length === 2) {
    const token = parts.pop()
    return token ? token.split(';').shift() : undefined
  } else {
    return ''
  }
}