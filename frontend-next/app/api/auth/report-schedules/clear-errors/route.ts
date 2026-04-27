import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { clearReportScheduleErrorsForUser } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    await clearReportScheduleErrorsForUser(sessionUser.id, Boolean(sessionUser.isSuperuser));
    return NextResponse.json({ ok: true, message: 'Fallos limpiados correctamente.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudieron limpiar los fallos.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
