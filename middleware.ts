import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  // Protect admin routes
  if (path.startsWith('/admin')) {
    if (!session || !session.user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }

    const { role } = session.user;

    // Super admin can access everything
    if (role === 'SUPER_ADMIN') {
      return NextResponse.next();
    }

    // Admin can access most things except settings
    if (role === 'ADMIN' && path.startsWith('/admin/settings')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Leader has limited access
    if (role === 'LEADER') {
      const allowedPaths = [
        '/admin/dashboard',
        '/admin/members',
        '/admin/follow-ups',
        '/admin/events',
        '/admin/ministries',
      ];

      const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed));
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }

    // Regular members shouldn't access admin at all
    if (role === 'MEMBER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (path === '/login' || path === '/register') {
    if (session && session.user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
