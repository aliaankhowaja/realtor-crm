import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

const publicPaths = ['/login', '/signup', '/api/auth', '/api/socket']

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const tokenCookie = request.cookies.get('token')?.value
  const token = tokenCookie ? await verifyToken(tokenCookie) : null

  // Automatically redirect authenticated users visiting public routes
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/signup')) {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/agent/dashboard', request.url))
    }
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = token.role

  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/agent/dashboard', request.url))
    }
  }

  if (pathname.startsWith('/agent')) {
    if (role !== 'agent') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
