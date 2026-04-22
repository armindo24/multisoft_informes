import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { loadGroupsForAdmin, loadUserCompanyAssignments, loadUserDetailedById, saveOwnAdminProfile } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const [user, allGroups, assignments] = await Promise.all([
      loadUserDetailedById(sessionUser.id),
      loadGroupsForAdmin(),
      loadUserCompanyAssignments(sessionUser.id),
    ]);

    if (!user) {
      return NextResponse.json({ ok: false, message: 'No se encontro el usuario actual.' }, { status: 404 });
    }

    const groups = allGroups
      .filter((group) => user.groups.includes(group.id))
      .map((group) => group.name);

    return NextResponse.json({
      ok: true,
      data: {
        user,
        groups,
        assignments,
      },
    });
  } catch (error) {
    console.error('Profile load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar el perfil.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const saved = await saveOwnAdminProfile(sessionUser.id, {
      username: String(body.username || ''),
      firstName: String(body.firstName || ''),
      lastName: String(body.lastName || ''),
      email: String(body.email || ''),
      password: String(body.password || ''),
    });

    const [allGroups, assignments] = await Promise.all([
      loadGroupsForAdmin(),
      loadUserCompanyAssignments(sessionUser.id),
    ]);

    const groups = saved
      ? allGroups.filter((group) => saved.groups.includes(group.id)).map((group) => group.name)
      : [];

    return NextResponse.json({
      ok: true,
      data: {
        user: saved,
        groups,
        assignments,
      },
    });
  } catch (error) {
    console.error('Profile save error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo guardar el perfil.' },
      { status: 400 },
    );
  }
}
