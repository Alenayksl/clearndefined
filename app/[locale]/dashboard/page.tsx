'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { removeTokens } from '@/app/utils/cookies'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const t = useTranslations('dashboard')

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

  if (!user) {
    return <p>{t('loading')}</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏡 {t('welcome', { name: user.name })}</h1>
      <p><strong>{t('email')}:</strong> {user.email}</p>
      <p><strong>{t('role')}:</strong> {user.role}</p>

      <br />
      <button className='btn btn-primary' onClick={handleLogout}>{t('logout')}</button>
      <br /><br />
      <button onClick={goToReserve}>📅 {t('goToReserve')}</button>
      <br /><br />
      <button onClick={goToReservations}>📖 {t('goToReservations')}</button>
      <br /><br />
      <button onClick={goToProfile}>👤 {t('goToProfile')}</button>
    </div>
  )
}
