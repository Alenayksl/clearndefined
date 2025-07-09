'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/app/lib/api'
import { API_ENDPOINTS } from '@/app/constants/endpoints'
import { useAuthStore } from '@/app/stores/authStore'
import { setAccessToken, setRefreshToken } from '@/app/utils/cookies'

export default function LoginPage() {
  const t = useTranslations('login')
  const locale = useLocale()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setUser = useAuthStore((s) => s.setUser)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await api.post(API_ENDPOINTS.LOGIN, { email, password })
      const { accessToken, refreshToken, user } = res.data
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      setUser(user)
      router.push(`/${locale}/dashboard`)
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
        <input
          type="email"
          className="w-full mb-4 p-2 border rounded"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? t('loading') : t('button')}
        </button>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
