import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { closeNextSession } from '@/lib/admin-config';

export async function POST() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(AUTH_COOKIE)?.value;

  try {
    const parsed = rawSession ? JSON.parse(rawSession) as { sessionKey?: string } : null;
    await closeNextSession(parsed?.sessionKey);
  } catch {
    // La cookie igual se limpia aunque el registro de sesion no se pueda leer.
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
