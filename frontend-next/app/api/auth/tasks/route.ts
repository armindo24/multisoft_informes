import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { createUserTask } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const task = await createUserTask({
      actorUserId: sessionUser.id,
      assignedTo: Number(body.assignedTo || 0),
      title: String(body.title || ''),
      description: String(body.description || ''),
      priority: String(body.priority || 'media') as 'baja' | 'media' | 'alta',
      module: String(body.module || ''),
      targetUrl: String(body.targetUrl || ''),
      dueDate: body.dueDate ? String(body.dueDate) : null,
    });

    return NextResponse.json({ ok: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la tarea.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
