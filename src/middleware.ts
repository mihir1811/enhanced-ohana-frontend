// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value
  const pathname = request.nextUrl.pathname

  const publicPaths = ['/', '/about', '/about-us', '/contact', '/contact-us', '/login', '/register']

  // ✅ Allow public pages (including login/register) for everyone
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // ✅ Allow public product browsing and auth flows (no login required)
  const publicPrefixes = ['/diamonds', '/gemstones', '/jewelry', '/bullions', '/watches', '/auctions', '/education', '/compare', '/product', '/auth']
  if (publicPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // 🚫 Protect user routes (profile, wishlist, orders, chat) - require any authenticated role
  if (pathname.startsWith('/user') && role !== 'user' && role !== 'seller' && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
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
