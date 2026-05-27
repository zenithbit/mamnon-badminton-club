import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/dashboard/members', '/dashboard/profile']
const publicRoutes = ['/login', '/signup']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
  const isPublic = publicRoutes.includes(path)

  // Read session from cookie (no next/headers here — use req.cookies)
  const token = req.cookies.get('session')?.value
  const session = await decrypt(token)

  // Unauthenticated user hitting a protected route → send to login
  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Authenticated user hitting a public auth route → send to dashboard
  if (isPublic && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|ico|svg)$).*)'],
}
