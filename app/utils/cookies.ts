import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    secure: true,
    sameSite: 'Strict',
    path: '/'
  })
}

export const setRefreshToken = (token: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    secure: true,
    sameSite: 'Strict',
    path: '/'
  })
}

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}
