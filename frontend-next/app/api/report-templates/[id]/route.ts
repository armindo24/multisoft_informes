import { NextRequest, NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth-server';
import { deleteReportTemplate } from '@/lib/admin-config';

export const runtime = 'nodejs';

function getTemplateId(id: string) {
  return Number(id || 0);
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

