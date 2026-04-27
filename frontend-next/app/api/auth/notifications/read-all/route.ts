import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { markAllNotificationsRead } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const notifications = await markAllNotificationsRead(sessionUser.id);
    return NextResponse.json({ ok: true, data: notifications });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la bandeja.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
