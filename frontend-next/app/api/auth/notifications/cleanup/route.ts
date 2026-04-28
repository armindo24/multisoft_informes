import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { cleanupNotificationsForUser } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const notifications = await cleanupNotificationsForUser(sessionUser.id, 30);
    return NextResponse.json({
      ok: true,
      message: 'La bandeja interna fue depurada correctamente.',
      data: {
        notifications,
      },
    });
  } catch (error) {
    console.error('Notifications cleanup error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo limpiar la bandeja interna.' }, { status: 500 });
  }
}
