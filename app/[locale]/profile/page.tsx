'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function ProfilePage() {
  const t = useTranslations('profile')
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
        <h1>{t('updateProfile')}</h1>
        <p style={{ color: 'red' }}>{t('mustLogin')}</p>
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
        setMessage({ type: 'error', text: data.message || t('updateError') })
      } else {
        setMessage({ type: 'success', text: t('updateSuccess') })
      }
    } catch {
      setMessage({ type: 'error', text: t('serverError') })
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setMessage({ type: 'error', text: t('passwordMissing') })
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
        setMessage({ type: 'error', text: data.message || t('passwordChangeError') })
      } else {
        setMessage({ type: 'success', text: t('passwordChangeSuccess') })
        setPasswordData({ oldPassword: '', newPassword: '' })
      }
    } catch {
      setMessage({ type: 'error', text: t('serverError') })
    }
  }

  const handleDeleteAccount = async () => {
    const onay = confirm(t('deleteConfirm'))
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
        setMessage({ type: 'error', text: data.message || t('deleteError') })
      } else {
        setMessage({ type: 'success', text: t('deleteSuccess') })
        logout()
        router.push('/login')
      }
    } catch {
      setMessage({ type: 'error', text: t('serverError') })
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100'>
      <div className='top-10'>
        <button
          onClick={() => router.push('/dashboard')}
          className=" bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
          style={{
            cursor: 'pointer',
          }}
        >
          <img src="/images/arrowleft.png" alt="" />
        </button>
      </div>
      <div className='min-h-screen flex items-center justify-center'>
        <div className=' bg-white backdrop-blur-sm : shadow-lg w-220 p-6 rounded-2xl pd'>
      <table>
         
            <img className='size-15 px-1 py-1 rounded-b-full shadow-md font-extralight' src="/images/profile.png" alt="" />
        <h1 className='text-cyan-800'><strong>{t('updateProfile')}</strong></h1>

        {message && (
          <p style={{ color: message.type === 'error' ? 'crimson' : 'green', fontWeight: 500 }}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleProfileSubmit} style={{ marginBottom: '2rem' }}>
          <label>
            {t('name')}<br />
            <input name="name" value={profileData.name} onChange={handleProfileChange}
            className='w-100 mb-4 p-2 border border-cyan-800 rounded'
            />
          </label><br />

          <label>
            {t('lastname')}<br />
            <input name="lastname" value={profileData.lastname} onChange={handleProfileChange}
             className='w-100 mb-4 p-2 border border-cyan-800 rounded'
            />
          </label><br />

          <label>
            {t('email')}<br />
            <input name="email" value={profileData.email} onChange={handleProfileChange}
             className='w-100 mb-4 p-2 border border-cyan-800 rounded'
            />
          </label><br />

          <label>
            {t('phone')}<br />
            <input name="phone" value={profileData.phone} onChange={handleProfileChange}
             className='w-100 mb-4 p-2 border border-cyan-800 rounded'
            />
          </label><br />

          <button
          className="w-full py-2 bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
          type="submit" style={{ marginTop: '1rem' }}>{t('submitUpdate')}</button>
        </form>
        
       
          <div className='p-8'>
        <h2 className='text-cyan-800'><strong>{t('changePassword')}</strong></h2>
        <form onSubmit={handlePasswordSubmit}>
          <label>
            {t('oldPassword')}<br />
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
               className='w-100 mb-4 p-2 border border-cyan-800 rounded'
            />
          </label><br />

          <label>
            {t('newPassword')}<br />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
               className='w-100 mb-4 p-2 border border-cyan-800 rounded'
            />
          </label><br />

          <button 
          className="w-full py-2 bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
          type="submit" style={{ marginTop: '1rem' }}>{t('submitPassword')}</button>
        <br /><br />
        <button
          onClick={handleDeleteAccount}
          className='w-full py-2 bg-red-700 hover:bg-red-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight'
          style={{
            cursor: 'pointer'
          }}
        >
          {t('deleteAccount')}
        </button>

        </form>
        </div>
             
      </table>
      </div>
      </div>
    </main>
  )
}
