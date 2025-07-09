import useSWR from 'swr'
import { api } from '@/app/lib/api'
import { API_ENDPOINTS } from '@/app/constants/endpoints'
import { getAccessToken } from '@/app/utils/cookies'

export const usePaginatedReservations = (userId: number, page = 1, limit = 5) => {
  const token = getAccessToken()

  const fetcher = async (url: string) => {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.reservations // ✨ sadece reservations dizisini döndürüyoruz
  }

  const { data, error, isLoading } = useSWR(
    userId ? `${API_ENDPOINTS.RESERVATIONS}?page=${page}&limit=2` : null,
    fetcher
  )

  return {
    reservations: data || [],
    isLoading,
    isError: error,
  }
}
