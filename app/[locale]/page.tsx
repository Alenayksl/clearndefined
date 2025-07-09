'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const router = useRouter()
  const t = useTranslations('login')
  const params = useParams()
  const currentLocale = params?.locale as string || 'tr'

  const switchLocale = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      router.push(`/${newLocale}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* 🌐 Dil Seçimi */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => switchLocale('tr')}
          className={`px-3 py-1 rounded ${currentLocale === 'tr' ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border border-pink-500'}`}
        >
          TR
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={`px-3 py-1 rounded ${currentLocale === 'en' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-600'}`}
        >
          EN
        </button>
      </div>

      {/* 🏡 Ana İçerik */}
      <h1 className="text-3xl font-bold mb-4 text-pink-600">{t('title')}</h1>
      <p className="text-gray-700 mb-8">
        {currentLocale === 'tr'
          ? 'Lütfen giriş yapın ya da kayıt olun, balım 💅'
          : 'Please login or register, babe 💅'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push(`/${currentLocale}/login`)}
          className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
        >
          {t('button')}
        </button>
        <button
          onClick={() => router.push(`/${currentLocale}/register`)}
          className="px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
        >
          {currentLocale === 'tr' ? 'Kayıt Ol' : 'Register'}
        </button>
      </div>
    </main>
  )
}
