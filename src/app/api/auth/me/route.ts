import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) return NextResponse.json(null, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json(null, { status: 401 })

    return NextResponse.json({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    })
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
