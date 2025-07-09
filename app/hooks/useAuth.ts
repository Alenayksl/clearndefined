'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/app/stores/authStore'
import { api } from '@/app/lib/api'
import { API_ENDPOINTS } from '@/app/constants/endpoints'
import { getAccessToken, removeTokens } from '@/app/utils/cookies'

export const useAuth = () => {
  const { user, setUser, clearUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const token = getAccessToken()
      if (!token) {
        clearUser()
        setLoading(false)
        return
      }

      // Tokenı api client header'a set et
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const response = await api.get(API_ENDPOINTS.PROFILE)
      setUser(response.data.user)
    } catch (error) {
      console.error('[useAuth] Kullanıcı bilgisi alınamadı:', error)
      clearUser()
      removeTokens() // Tokenları sil, temizle aşkım
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      fetchUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout: () => {
      clearUser()
      removeTokens() // Çıkışta da temizle tatlım
    },
     token: getAccessToken(),
  }
}

