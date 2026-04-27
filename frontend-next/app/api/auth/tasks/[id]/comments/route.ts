import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { createTaskComment } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const comments = await createTaskComment({
      taskId: Number(id || 0),
      actorUserId: sessionUser.id,
      actorIsSuperuser: Boolean(sessionUser.isSuperuser),
      message: String(body.message || ''),
    });

    return NextResponse.json({ ok: true, data: comments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo registrar el comentario.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
