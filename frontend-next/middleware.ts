import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { AUTH_COOKIE } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/password-reset'];
const LOGIN_URL = 'http://10.0.0.22:3001/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(LOGIN_URL);
  }

  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(LOGIN_URL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
