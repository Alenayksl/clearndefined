// app/hooks/useReservationActions.ts
import { api } from '@/app/lib/api'
import { getAccessToken } from '@/app/utils/cookies'

export const useReservationActions = () => {
  const token = getAccessToken()

  const updateReservation = async (id: number, start: string, end: string) => {
    const res = await api.put(`/reservations/reservations/${id}`, {
      start_datetime: start,
      end_datetime: end
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return res.data
  }

  const deleteReservation = async (id: number) => {
    const res = await api.delete(`/reservations/reservations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return res.data
  }

  return { updateReservation, deleteReservation }
}
