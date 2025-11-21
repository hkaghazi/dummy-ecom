import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  if (isOnDashboard) {
    if (isLoggedIn) return
    return NextResponse.redirect(new URL('/login', req.nextUrl)) // Redirect unauthenticated users to login page
  } else if (isLoggedIn) {
    // return Response.redirect(new URL("/dashboard", req.nextUrl))
  }
  return
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
