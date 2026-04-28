import { NextRequest, NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth-server';
import { createReportTemplate, loadReportTemplatesForUser } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const data = await loadReportTemplatesForUser(sessionUser.id, Boolean(sessionUser.isSuperuser));
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudieron cargar las plantillas.';
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
    const template = await createReportTemplate({
      actorUserId: sessionUser.id,
      name: String(body.name || ''),
      description: String(body.description || ''),
      module: String(body.module || 'Informes personalizados'),
      templateKey: String(body.templateKey || ''),
      config: (body.config || {}) as Record<string, unknown>,
    });

    return NextResponse.json({ ok: true, data: template });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar la plantilla.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

