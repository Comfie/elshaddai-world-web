import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user is accessing admin routes
    if (path.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Super admin can access everything
      if (token.role === 'SUPER_ADMIN') {
        return NextResponse.next();
      }

      // Admin can access most things except settings
      if (token.role === 'ADMIN' && path.startsWith('/admin/settings')) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      // Leader has limited access
      if (token.role === 'LEADER') {
        const allowedPaths = [
          '/admin/dashboard',
          '/admin/members',
          '/admin/follow-ups',
          '/admin/events',
          '/admin/ministries',
        ];

        const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed));
        if (!isAllowed) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
      }

      // Regular members shouldn't access admin at all
      if (token.role === 'MEMBER') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};
