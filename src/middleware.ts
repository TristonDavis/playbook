import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/api/webhook(.*)',
])

const isAuthRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // If logged in and on the landing page or auth routes → send to dashboard
  if (userId && (request.nextUrl.pathname === '/' || isAuthRoute(request))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If not logged in and on a protected route → Clerk handles the redirect
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}