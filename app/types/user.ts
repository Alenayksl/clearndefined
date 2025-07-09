export interface User {
  id: number
  name: string
  lastname: string
  email: string
  phone: number
  role?: string
  accessToken: string | { token: string }
}
