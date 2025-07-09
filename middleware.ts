import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './app/i18n'

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale })

export function middleware(request: NextRequest) {
  const res = intlMiddleware(request)
  if (res) return res

  const token = request.cookies.get('accessToken') || request.cookies.get('token')

  const protectedPaths = ['/reserve', '/reservegor','/profile']
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/reserve/:path*', '/reservegor/:path*','/profile/:path*','/((?!api|_next|.*\\..*).*)']
}
