import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth-server';
import { markNotificationRead } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const params = await context.params;
    const notificationId = Number(params.id || 0);
    if (!notificationId) {
      return NextResponse.json({ ok: false, message: 'Notificacion invalida.' }, { status: 400 });
    }

    const notifications = await markNotificationRead(sessionUser.id, notificationId);
    return NextResponse.json({ ok: true, data: notifications });
  } catch (error) {
    console.error('Notification read error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo marcar la notificacion como leida.' }, { status: 500 });
  }
}
