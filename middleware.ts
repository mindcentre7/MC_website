import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dynamic routes that fetch from Blobs — must bypass Netlify CDN caching
const DYNAMIC_ROUTES = ['/', '/about', '/contact']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (DYNAMIC_ROUTES.includes(pathname)) {
    const response = NextResponse.next()
    response.headers.set('Netlify-CDN-Cache-Control', 'no-cache')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|videos|fonts).*)'],
}
