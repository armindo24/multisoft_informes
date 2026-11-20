import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { closeNextSession } from '@/lib/admin-config';

export async function POST() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(AUTH_COOKIE)?.value;

  let sessionKey: string | undefined;
  try { sessionKey = rawSession ? JSON.parse(rawSession)?.sessionKey : undefined; } catch {}
  try {
    await closeNextSession(sessionKey);
  } catch (error) {
    console.error('Logout session close error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cerrar la sesión. Intenta nuevamente.' }, { status: 503 });
  }

  cookieStore.set(AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
