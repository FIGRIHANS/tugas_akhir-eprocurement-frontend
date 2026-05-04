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

/**
 * Parse JWT payload and return the UserId claim as a number.
 * For vendor users: UserId = VendorId in the database.
 * For internal users: UserId = Employee/User ID in the database.
 */
export const getUserIdFromToken = (): number | undefined => {
  try {
    const token = getToken()
    if (!token) return undefined

    // JWT is three base64 parts separated by dots
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return undefined

    // Decode base64 (handle URL-safe base64)
    const decoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(decoded)

    if (payload.UserId && !isNaN(Number(payload.UserId))) {
      return Number(payload.UserId)
    }
    return undefined
  } catch {
    return undefined
  }
}