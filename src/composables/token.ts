export const useCheckToken = () => {
  let token = ''

  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === 'token_dts') token = decodeURIComponent(value)
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