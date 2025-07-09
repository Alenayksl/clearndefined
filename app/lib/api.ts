import axios from 'axios'
import { getAccessToken } from '@/app/utils/cookies'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true // Eğer backend cookie de istiyorsa (şu an zorunlu değil)
})

// 🛡️ Her isteğe Authorization header'ı ekle
api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
