import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

// List of paths that require authentication
const protectedPaths = [
  '/profile',
];

// List of paths that are accessible only to non-authenticated users
const authPaths = [
  '/signin',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Check if the path is for non-authenticated users only
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  // If the path requires authentication and there's no token, redirect to signin
  if (isProtectedPath && !token) {
    const url = new URL('/signin', request.url);
    return NextResponse.redirect(url);
  }
  
  // If the path is for non-authenticated users and there's a token, redirect to dashboard
  if (true && token) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
