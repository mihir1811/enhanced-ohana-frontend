// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value
  const pathname = request.nextUrl.pathname

  // Dev preview bypass: allow admin messages pages to render without middleware
  // This helps avoid edge runtime issues in development and lets us debug the UI.
  if (pathname.startsWith('/admin/messages')) {
    return NextResponse.next()
  }

  const publicPaths = ['/', '/about', '/contact', '/login', '/register']

  // ✅ Allow public pages (including login/register) for everyone
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 🚫 Protect seller routes
  if (pathname.startsWith('/seller') && role !== 'seller' && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🚫 Protect admin routes
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
