import { NextResponse } from 'next/server';
import { closeActiveSession, closeUserSessions, loadActiveSessions, saveActiveSessionSettings } from '@/lib/admin-config';
import { getSessionUser } from '@/lib/auth-server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.isSuperuser) {
      return NextResponse.json({ ok: false, message: 'No tienes permiso para ver usuarios conectados.' }, { status: 403 });
    }

    const data = await loadActiveSessions();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Active sessions load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar usuarios conectados.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.isSuperuser) {
      return NextResponse.json({ ok: false, message: 'No tienes permiso para cerrar sesiones.' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    if (body.maxSessionsPerUser != null) {
      await saveActiveSessionSettings({
        maxSessionsPerUser: Number(body.maxSessionsPerUser || 0),
      });
      const data = await loadActiveSessions();
      return NextResponse.json({ ok: true, data });
    }

    const sessionKey = String(body.sessionKey || '').trim();
    if (sessionKey) {
      const data = await closeActiveSession(body.source, sessionKey);
      return NextResponse.json({ ok: true, data });
    }

    const userId = Number(body.userId || 0);
    if (!userId) {
      return NextResponse.json({ ok: false, message: 'Usuario invalido.' }, { status: 400 });
    }

    const data = await closeUserSessions(userId);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Active sessions close error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cerrar la sesion del usuario.' }, { status: 400 });
  }
}
