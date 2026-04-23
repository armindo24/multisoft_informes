import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { deleteAdminUser, loadGroupsForAdmin, loadUserDetailedById, loadUsersDetailed, saveAdminUser, saveOwnAdminProfile } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    if (sessionUser.isSuperuser) {
      const [users, groups] = await Promise.all([loadUsersDetailed(), loadGroupsForAdmin()]);
      return NextResponse.json({
        ok: true,
        data: {
          users,
          groups,
          permissions: {
            canManageAllUsers: true,
            canCreateUsers: true,
            canEditPermissions: true,
            currentUserId: sessionUser.id,
          },
        },
      });
    }

    const user = await loadUserDetailedById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ ok: false, message: 'No se encontro el usuario actual.' }, { status: 404 });
    }

    const groups = await loadGroupsForAdmin();
    const allowedGroups = groups.filter((group) => user.groups.includes(group.id));

    return NextResponse.json({
      ok: true,
      data: {
        users: [user],
        groups: allowedGroups,
        permissions: {
          canManageAllUsers: false,
          canCreateUsers: false,
          canEditPermissions: false,
          currentUserId: sessionUser.id,
        },
      },
    });
  } catch (error) {
    console.error('Users config load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar usuarios.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (sessionUser.isSuperuser) {
      const saved = await saveAdminUser({
        id: body.id ? Number(body.id) : undefined,
        username: String(body.username || ''),
        firstName: String(body.firstName || ''),
        lastName: String(body.lastName || ''),
        email: String(body.email || ''),
        isActive: Boolean(body.isActive),
        isSuperuser: Boolean(body.isSuperuser),
        groups: Array.isArray(body.groups) ? body.groups.map((item) => Number(item)).filter(Boolean) : [],
        password: String(body.password || ''),
      });

      const [users, groups] = await Promise.all([loadUsersDetailed(), loadGroupsForAdmin()]);
      return NextResponse.json({
        ok: true,
        data: {
          saved,
          users,
          groups,
          permissions: {
            canManageAllUsers: true,
            canCreateUsers: true,
            canEditPermissions: true,
            currentUserId: sessionUser.id,
          },
        },
      });
    }

    const requestedId = body.id ? Number(body.id) : sessionUser.id;
    if (requestedId !== sessionUser.id) {
      return NextResponse.json({ ok: false, message: 'Solo puedes actualizar tu propio usuario.' }, { status: 403 });
    }

    const saved = await saveOwnAdminProfile(sessionUser.id, {
      username: String(body.username || ''),
      firstName: String(body.firstName || ''),
      lastName: String(body.lastName || ''),
      email: String(body.email || ''),
      password: String(body.password || ''),
    });

    const [user, groups] = await Promise.all([loadUserDetailedById(sessionUser.id), loadGroupsForAdmin()]);
    return NextResponse.json({
      ok: true,
      data: {
        saved,
        users: user ? [user] : [],
        groups: user ? groups.filter((group) => user.groups.includes(group.id)) : [],
        permissions: {
          canManageAllUsers: false,
          canCreateUsers: false,
          canEditPermissions: false,
          currentUserId: sessionUser.id,
        },
      },
    });
  } catch (error) {
    console.error('Users config save error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo guardar el usuario.' },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    if (!sessionUser.isSuperuser) {
      return NextResponse.json({ ok: false, message: 'Solo un administrador total puede eliminar usuarios.' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const userId = Number(body.id || 0);
    const users = await deleteAdminUser({ actorUserId: sessionUser.id, userId });
    const groups = await loadGroupsForAdmin();

    return NextResponse.json({
      ok: true,
      data: {
        users,
        groups,
        permissions: {
          canManageAllUsers: true,
          canCreateUsers: true,
          canEditPermissions: true,
          currentUserId: sessionUser.id,
        },
      },
    });
  } catch (error) {
    console.error('Users config delete error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo eliminar el usuario.' },
      { status: 400 },
    );
  }
}
