// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value
  const pathname = request.nextUrl.pathname

  // 🚫 Block unauthorized access to seller/admin areas
  if (pathname.startsWith('/seller') && role !== 'seller') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ⛔️ Prevent logged-in users from seeing login/register again
  if (['/login', '/register'].includes(pathname) && role) {
    if (role === 'seller') return NextResponse.redirect(new URL('/seller/dashboard', request.url))
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
