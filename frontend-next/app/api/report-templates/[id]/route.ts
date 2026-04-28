import { NextRequest, NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth-server';
import { deleteReportTemplate, updateReportTemplate } from '@/lib/admin-config';

export const runtime = 'nodejs';

function getTemplateId(id: string) {
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
    const template = await updateReportTemplate({
      templateId: getTemplateId(routeParams.id),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
      name: typeof body.name === 'string' ? body.name : undefined,
      description: typeof body.description === 'string' ? body.description : undefined,
      module: typeof body.module === 'string' ? body.module : undefined,
      templateKey: typeof body.templateKey === 'string' ? body.templateKey : undefined,
      config: body.config && typeof body.config === 'object' && !Array.isArray(body.config)
        ? body.config as Record<string, unknown>
        : undefined,
    });

    return NextResponse.json({ ok: true, data: template });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la plantilla.';
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
    await deleteReportTemplate({
      templateId: getTemplateId(routeParams.id),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la plantilla.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
