import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware runs on the edge
  // We can't check Firebase auth here, so we rely on client-side redirects
  // This is just for basic path protection
  
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // For all other paths, let the client-side auth check handle it
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
