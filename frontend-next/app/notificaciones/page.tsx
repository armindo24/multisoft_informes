import { redirect } from 'next/navigation';
import { NotificationsPanel } from '@/components/auth/notifications-panel';
import { PageHeader } from '@/components/ui/page-header';
import { getSessionUser } from '@/lib/auth-server';
import { loadActiveSessions, loadUserCompanyAssignments, loadUserDetailedById } from '@/lib/admin-config';

type NotificationEvent = {
  id: string;
  title: string;
  description: string;
  tone: 'info' | 'success' | 'warning' | 'neutral';
  timestamp: string | null;
};

export default async function NotificacionesPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser?.id) {
    redirect('/login');
  }

  const [user, activeSessions, assignments] = await Promise.all([
    loadUserDetailedById(sessionUser.id),
    loadActiveSessions(),
    loadUserCompanyAssignments(sessionUser.id),
  ]);

  if (!user) {
    redirect('/dashboard');
  }

  const ownSession = activeSessions.rows.find((row) => row.id === sessionUser.id) || null;
  const summary = {
    activeSessions: ownSession?.sessions || 0,
    lastActivity: ownSession?.lastActivity || null,
    ipAddress: ownSession?.ipAddress || '',
    userAgent: ownSession?.userAgent || '',
    companyCount: assignments.length,
    hasRecoveryEmail: Boolean(user.email),
  };

  const events: NotificationEvent[] = [
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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Centro personal"
        title="Mis notificaciones"
        description="Resumen de seguridad y actividad reciente de tu cuenta para revisar accesos, empresas habilitadas y estado de recuperacion."
      />

      <NotificationsPanel initialSummary={summary} initialEvents={events} />
    </div>
  );
}
