import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { authenticateWithPostgres, FirstLoginPasswordError } from '@/lib/pg-auth';
import { closeNextSession, createNextSessionKey, registerNextSession } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const identifier = String(body?.identifier || body?.username || '').trim();
  const password = String(body?.password || '');

  try {
    const authenticatedUser = await authenticateWithPostgres(identifier, password, typeof body?.newPassword === 'string' ? body.newPassword : undefined, typeof body?.confirmPassword === 'string' ? body.confirmPassword : undefined);
    if (!authenticatedUser) {
      return NextResponse.json({ ok: false, message: 'Usuario, correo o contrasena incorrectos.' }, { status: 401 });
    }

    if (authenticatedUser.requiresPasswordChange) {
      return NextResponse.json({ ok: true, requiresPasswordChange: true });
    }

    const cookieStore = await cookies();
    let previousKey: string | undefined;
    try { previousKey = JSON.parse(cookieStore.get(AUTH_COOKIE)?.value || 'null')?.sessionKey; } catch {}
    await closeNextSession(previousKey);

    const maxAge = 60 * 60 * 12;
    const sessionKey = createNextSessionKey();
    const sessionUser = { ...authenticatedUser, sessionKey };
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const sessionStatus = await registerNextSession({
      sessionKey,
      userId: authenticatedUser.id,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + maxAge * 1000),
    });

    cookieStore.set(AUTH_COOKIE, JSON.stringify(sessionUser), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge,
    });

    const limitNotice = sessionStatus.closedSessions > 0
      ? `Se cerraron ${sessionStatus.closedSessions} sesion(es) anterior(es) porque alcanzaste el limite permitido de ${sessionStatus.maxSessionsPerUser}.`
      : '';

    return NextResponse.json({
      ok: true,
      user: sessionUser,
      limitNotice,
      closedSessions: sessionStatus.closedSessions,
      maxSessionsPerUser: sessionStatus.maxSessionsPerUser,
    });
  } catch (error) {
    if (error instanceof FirstLoginPasswordError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }
    console.error('Login PostgreSQL error:', error);
    return NextResponse.json(
      { ok: false, message: 'No se pudo validar el acceso contra PostgreSQL.' },
      { status: 500 },
    );
  }
}
