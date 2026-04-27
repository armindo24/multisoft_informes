import { redirect } from 'next/navigation';
import { NotificationsPanel } from '@/components/auth/notifications-panel';
import { PageHeader } from '@/components/ui/page-header';
import { getSessionUser } from '@/lib/auth-server';
import {
  loadActiveSessions,
  loadActiveUserOptions,
  loadNotificationsForUser,
  loadTaskCommentsForUser,
  loadTasksForUser,
  loadUserCompanyAssignments,
  loadUserDetailedById,
} from '@/lib/admin-config';

type NotificationEvent = {
  id: string;
  title: string;
  description: string;
  tone: 'info' | 'success' | 'warning' | 'neutral';
  timestamp: string | null;
  href?: string;
};

function dueDiffDays(dueDate: string | null) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function notificationTone(type: string, isRead: boolean): NotificationEvent['tone'] {
  if (isRead) return 'neutral';
  return type.startsWith('task') ? 'info' : 'warning';
}

export default async function NotificacionesPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser?.id) {
    redirect('/login');
  }

  const [user, activeSessions, assignments, tasks, notifications, users, comments] = await Promise.all([
    loadUserDetailedById(sessionUser.id),
    loadActiveSessions(),
    loadUserCompanyAssignments(sessionUser.id),
    loadTasksForUser(sessionUser.id),
    loadNotificationsForUser(sessionUser.id),
    loadActiveUserOptions(sessionUser.id),
    loadTaskCommentsForUser(sessionUser.id),
  ]);

  if (!user) {
    redirect('/dashboard');
  }

  const ownSession = activeSessions.rows.find((row) => row.id === sessionUser.id) || null;
  const overdueTasks = tasks.assigned.filter((item) => item.status !== 'resuelta' && (dueDiffDays(item.dueDate) ?? 999) < 0);
  const dueTodayTasks = tasks.assigned.filter((item) => item.status !== 'resuelta' && dueDiffDays(item.dueDate) === 0);
  const summary = {
    activeSessions: ownSession?.sessions || 0,
    lastActivity: ownSession?.lastActivity || null,
    ipAddress: ownSession?.ipAddress || '',
    userAgent: ownSession?.userAgent || '',
    companyCount: assignments.length,
    hasRecoveryEmail: Boolean(user.email),
    pendingTasks: tasks.assigned.filter((item) => item.status !== 'resuelta').length,
    createdTasks: tasks.created.filter((item) => item.status !== 'resuelta').length,
    unreadNotifications: notifications.filter((item) => !item.isRead).length,
    overdueTasks: overdueTasks.length,
    dueTodayTasks: dueTodayTasks.length,
  };

  const accountEvents: NotificationEvent[] = [
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

  const dueEvents: NotificationEvent[] = [
    ...overdueTasks.slice(0, 3).map((task) => ({
      id: `task-overdue-${task.id}`,
      title: 'Tarea vencida',
      description: `${task.title} quedo vencida${task.dueDate ? ` el ${task.dueDate}` : ''}.`,
      tone: 'warning' as const,
      timestamp: task.updatedAt || task.createdAt || null,
      href: `/notificaciones?task=${task.id}`,
    })),
    ...dueTodayTasks.slice(0, 2).map((task) => ({
      id: `task-today-${task.id}`,
      title: 'Tarea con vencimiento hoy',
      description: `${task.title} requiere seguimiento durante la jornada.`,
      tone: 'info' as const,
      timestamp: task.updatedAt || task.createdAt || null,
      href: `/notificaciones?task=${task.id}`,
    })),
  ];

  const taskEvents: NotificationEvent[] = notifications.slice(0, 8).map((notification) => ({
      id: `notification-${notification.id}`,
      title: notification.title,
      description: notification.message || 'Se registro una novedad en tu bandeja interna.',
      tone: notificationTone(notification.type, notification.isRead),
      timestamp: notification.createdAt,
      href: notification.href,
    }));

  const events: NotificationEvent[] = [...dueEvents, ...taskEvents, ...accountEvents].slice(0, 10);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Centro personal"
        title="Mis notificaciones"
        description="Resumen de seguridad y actividad reciente de tu cuenta para revisar accesos, empresas habilitadas y estado de recuperacion."
      />

      <NotificationsPanel
        initialSummary={summary}
        initialEvents={events}
        initialTasksAssigned={tasks.assigned}
        initialTasksCreated={tasks.created}
        initialNotifications={notifications}
        initialTaskComments={comments}
        userOptions={users.map((item) => ({ id: item.id, label: item.label, username: item.username, isCurrentUser: item.isCurrentUser }))}
      />
    </div>
  );
}
