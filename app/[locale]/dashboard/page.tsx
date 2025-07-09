'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { removeTokens } from '@/app/utils/cookies'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

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
    return <p>Yükleniyor...</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏡 Hoşgeldin, {user.name}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

      <br />
      <button onClick={handleLogout}>Çıkış Yap</button>
      <br /><br />
      <button onClick={goToReserve}>📅 Rezervasyon Yap</button>
      <br /><br />
      <button onClick={goToReservations}>📖 Rezervasyonlarımı Gör</button>
      <br /><br />
      <button onClick={goToProfile}>👤 Profil Bilgilerimi Güncelle</button>
    </div>
  )
}
