import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { authenticateWithPostgres } from '@/lib/pg-auth';
import { createNextSessionKey, registerNextSession } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = String(body?.username || '').trim();
  const password = String(body?.password || '').trim();

  try {
    const authenticatedUser = await authenticateWithPostgres(username, password);
    if (!authenticatedUser) {
      return NextResponse.json({ ok: false, message: 'Usuario o contrasena incorrectos.' }, { status: 401 });
    }

    const maxAge = 60 * 60 * 12;
    const sessionKey = createNextSessionKey();
    const sessionUser = { ...authenticatedUser, sessionKey };
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    await registerNextSession({
      sessionKey,
      userId: authenticatedUser.id,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + maxAge * 1000),
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, JSON.stringify(sessionUser), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge,
    });

    return NextResponse.json({ ok: true, user: sessionUser });
  } catch (error) {
    console.error('Login PostgreSQL error:', error);
    return NextResponse.json(
      { ok: false, message: 'No se pudo validar el acceso contra PostgreSQL.' },
      { status: 500 },
    );
  }
}
