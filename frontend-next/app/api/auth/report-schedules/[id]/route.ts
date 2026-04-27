import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { deleteReportSchedule, updateReportSchedule } from '@/lib/admin-config';

export const runtime = 'nodejs';

function getScheduleId(id: string) {
  return Number(id || 0);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const routeParams = await params;
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const schedule = await updateReportSchedule({
      scheduleId: getScheduleId(routeParams.id),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
      isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
      reportParams: body.reportParams as Record<string, string> | undefined,
      frequency: body.frequency ? String(body.frequency) as 'diaria' | 'semanal' | 'mensual' : undefined,
      timeOfDay: typeof body.timeOfDay === 'string' ? body.timeOfDay : undefined,
      dayOfWeek: body.dayOfWeek == null ? undefined : Number(body.dayOfWeek),
      dayOfMonth: body.dayOfMonth == null ? undefined : Number(body.dayOfMonth),
      recipientUserIds: Array.isArray(body.recipientUserIds) ? body.recipientUserIds.map((item) => Number(item)) : undefined,
      extraEmails: Array.isArray(body.extraEmails) ? body.extraEmails.map((item) => String(item || '')) : typeof body.extraEmails === 'string' ? body.extraEmails : undefined,
      emailSubject: typeof body.emailSubject === 'string' ? body.emailSubject : undefined,
      emailMessage: typeof body.emailMessage === 'string' ? body.emailMessage : undefined,
    });

    return NextResponse.json({ ok: true, data: schedule });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la programacion.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const routeParams = await params;
    await deleteReportSchedule({
      scheduleId: getScheduleId(routeParams.id),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la programacion.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
