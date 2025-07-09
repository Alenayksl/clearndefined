'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/app/hooks/useAuth'
import { toast } from 'sonner'
import { getAccessToken } from '@/app/utils/cookies'
import { useRouter } from 'next/navigation'

export default function ReservePage() {
  const t = useTranslations('reserve')
  const { user, loading } = useAuth()
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:3001/rooms') 
        const data = await res.json()
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms)
        } else {
          setRooms([])
        }
      } catch (err) {
        console.error(err)
        setRooms([])
      }
    }
    fetchRooms()
  }, [])

  if (loading) return <div>Yükleniyor aşkım... 🌸</div>
  if (!user) return <div>Giriş yapman gerekiyor aşkım 💔</div>

  const toISOStringWithSeconds = (dtLocal: string) => {
    return new Date(dtLocal).toISOString()
  }

  const handleSubmit = async () => {
    if (!selectedRoom || !start || !end) {
      toast.error('Tüm alanları doldur aşkım 💔')
      return
    }

    const token = getAccessToken()
    if (!token) {
      toast.error('Giriş yapılmamış gibi görünüyorsun şekerim 💅🏻')
      return
    }

    try {
      const res = await fetch('http://localhost:3001/reservations/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: selectedRoom,
          start_datetime: toISOStringWithSeconds(start),
          end_datetime: toISOStringWithSeconds(end),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Bir şeyler ters gitti 😢')
        return
      }

      toast.success('Rezervasyonun başarıyla yapıldı balım 💅🏻')
      setSelectedRoom(null)
      setStart('')
      setEnd('')
    } catch {
      toast.error('Sunucuya ulaşılamıyor 😵')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">{t('title')}</h1>

      {rooms.length === 0 ? (
        <p className="text-sm text-gray-500">{t('noRooms')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border rounded-xl cursor-pointer transition ${
                selectedRoom === room.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedRoom(room.id)}
            >
              <p className="font-medium">{room.name}</p>
              <p className="text-xs text-gray-500">{room.description || room.status}</p>
              {selectedRoom === room.id && (
                <p className="text-xs text-blue-600 mt-2">Seçildi 💖</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4">
        <label>
          Başlangıç:
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label>
          Bitiş:
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="block w-full border p-2 rounded"
          />
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Rezerve Et
      </button>

      {/* 🏠 Anasayfa butonu */}
      <button
        onClick={() => router.push('/dashboard')}
        className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition"
      >
        🏡 Anasayfaya Dön
      </button>
    </div>
  )
}
