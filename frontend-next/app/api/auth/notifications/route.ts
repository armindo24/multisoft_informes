import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { loadActiveSessions, loadUserCompanyAssignments, loadUserDetailedById } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const [user, activeSessions, assignments] = await Promise.all([
      loadUserDetailedById(sessionUser.id),
      loadActiveSessions(),
      loadUserCompanyAssignments(sessionUser.id),
    ]);

    if (!user) {
      return NextResponse.json({ ok: false, message: 'No se encontro el usuario actual.' }, { status: 404 });
    }

    const ownSession = activeSessions.rows.find((row) => row.id === sessionUser.id) || null;
    const events = [
      {
        id: 'session',
        title: ownSession ? 'Sesion activa detectada' : 'Sin sesion Django registrada',
        description: ownSession
          ? `Tienes ${ownSession.sessions} sesion(es) activa(s) en el sistema.`
          : 'No se encontraron sesiones activas adicionales asociadas a tu usuario.',
        tone: ownSession ? 'info' : 'neutral',
        timestamp: ownSession?.lastActivity || user.dateJoined || null,
      },
      {
        id: 'companies',
        title: assignments.length ? 'Empresas habilitadas actualizadas' : 'Sin empresas asignadas',
        description: assignments.length
          ? `Tu usuario opera con ${assignments.length} empresa(s) habilitada(s).`
          : 'Todavia no tienes empresas asociadas para operar en los informes.',
        tone: assignments.length ? 'success' : 'warning',
        timestamp: ownSession?.lastActivity || user.dateJoined || null,
      },
      {
        id: 'profile',
        title: user.email ? 'Correo de recuperacion disponible' : 'Correo pendiente de completar',
        description: user.email
          ? `Tu cuenta puede recibir avisos y recuperacion en ${user.email}.`
          : 'Completa tu correo en Mi perfil para habilitar avisos y recuperacion de acceso.',
        tone: user.email ? 'success' : 'warning',
        timestamp: user.dateJoined || null,
      },
    ];

    return NextResponse.json({
      ok: true,
      data: {
        summary: {
          activeSessions: ownSession?.sessions || 0,
          lastActivity: ownSession?.lastActivity || null,
          ipAddress: ownSession?.ipAddress || '',
          userAgent: ownSession?.userAgent || '',
          companyCount: assignments.length,
          hasRecoveryEmail: Boolean(user.email),
        },
        events,
      },
    });
  } catch (error) {
    console.error('Notifications load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudieron cargar las notificaciones.' }, { status: 500 });
  }
}
