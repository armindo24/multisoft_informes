import { NextResponse } from 'next/server';
import {
  loadCompanyAccessOptions,
  loadUserCompanyAssignments,
  loadUsersForAdmin,
  saveUserCompanyAssignments,
} from '@/lib/admin-config';
import { getSessionUser } from '@/lib/auth-server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion expirada. Vuelve a ingresar.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = Number(searchParams.get('userId') || 0);

    const [allUsers, allOptions] = await Promise.all([loadUsersForAdmin(), loadCompanyAccessOptions()]);

    if (!sessionUser.isSuperuser) {
      const ownUser = allUsers.filter((user) => user.id === sessionUser.id);
      const assignments = await loadUserCompanyAssignments(sessionUser.id);
      const assignedKeys = new Set(assignments.map((item) => `${item.empresa}-${item.db}`));
      const options = allOptions.filter((item) => assignedKeys.has(item.key));

      return NextResponse.json({
        ok: true,
        data: {
          users: ownUser,
          options,
          assignments,
          permissions: {
            canManageAssignments: false,
            currentUserId: sessionUser.id,
          },
        },
      });
    }

    const users = allUsers;
    const options = allOptions;
    const resolvedUserId = requestedUserId || users[0]?.id || 0;
    const assignments = resolvedUserId ? await loadUserCompanyAssignments(resolvedUserId) : [];

    return NextResponse.json({
      ok: true,
      data: {
        users,
        options,
        assignments,
        permissions: {
          canManageAssignments: true,
          currentUserId: sessionUser.id,
        },
      },
    });
  } catch (error) {
    console.error('User company load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar la asignacion de empresas.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion expirada. Vuelve a ingresar.' }, { status: 401 });
    }

    if (!sessionUser.isSuperuser) {
      return NextResponse.json({ ok: false, message: 'No tienes permiso para asignar empresas a usuarios.' }, { status: 403 });
    }

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
