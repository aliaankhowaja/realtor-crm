import { getToken } from 'next-auth/jwt'

interface SessionUser {
  id: string
  name: string | null
  email: string | null
  role: string
}

export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token) {
    return null
  }

  return {
    id: token.id as string,
    name: token.name as string | null,
    email: token.email as string | null,
    role: token.role as string
  }
}
