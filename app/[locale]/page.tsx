'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import MyButton from '../components/MyButton';


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
    <main className="flex flex-col items-center justify-center min-h-screen">
    <div className="absolute top-0 left-5">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="/images/books.png"
                  className="h-8 w-auto"
                />
              </a>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <div className="flex gap-2">
        <MyButton
          onClick={() => router.push(`/${currentLocale}/login`)}
        >
          {t('button')}
        </MyButton>
        <MyButton
          onClick={() => router.push(`/${currentLocale}/register`)}
        >
          {currentLocale === 'tr' ? 'Kayıt Ol' : 'Register'}
        </MyButton>
      </div>
        <button
          onClick={() => switchLocale('tr')}
          className={`px-3 py-1 rounded shadow-md font-extralight ${currentLocale === 'tr' ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800'}`}
        >
          TR
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={`px-3 py-1 rounded shadow-md font-extralight ${currentLocale === 'en' ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800'}`}
        >
          EN
        </button>
      </div>
      
      <p className="text-gray-700 mb-8 absolute top-5 right-72">
        {currentLocale === 'tr'
          ? 'Lütfen giriş yapın ya da kayıt olun |'
          : 'Please login or register |'}
      </p>
     <h1 className='text-4xl absolute left-35 top-25 text-cyan-800 font-extralight'>{currentLocale === 'tr'
      ? 'KÜTÜPHANE'
      : 'LIBRARY'
      }</h1>
      <p className='absolute top-40 left-35 max-w-55 '> {currentLocale === 'tr'
          ? 'Kütüphane uygulamasına hoşgeldin, çalışma odası tutabilir ya da var olan odalarını görebilirsin.'
          : 'Welcome to the Library app, you can book a study room or check out the rooms you already have.'}</p>
    </main>
  )
}
