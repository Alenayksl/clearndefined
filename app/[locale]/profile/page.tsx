'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  })

  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Profil Güncelleme</h1>
        <p style={{ color: 'red' }}>💡 Giriş yapmanız gerekiyor.</p>
      </div>
    )
  }

  const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const res = await fetch('http://localhost:3001/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' })
      } else {
        setMessage({ type: 'success', text: 'Profil başarıyla güncellendi 💖' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Sunucu hatası, tekrar dene aşkım' })
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setMessage({ type: 'error', text: 'Eski ve yeni parolayı doldurmalısın canım!' })
      return
    }

    try {
      const res = await fetch('http://localhost:3001/users/me/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Şifre değiştirme hatası oldu' })
      } else {
        setMessage({ type: 'success', text: 'Şifren başarıyla değişti 💫' })
        setPasswordData({ oldPassword: '', newPassword: '' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Sunucu hatası, tekrar dene aşkım' })
    }
  }

  const handleDeleteAccount = async () => {
    const onay = confirm('Aman dikkat! Hesabını silmek istediğine emin misin? Bu işlem geri alınamaz 💔')
    if (!onay) return

    try {
      const res = await fetch('http://localhost:3001/users/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Hesap silinemedi, tekrar dene.' })
      } else {
        setMessage({ type: 'success', text: 'Hesabın başarıyla silindi. Görüşürüz aşkım! 😢' })
        logout()
        router.push('/login')
      }
    } catch {
      setMessage({ type: 'error', text: 'Sunucu hatası, tekrar dene aşkım' })
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 500 }}>
      <h1>Profil Güncelle</h1>

      {message && (
        <p style={{ color: message.type === 'error' ? 'crimson' : 'green', fontWeight: 500 }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleProfileSubmit} style={{ marginBottom: '2rem' }}>
        <label>
          İsim:<br />
          <input name="name" value={profileData.name} onChange={handleProfileChange} />
        </label><br />

        <label>
          Soyisim:<br />
          <input name="lastname" value={profileData.lastname} onChange={handleProfileChange} />
        </label><br />

        <label>
          Email:<br />
          <input name="email" value={profileData.email} onChange={handleProfileChange} />
        </label><br />

        <label>
          Telefon:<br />
          <input name="phone" value={profileData.phone} onChange={handleProfileChange} />
        </label><br />

        <button type="submit" style={{ marginTop: '1rem' }}>Bilgilerimi Güncelle</button>
      </form>

      <h2>Şifre Değiştir</h2>
      <form onSubmit={handlePasswordSubmit}>
        <label>
          Eski Parola:<br />
          <input
            type="password"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />
        </label><br />

        <label>
          Yeni Parola:<br />
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
        </label><br />

        <button type="submit" style={{ marginTop: '1rem' }}>Şifremi Değiştir</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <button
        onClick={handleDeleteAccount}
        style={{
          backgroundColor: 'crimson',
          color: 'white',
          padding: '0.8rem 1.2rem',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        Hesabımı Sil 🗑️
      </button>

      <hr style={{ margin: '2rem 0' }} />

      <button
        onClick={() => router.push('/dashboard')}
        style={{
          backgroundColor: '#6a0dad',
          color: 'white',
          padding: '0.8rem 1.2rem',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        ⬅️ Anasayfaya Dön
      </button>
    </div>
  )
}
