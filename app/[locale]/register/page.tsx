'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function RegisterPage() {
  const t = useTranslations('register')
  const router = useRouter()
  const params = useParams()
  const currentLocale = params?.locale || 'tr'

  const [form, setForm] = useState({
    name: '',
    lastname: '',  // backend’in istediği alan adı
    email: '',
    password: '',
    phone: '',
    image: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const switchLocale = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      router.push(`/${newLocale}/register`)
    }
  }

  const handleRegister = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        ...form,
        image: form.image || null,
        role: 'user'
      }

      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Registration failed')

      router.push(`/${currentLocale}/login`)
    } catch {
      setError(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      {/* Dil Değiştirme Butonları */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => switchLocale('tr')}
          className={`px-3 py-1 rounded ${
            currentLocale === 'tr'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-pink-500 border border-pink-500'
          }`}
        >
          TR
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={`px-3 py-1 rounded ${
            currentLocale === 'en'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-purple-600 border border-purple-600'
          }`}
        >
          EN
        </button>
      </div>

      <h1 className="text-2xl font-bold text-pink-600 mb-6">{t('title')}</h1>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <input
          name="name"
          type="text"
          placeholder={t('name')}
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="lastname"
          type="text"
          placeholder={t('lastname')}
          value={form.lastname}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder={t('email')}
          value={form.email}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder={t('password')}
          value={form.password}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="phone"
          type="tel"
          placeholder={t('phone')}
          value={form.phone}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="image"
          type="text"
          placeholder={t('image')}
          value={form.image}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
        >
          {isLoading ? t('loading') : t('button')}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </main>
  )
}
