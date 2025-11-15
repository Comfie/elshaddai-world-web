import NextAuth from 'next-auth';
import { authConfigEdge } from './auth.config.edge';

const { auth } = NextAuth(authConfigEdge);

export default auth;

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
