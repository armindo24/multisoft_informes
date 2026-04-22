import { NextResponse } from 'next/server';
import {
  loadCompanyAccessOptions,
  loadUserCompanyAssignments,
  loadUsersForAdmin,
  saveUserCompanyAssignments,
} from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = Number(searchParams.get('userId') || 0);

    const [users, options] = await Promise.all([
      loadUsersForAdmin(),
      loadCompanyAccessOptions(),
    ]);

    const resolvedUserId = requestedUserId || users[0]?.id || 0;
    const assignments = resolvedUserId ? await loadUserCompanyAssignments(resolvedUserId) : [];

    return NextResponse.json({ ok: true, data: { users, options, assignments } });
  } catch (error) {
    console.error('User company load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar la asignacion de empresas.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const userId = Number(body.userId || 0);
    if (!userId) {
      return NextResponse.json({ ok: false, message: 'Seleccione un usuario.' }, { status: 400 });
    }

    const saved = await saveUserCompanyAssignments(
      userId,
      Array.isArray(body.values) ? body.values.map((item) => String(item)) : [],
    );

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error('User company save error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo guardar la asignacion de empresas.' }, { status: 400 });
  }
}
