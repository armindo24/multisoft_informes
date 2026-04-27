import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { runReportScheduleNow } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const routeParams = await params;
    const result = await runReportScheduleNow({
      scheduleId: Number(routeParams.id || 0),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
      origin: request.nextUrl.origin,
    });

    return NextResponse.json({
      ok: true,
      message: `Envio ejecutado correctamente para ${result.sentCount} destinatario(s).`,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo ejecutar la programacion.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
