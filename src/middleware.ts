import { NextRequest, NextResponse } from 'next/server'
 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'

  const token = request.cookies.get('auth-token')?.value || ''

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/exam/:path*',
    '/instructions/:path*',
    '/odsic',
    '/dashboard'
  ]
}