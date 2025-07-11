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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
<div className="p-6 bg-white backdrop-blur-sm : shadow-lg w-100 rounded-2xl">
      <div className="flex flex-col gap-3 w-full max-w-sm">

<h1 className="text-cyan-950 flex items-center justify-center text-2xl font-semibold mb-4">{t('title')}</h1>

        <input
          name="name"
          type="text"
          placeholder={t('name')}
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
        />
        <input
          name="lastname"
          type="text"
          placeholder={t('lastname')}
          value={form.lastname}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder={t('email')}
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder={t('password')}
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
        />
        <input
          name="phone"
          type="tel"
          placeholder={t('phone')}
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
        />
        <input
          name="image"
          type="text"
          placeholder={t('image')}
          value={form.image}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
        />
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full py-2 bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
        >
          {isLoading ? t('loading') : t('button')}
        </button>
        {error && <p className="text-cyan-950 text-sm">{error}</p>}
      </div>
      </div>
    </main>
  )
}
