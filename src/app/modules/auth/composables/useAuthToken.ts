import { useCookies } from '@vueuse/integrations/useCookies';

export function useAuthToken() {
  const cookies = useCookies(['access_token', 'refresh_token'])

  const getAccess = () => cookies.get('access_token')
  const getRefresh = () => cookies.get('refresh_token')

  const setTokens = (access: string, refresh: string) => {
    cookies.set('access_token', access, { path: '/', maxAge: 3600 }) // 1h
    cookies.set('refresh_token', refresh, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 7 días
  }

  const removeTokens = () => {
    cookies.remove('access_token', { path: '/' })
    cookies.remove('refresh_token', { path: '/' })
  }

  return { getAccess, getRefresh, setTokens, removeTokens }
}
