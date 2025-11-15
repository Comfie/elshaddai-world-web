import type { NextAuthConfig } from 'next-auth';

// Edge-compatible auth configuration for middleware
// No Node.js-only imports (Prisma, bcrypt, etc.)
export const authConfigEdge = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register';

      // Redirect unauthenticated users to login page
      if (isOnAdmin && !isLoggedIn) {
        return false;
      }

      // Redirect authenticated users away from auth pages
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers are added in the main config
} satisfies NextAuthConfig;
