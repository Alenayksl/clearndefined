'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { removeTokens } from '@/app/utils/cookies'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('dashboard')

  const currentLocale = pathname.split('/')[1] || 'tr'

  const handleLogout = () => {
    removeTokens()
    logout()
    router.push('/login')
  }

  const goToReserve = () => {
    router.push('/reserve')
  }

  const goToReservations = () => {
    router.push('/reservegor')
  }

  const goToProfile = () => {
    router.push('/profile')
  }

  const switchLocale = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  if (!user) {
    return <p>{t('loading')}</p>
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100'>
    <div style={{ padding: '2rem', position: 'relative', minHeight: '100vh' }}>
      {/* Sağ üst köşedeki dil değiştirme butonları */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => switchLocale('tr')}
           style={{ cursor: 'pointer' }}
          className={`px-3 py-1 rounded-2xl shadow-md font-extralight ${
            currentLocale === 'tr' ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800'
          }`}
        >
          TR
        </button>
        <button
          onClick={() => switchLocale('en')}
           style={{ cursor: 'pointer' }}
          className={`px-3 py-1 rounded-2xl shadow-md font-extralight ${
            currentLocale === 'en' ? 'bg-cyan-800 text-white' : 'bg-white text-cyan-800'
          }`}
        >
          EN
        </button>
      </div>

    <div className='size-15 px-1 py-1 rounded-b-full shadow-md font-extralight'>
      <Image
      src={"/images/profile.png"}
      alt=''
      width={100}
      height={100}
      />
     
      </div> 

      <div className='size-6 absolute bottom-4 right-5'>
        <Image
      src={"/images/books.png"}
      alt=''
      width={30}
      height={30}
      />
      </div>

      <h1 className='text-cyan-800' > {t('welcome', { name: user.name })}</h1>
      <p className='text-cyan-800'><strong>{t('email')}:</strong> {user.email}</p>

 <div className='flex flex-col items-center justify-center mt-10'>
          <div className="max-w-6xl w-full px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          
              <button 
              className="bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
               onClick={goToReserve}> 
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-3">
                  {currentLocale === 'tr' ? 'Çalışma Odası Tut' : 'Book A Study Room'}
                </h3>
                <p className="text-gray-600">
                  {currentLocale === 'tr'
                    ? 'Toplantı, konferans ve çalışma odaları'
                    : 'Meeting, conference, and study rooms'}
                </p>
              </button>

              <button 
              className="bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
               onClick={goToReservations}> 
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-3">
                  {currentLocale === 'tr' ? 'Çalışma Odalarını Görüntüle' : 'View Study Rooms'}
                </h3>
                <p className="text-gray-600">
                  {currentLocale === 'tr'
                    ? 'Rezerve ettiğin odalarını görüntüle'
                    : 'View the rooms you have booked'}
                </p>
              </button> 
              
              <button 
              className="bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
               onClick={goToProfile}>
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold text-cyan-800 mb-3">
                  {currentLocale === 'tr' ? 'Profilimi Düzenle' : 'Edit My Profile'}
                </h3>
                <p className="text-gray-600">
                  {currentLocale === 'tr'
                    ? 'Profil bilgilerini güncelle'
                    : 'Update your profile informations'}
                </p>
              </button>

            </div>
          </div>
           <div style={{ position: 'absolute', bottom: '2rem' }}>
        <button className="w-full py-2 bg-cyan-800 hover:bg-cyan-950 text-white px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight" onClick={handleLogout}
         style={{ cursor: 'pointer' }}>
          {t('logout')}
        </button>
      </div>
        </div>
    </div>
    </main>
  )
}
