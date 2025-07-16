'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-0 left-5">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
                  src={"/images/books.png"}
                  alt=''
                  width={30}
                  height={30}
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
             style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-2xl shadow-md font-extralight ${currentLocale === 'tr' ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800'}`}
          >
            TR
          </button>
          <button
            onClick={() => switchLocale('en')}
             style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-2xl shadow-md font-extralight ${currentLocale === 'en' ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800'}`}
          >
            EN
          </button>
        </div>
        <h1 className='text-5xl flex-col items-center justify-center mt-10 text-cyan-800 font-semibold'>{currentLocale === 'tr'
          ? 'KÜTÜPHANE'
          : 'LIBRARY'
        }</h1>
        <p className='flex-col items-center justify-center max-w-120 text-cyan-800 '> {currentLocale === 'tr'
          ? 'Kütüphane uygulamasına hoşgeldin, çalışma odası tutabilir ya da var olan odalarını görebilirsin.'
          : 'Welcome to the Library app, you can book a study room or check out the rooms you already have.'}</p>

        <div className='flex flex-col items-center justify-center mt-10'>
          <div className="max-w-6xl w-full px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-3">
                  {currentLocale === 'tr' ? 'Kullanıcı Dostu' : 'User Friendly'}
                </h3>
                <p className="text-gray-600">
                  {currentLocale === 'tr'
                    ? 'Basit ve kullanışlı arayüz'
                    : 'Simple and intuitive interface'}
                </p>
              </div>
              <div className="bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-3">
                  {currentLocale === 'tr' ? 'Kolay Rezervasyon' : 'Easy Booking'}
                </h3>
                <p className="text-gray-600">
                  {currentLocale === 'tr'
                    ? 'Hızlı ve kolay oda rezervasyonu'
                    : 'Quick and easy room booking'}
                </p>
              </div>
              <div className="bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-3">
                  {currentLocale === 'tr' ? 'Çalışma Odaları' : 'Study Rooms'}
                </h3>
                <p className="text-gray-600">
                  {currentLocale === 'tr'
                    ? 'Sessiz ve konforlu çalışma ortamları'
                    : 'Quiet and comfortable study environments'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
