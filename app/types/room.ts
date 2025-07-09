export interface Room {
  id: number
  name: string
  cover: string
  status: 'available' | 'maintenance' | 'closed'
  description?: string // eğer description yoksa opsiyonel bırakıyoruz
}
