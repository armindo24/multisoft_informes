import { NextResponse } from 'next/server';
import { closeUserSessions, loadActiveSessions } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await loadActiveSessions();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Active sessions load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar usuarios conectados.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
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
