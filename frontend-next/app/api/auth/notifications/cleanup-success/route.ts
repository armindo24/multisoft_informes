import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { cleanupSuccessNotificationsForUser } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const notifications = await cleanupSuccessNotificationsForUser(sessionUser.id);
    return NextResponse.json({
      ok: true,
      message: 'Los eventos exitosos fueron eliminados correctamente.',
      data: {
        notifications,
      },
    });
  } catch (error) {
    console.error('Notifications cleanup success error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudieron limpiar los eventos exitosos.' }, { status: 500 });
  }
}
