import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { authenticateWithPostgres } from '@/lib/pg-auth';

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

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, JSON.stringify(authenticatedUser), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return NextResponse.json({ ok: true, user: authenticatedUser });
  } catch (error) {
    console.error('Login PostgreSQL error:', error);
    return NextResponse.json(
      { ok: false, message: 'No se pudo validar el acceso contra PostgreSQL.' },
      { status: 500 },
    );
  }
}
