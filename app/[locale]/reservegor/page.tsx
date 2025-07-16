'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { usePaginatedReservations } from '@/app/hooks/usePaginatedReservations'
import { useReservationActions } from '@/app/hooks/useReservationActions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

function formatToLocalDateTime(dateString: string) {
  const dt = new Date(dateString)
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  const hour = String(dt.getHours()).padStart(2, '0')
  const minute = String(dt.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}`
}

export default function MyReservationsPage() {
  const t = useTranslations('myReservations')
  const { user, loading } = useAuth()
  const [page, setPage] = useState(1)
  const { reservations, isLoading, isError } = usePaginatedReservations(user?.id || 0, page, 5)
  const { updateReservation, deleteReservation } = useReservationActions()
  const [form, setForm] = useState<{ [id: number]: { start: string; end: string } }>({})
  const [visibleOptions, setVisibleOptions] = useState<{ [id: number]: boolean }>({})
  const router = useRouter()

  useEffect(() => {
    Object.entries(form).forEach(([id, times]) => {
      if (times.start) {
        const startDate = new Date(times.start)
        const endDate = times.end ? new Date(times.end) : null

        const year = startDate.getFullYear()
        const month = String(startDate.getMonth() + 1).padStart(2, '0')
        const day = String(startDate.getDate()).padStart(2, '0')

        let endHour = endDate ? String(endDate.getHours()).padStart(2, '0') : String(startDate.getHours()).padStart(2, '0')
        let endMinute = endDate ? String(endDate.getMinutes()).padStart(2, '0') : String(startDate.getMinutes()).padStart(2, '0')

        const newEnd = `${year}-${month}-${day}T${endHour}:${endMinute}`

        if (times.end?.slice(0, 16) !== newEnd) {
          setForm(prev => ({
            ...prev,
            [Number(id)]: {
              ...prev[Number(id)],
              end: newEnd
            }
          }))
        }
      }
    })
  }, [form])

  const handleChange = (id: number, field: 'start' | 'end', value: string) => {
    if (field === 'end') {
      const startVal = form[id]?.start
      if (startVal) {
        const [startDatePart] = startVal.split('T')
        const timePart = value.includes('T') ? value.split('T')[1] : value

        const newEnd = `${startDatePart}T${timePart}`
        setForm((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            end: newEnd
          }
        }))
        return
      }
    }
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
    if (!start || !end) return alert(t('alert.missingDates'))
    try {
      await updateReservation(id, start, end)
      alert(t('alert.updated'))
      location.reload()
    } catch {
      alert(t('alert.updateFailed'))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirm.delete'))) return
    try {
      await deleteReservation(id)
      alert(t('alert.deleted'))
      location.reload()
    } catch {
      alert(t('alert.deleteFailed'))
    }
  }

  const toggleOptions = (id: number) => {
    setVisibleOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    if (!form[id]) {
      const reservation = reservations.find(r => r.id === id)
      if (reservation) {
        setForm((prev) => ({
          ...prev,
          [id]: {
            start: formatToLocalDateTime(reservation.start_datetime),
            end: formatToLocalDateTime(reservation.end_datetime),
          }
        }))
      }
    }
  }

  if (loading) return <div>{t('loading')}</div>
  if (!user) return <div>{t('mustLogin')}</div>
  if (isError) return <div>{t('error')}</div>

  return (
    <main className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
          >
            <img src="/images/arrowleft.png" alt="" />
          </button>
        </h1>
        {isLoading ? (
          <p>{t('fetching')}</p>
        ) : reservations.length === 0 ? (
          <p>{t('noReservations')}</p>
        ) : (
          <ul className="space-y-3">
            {reservations.map((r: any) => (
              <li
                key={r.id}
                className="space-y-1 bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                <p>{t('roomId')}: {r.room_id}</p>
                <p>{t('start')}: {new Date(r.start_datetime).toLocaleString()}</p>
                <p>{t('end')}: {new Date(r.end_datetime).toLocaleString()}</p>
                <div className='absolute right-2 top-6'>
                  <button
                    onClick={() => toggleOptions(r.id)}
                    className="mt-2 text-sm text-cyan-800 underline hover:text-cyan-950"
                  >
                    <img className='w-7 h-7' src="/images/settings.png" alt="" />
                  </button>
                </div>
                {visibleOptions[r.id] && (
                  <div className="mt-2">
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
                      min={form[r.id]?.start?.slice(0,10) + 'T00:00'}
                      max={form[r.id]?.start?.slice(0,10) + 'T23:59'}
                      className="border p-1 mt-1 ml-2"
                    />

                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleUpdate(r.id)}
                        className="bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
                      >
                        {t('update')}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-700 hover:bg-red-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <br />
        <div className='flex items-center justify-center'>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
              disabled={page === 1}
            >
              {t('prev')}
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
            >
              {t('next')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
