import { NextRequest, NextResponse } from 'next/server';
import { runDueReportSchedules } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const configuredSecret = String(process.env.REPORT_SCHEDULE_SECRET || '').trim();
    const providedSecret = String(request.headers.get('x-schedule-secret') || '').trim();

    if (!configuredSecret || providedSecret !== configuredSecret) {
      return NextResponse.json({ ok: false, message: 'Acceso no autorizado.' }, { status: 403 });
    }

    const result = await runDueReportSchedules(request.nextUrl.origin);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudieron ejecutar las programaciones.';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
