'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { usePaginatedReservations } from '@/app/hooks/usePaginatedReservations'
import { useReservationActions } from '@/app/hooks/useReservationActions'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // ✨ Yönlendirme için ekledik aşkım

export default function MyReservationsPage() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState(1)
  const { reservations, isLoading, isError } = usePaginatedReservations(user?.id || 0, page, 5)
  const { updateReservation, deleteReservation } = useReservationActions()
  const [form, setForm] = useState<{ [id: number]: { start: string; end: string } }>({})
  const router = useRouter()

  const handleChange = (id: number, field: 'start' | 'end', value: string) => {
    setForm((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleUpdate = async (id: number) => {
    const { start, end } = form[id] || {}
    if (!start || !end) return alert('Başlangıç ve bitiş zamanı gerekli canım 🥺')
    try {
      await updateReservation(id, start, end)
      alert('Güncellendi 🎉')
      location.reload()
    } catch {
      alert('Güncelleme başarısız 😢')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Emin misin aşkım? Silince geri dönüş yok 😱')) return
    try {
      await deleteReservation(id)
      alert('Silindi 💔')
      location.reload()
    } catch {
      alert('Silme başarısız 😢')
    }
  }

  if (loading) return <div>Yükleniyor aşkım... 💫</div>
  if (!user) return <div>Giriş yapman gerekiyor tatlım 💔</div>
  if (isError) return <div>Bir sorun oluştu canım 😢</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Hoşgeldin {user.name} 💖</h1>

      {isLoading ? (
        <p>Rezervasyonların getiriliyor...</p>
      ) : reservations.length === 0 ? (
        <p>Hiç rezervasyonun yok canım 🥲</p>
      ) : (
        <ul className="space-y-3">
          {reservations.map((r: any) => (
            <li key={r.id} className="p-3 border rounded-xl space-y-1">
              <p>Oda ID: {r.room_id}</p>
              <p>Başlangıç: {new Date(r.start_datetime).toLocaleString()}</p>
              <p>Bitiş: {new Date(r.end_datetime).toLocaleString()}</p>

              <input
                type="datetime-local"
                value={form[r.id]?.start || ''}
                onChange={(e) => handleChange(r.id, 'start', e.target.value)}
                className="border p-1 mt-1"
              />
              <input
                type="datetime-local"
                value={form[r.id]?.end || ''}
                onChange={(e) => handleChange(r.id, 'end', e.target.value)}
                className="border p-1 mt-1 ml-2"
              />

              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleUpdate(r.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Güncelle ✏️
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sil 🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          disabled={page === 1}
        >
          ⬅️ Önceki
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
        >
          Sonraki ➡️
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          ⬅️ Anasayfaya Dön
        </button>
      </div>
    </div>
  )
}
