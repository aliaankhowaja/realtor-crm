import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

interface SessionUser {
  id: string
  name: string | null
  email: string | null
  role: string
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const tokenRecord = cookieStore.get('token')

  if (!tokenRecord?.value) {
    return null
  }

  const payload = await verifyToken(tokenRecord.value)
  if (!payload) {
    return null
  }

  return {
    id: payload.id as string,
    name: payload.name as string | null,
    email: payload.email as string | null,
    role: payload.role as string
  }
}
