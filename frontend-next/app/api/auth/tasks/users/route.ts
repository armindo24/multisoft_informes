import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { loadActiveUserOptions } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const users = await loadActiveUserOptions(sessionUser.id);
    return NextResponse.json({ ok: true, data: users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar la lista de usuarios.';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
