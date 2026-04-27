import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { createReportSchedule, loadReportScheduleLogsForUser, loadReportSchedulesForUser } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const [schedules, logs] = await Promise.all([
      loadReportSchedulesForUser(sessionUser.id, Boolean(sessionUser.isSuperuser)),
      loadReportScheduleLogsForUser(sessionUser.id, Boolean(sessionUser.isSuperuser), 12),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        schedules,
        logs,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudieron cargar las programaciones.';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const schedule = await createReportSchedule({
      actorUserId: sessionUser.id,
      reportKey: String(body.reportKey || ''),
      reportTitle: String(body.reportTitle || ''),
      module: String(body.module || ''),
      targetUrl: String(body.targetUrl || ''),
      reportParams: (body.reportParams || {}) as Record<string, string>,
      frequency: String(body.frequency || 'mensual') as 'diaria' | 'semanal' | 'mensual',
      timeOfDay: String(body.timeOfDay || '08:00'),
      dayOfWeek: body.dayOfWeek == null ? null : Number(body.dayOfWeek),
      dayOfMonth: body.dayOfMonth == null ? null : Number(body.dayOfMonth),
      recipientUserIds: Array.isArray(body.recipientUserIds) ? body.recipientUserIds.map((item) => Number(item)) : [],
      extraEmails: Array.isArray(body.extraEmails) ? body.extraEmails.map((item) => String(item || '')) : String(body.extraEmails || ''),
      emailSubject: String(body.emailSubject || ''),
      emailMessage: String(body.emailMessage || ''),
      isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
    });

    return NextResponse.json({ ok: true, data: schedule });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la programacion.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
