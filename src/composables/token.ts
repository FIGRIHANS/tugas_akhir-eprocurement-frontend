export const useCheckToken = () => {
  let token = ''

  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === 'token_dts') token = decodeURIComponent(value)
  }

  return token
}