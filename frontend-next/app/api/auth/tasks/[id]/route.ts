import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { updateUserTaskStatus } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const task = await updateUserTaskStatus({
      taskId: Number(id || 0),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
      status: String(body.status || 'pendiente') as 'pendiente' | 'en_proceso' | 'resuelta',
    });

    return NextResponse.json({ ok: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la tarea.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
