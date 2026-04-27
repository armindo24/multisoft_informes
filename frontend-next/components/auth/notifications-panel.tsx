'use client';

import { Bell, CalendarClock, CheckCheck, Clock3, ListTodo, Mail, MonitorSmartphone, Play, RefreshCcw, Send, ShieldCheck, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type NotificationSummary = {
  activeSessions: number;
  lastActivity: string | null;
  ipAddress: string;
  userAgent: string;
  companyCount: number;
  hasRecoveryEmail: boolean;
  pendingTasks: number;
  createdTasks: number;
  unreadNotifications: number;
  overdueTasks: number;
  dueTodayTasks: number;
};

type NotificationEvent = {
  id: string;
  title: string;
  description: string;
  tone: 'info' | 'success' | 'warning' | 'neutral';
  timestamp: string | null;
  href?: string;
};

type TaskStatus = 'pendiente' | 'en_proceso' | 'resuelta';
type TaskPriority = 'baja' | 'media' | 'alta';

type TaskItem = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  module: string;
  targetUrl: string;
  dueDate: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  assignedToName: string;
  createdByName: string;
};

type UserNotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  href: string;
  isRead: boolean;
  createdAt: string | null;
  actorName: string;
};

type TaskCommentItem = {
  id: number;
  taskId: number;
  message: string;
  createdAt: string | null;
  authorId: number;
  authorName: string;
  authorUsername: string;
};

type UserOption = {
  id: number;
  label: string;
  username: string;
  isCurrentUser: boolean;
};

type ReportScheduleFrequency = 'diaria' | 'semanal' | 'mensual';

type ReportScheduleItem = {
  id: number;
  reportKey: string;
  reportTitle: string;
  module: string;
  targetUrl: string;
  reportParams: Record<string, string>;
  frequency: ReportScheduleFrequency;
  timeOfDay: string;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  recipientUserIds: number[];
  recipientUsers: Array<{ id: number; label: string; username: string; email: string }>;
  extraEmails: string[];
  emailSubject: string;
  emailMessage: string;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdById: number;
  createdByName: string;
  createdByUsername: string;
};

type ReportScheduleLogItem = {
  id: number;
  scheduleId: number;
  reportTitle: string;
  module: string;
  status: 'success' | 'error';
  sentCount: number;
  message: string;
  executedAt: string | null;
};

type NotificationsPanelProps = {
  initialSummary: NotificationSummary;
  initialEvents: NotificationEvent[];
  initialTasksAssigned: TaskItem[];
  initialTasksCreated: TaskItem[];
  initialNotifications: UserNotificationItem[];
  initialTaskComments: TaskCommentItem[];
  initialReportSchedules: ReportScheduleItem[];
  initialReportScheduleLogs: ReportScheduleLogItem[];
  userOptions: UserOption[];
};

function fmtDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-PY');
}

function toneClasses(tone: NotificationEvent['tone']) {
  if (tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  if (tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (tone === 'info') return 'border-cyan-200 bg-cyan-50 text-cyan-900';
  return 'border-slate-200 bg-slate-50 text-slate-900';
}

function priorityBadge(priority: TaskPriority) {
  if (priority === 'alta') return 'border-rose-200 bg-rose-50 text-rose-700';
  if (priority === 'baja') return 'border-slate-200 bg-slate-50 text-slate-600';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function statusBadge(status: TaskStatus) {
  if (status === 'resuelta') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'en_proceso') return 'border-cyan-200 bg-cyan-50 text-cyan-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function dueState(dueDate: string | null) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) {
    return { label: `Vence ${dueDate}`, className: 'border-slate-200 bg-white text-slate-600' };
  }

  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) {
    return { label: `Vencida ${dueDate}`, className: 'border-rose-200 bg-rose-50 text-rose-700' };
  }
  if (diffDays === 0) {
    return { label: `Vence hoy`, className: 'border-amber-200 bg-amber-50 text-amber-700' };
  }
  if (diffDays <= 2) {
    return { label: `Proxima ${dueDate}`, className: 'border-cyan-200 bg-cyan-50 text-cyan-700' };
  }
  return { label: `Vence ${dueDate}`, className: 'border-slate-200 bg-white text-slate-600' };
}

function scheduleFrequencyLabel(item: ReportScheduleItem) {
  if (item.frequency === 'diaria') return `Diaria · ${item.timeOfDay}`;
  if (item.frequency === 'semanal') {
    const labels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    return `Semanal · ${labels[item.dayOfWeek ?? 1]} · ${item.timeOfDay}`;
  }
  return `Mensual · dia ${item.dayOfMonth ?? 1} · ${item.timeOfDay}`;
}

export function NotificationsPanel({
  initialSummary,
  initialEvents,
  initialTasksAssigned,
  initialTasksCreated,
  initialNotifications,
  initialTaskComments,
  initialReportSchedules,
  initialReportScheduleLogs,
  userOptions,
}: NotificationsPanelProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [events, setEvents] = useState(initialEvents);
  const [tasksAssigned, setTasksAssigned] = useState(initialTasksAssigned);
  const [tasksCreated, setTasksCreated] = useState(initialTasksCreated);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [taskComments, setTaskComments] = useState(initialTaskComments);
  const [reportSchedules, setReportSchedules] = useState(initialReportSchedules);
  const [reportScheduleLogs, setReportScheduleLogs] = useState(initialReportScheduleLogs);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');
  const [taskSaving, setTaskSaving] = useState(false);
  const [noticeSaving, setNoticeSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [commentSavingFor, setCommentSavingFor] = useState<number | null>(null);
  const [scheduleActionId, setScheduleActionId] = useState<number | null>(null);
  const [commentForms, setCommentForms] = useState<Record<number, string>>({});
  const [form, setForm] = useState({
    assignedTo: String(userOptions.find((item) => !item.isCurrentUser)?.id || userOptions[0]?.id || ''),
    title: '',
    description: '',
    priority: 'media' as TaskPriority,
    module: '',
    targetUrl: '',
    dueDate: '',
  });
  const [noticeForm, setNoticeForm] = useState({
    targetUserId: String(userOptions.find((item) => !item.isCurrentUser)?.id || userOptions[0]?.id || ''),
    title: '',
    message: '',
    href: '',
    sendEmail: false,
  });

  const currentUnread = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
  const commentsByTask = useMemo(() => {
    return taskComments.reduce<Record<number, TaskCommentItem[]>>((acc, comment) => {
      if (!acc[comment.taskId]) acc[comment.taskId] = [];
      acc[comment.taskId].push(comment);
      return acc;
    }, {});
  }, [taskComments]);
  const logsBySchedule = useMemo(() => {
    return reportScheduleLogs.reduce<Record<number, ReportScheduleLogItem[]>>((acc, item) => {
      if (!acc[item.scheduleId]) acc[item.scheduleId] = [];
      acc[item.scheduleId].push(item);
      return acc;
    }, {});
  }, [reportScheduleLogs]);

  async function refreshSchedules() {
    const response = await fetch('/api/auth/report-schedules', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: {
        schedules?: ReportScheduleItem[];
        logs?: ReportScheduleLogItem[];
      };
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data) {
      throw new Error(payload.message || 'No se pudieron cargar las programaciones.');
    }

    setReportSchedules(payload.data.schedules || []);
    setReportScheduleLogs(payload.data.logs || []);
  }

  async function refresh() {
    setLoading(true);
    setMessage(null);
    setMessageTone('error');

    const response = await fetch('/api/auth/notifications', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: {
        summary?: NotificationSummary;
        events?: NotificationEvent[];
        tasksAssigned?: TaskItem[];
        tasksCreated?: TaskItem[];
        notifications?: UserNotificationItem[];
        taskComments?: TaskCommentItem[];
      };
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data?.summary || !payload.data?.events) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudieron actualizar las notificaciones.');
      setLoading(false);
      return false;
    }

    setSummary(payload.data.summary);
    setEvents(payload.data.events);
    setTasksAssigned(payload.data.tasksAssigned || []);
    setTasksCreated(payload.data.tasksCreated || []);
    setNotifications(payload.data.notifications || []);
    setTaskComments(payload.data.taskComments || []);
    try {
      await refreshSchedules();
    } catch (error) {
      setMessageTone('error');
      setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las programaciones.');
      setLoading(false);
      return false;
    }
    setLoading(false);
    return true;
  }

  async function submitTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTaskSaving(true);
    setMessage(null);
    setMessageTone('error');

    const response = await fetch('/api/auth/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        assignedTo: Number(form.assignedTo || 0),
        dueDate: form.dueDate || null,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo crear la tarea.');
      setTaskSaving(false);
      return;
    }

    setForm((current) => ({ ...current, title: '', description: '', targetUrl: '', dueDate: '' }));
    await refresh();
    setTaskSaving(false);
  }

  async function submitNotice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNoticeSaving(true);
    setMessage(null);
    setMessageTone('error');

    const response = await fetch('/api/auth/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: Number(noticeForm.targetUserId || 0),
        title: noticeForm.title,
        message: noticeForm.message,
        href: noticeForm.href,
        sendEmail: noticeForm.sendEmail,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo enviar el aviso.');
      setNoticeSaving(false);
      return;
    }

    setNoticeForm((current) => ({ ...current, title: '', message: '', href: '', sendEmail: false }));
    const refreshed = await refresh();
    if (refreshed) {
      setMessageTone('success');
      setMessage(payload.message || 'Aviso enviado correctamente.');
    }
    setNoticeSaving(false);
  }

  async function updateTaskStatus(taskId: number, status: TaskStatus) {
    setActionLoading(taskId);
    setMessage(null);

    const response = await fetch(`/api/auth/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo actualizar la tarea.');
      setActionLoading(null);
      return;
    }

    await refresh();
    setActionLoading(null);
  }

  async function markAllRead() {
    setMarkingAll(true);
    setMessage(null);

    const response = await fetch('/api/auth/notifications/read-all', { method: 'POST' });
    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo actualizar la bandeja.');
      setMarkingAll(false);
      return;
    }

    await refresh();
    setMarkingAll(false);
  }

  async function submitComment(taskId: number) {
    const messageText = String(commentForms[taskId] || '').trim();
    if (!messageText) {
      setMessageTone('error');
      setMessage('Escribe un comentario antes de enviarlo.');
      return;
    }

    setCommentSavingFor(taskId);
    setMessage(null);

    const response = await fetch(`/api/auth/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: TaskCommentItem[];
      message?: string;
    };
    if (!response.ok || !payload.ok || !payload.data) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo registrar el comentario.');
      setCommentSavingFor(null);
      return;
    }

    const nextComments = payload.data;
    setTaskComments((current) => {
      const next = current.filter((item) => item.taskId !== taskId);
      return [...next, ...nextComments];
    });
    setCommentForms((current) => ({ ...current, [taskId]: '' }));
    await refresh();
    setCommentSavingFor(null);
  }

  async function toggleSchedule(item: ReportScheduleItem, isActive: boolean) {
    setScheduleActionId(item.id);
    setMessage(null);

    const response = await fetch(`/api/auth/report-schedules/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo actualizar la programacion.');
      setScheduleActionId(null);
      return;
    }

    await refreshSchedules();
    setScheduleActionId(null);
  }

  async function runScheduleNow(item: ReportScheduleItem) {
    setScheduleActionId(item.id);
    setMessage(null);

    const response = await fetch(`/api/auth/report-schedules/${item.id}/run`, {
      method: 'POST',
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo ejecutar la programacion.');
      setScheduleActionId(null);
      return;
    }

    setMessageTone('success');
    setMessage(payload.message || 'Programacion ejecutada correctamente.');
    await refreshSchedules();
    setScheduleActionId(null);
  }

  async function deleteSchedule(item: ReportScheduleItem) {
    setScheduleActionId(item.id);
    setMessage(null);

    const response = await fetch(`/api/auth/report-schedules/${item.id}`, {
      method: 'DELETE',
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo eliminar la programacion.');
      setScheduleActionId(null);
      return;
    }

    await refreshSchedules();
    setScheduleActionId(null);
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div
          className={[
            'rounded-2xl px-4 py-3 text-sm',
            messageTone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-rose-200 bg-rose-50 text-rose-700',
          ].join(' ')}
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Actividad reciente</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Mis notificaciones</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Esta bandeja resume seguridad, accesos recientes y datos utiles de tu cuenta actual.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-800 transition hover:bg-cyan-50 disabled:opacity-60"
          >
            <RefreshCcw className={['h-4 w-4', loading ? 'animate-spin' : ''].join(' ')} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Sesiones activas</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.activeSessions}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Ultima actividad</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{fmtDate(summary.lastActivity)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Empresas habilitadas</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.companyCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Recuperacion por correo</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{summary.hasRecoveryEmail ? 'Configurada' : 'Pendiente'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Tareas pendientes</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.pendingTasks}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Notificaciones sin leer</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.unreadNotifications}</p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">Tareas vencidas</p>
            <p className="mt-2 text-2xl font-semibold text-rose-900">{summary.overdueTasks}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Vencen hoy</p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">{summary.dueTodayTasks}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-cyan-700" />
          <h3 className="text-lg font-semibold text-slate-900">Nueva tarea interna</h3>
        </div>

        <form className="mt-5 grid gap-4 lg:grid-cols-2" onSubmit={submitTask}>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Asignar a</span>
            <select
              value={form.assignedTo}
              onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
            >
              <option value="">Seleccionar usuario</option>
              {userOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}{item.isCurrentUser ? ' (yo)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Titulo</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="Ej.: Revisar balance de abril"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Prioridad</span>
            <select
              value={form.priority}
              onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Vencimiento</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Modulo</span>
            <input
              value={form.module}
              onChange={(event) => setForm((current) => ({ ...current, module: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="Finanzas, Ventas, Compras..."
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Enlace directo</span>
            <input
              value={form.targetUrl}
              onChange={(event) => setForm((current) => ({ ...current, targetUrl: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="/finanzas?empresa=BG..."
            />
          </label>
          <label className="space-y-2 text-sm lg:col-span-2">
            <span className="font-medium text-slate-700">Detalle</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="Indicaciones para el usuario..."
            />
          </label>
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={taskSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {taskSaving ? 'Asignando...' : 'Asignar tarea'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyan-700" />
          <h3 className="text-lg font-semibold text-slate-900">Avisar a usuario</h3>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Envia un aviso directo sin crear tarea, ideal para alertas rapidas o pedidos breves.
        </p>

        <form className="mt-5 grid gap-4 lg:grid-cols-2" onSubmit={submitNotice}>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Destinatario</span>
            <select
              value={noticeForm.targetUserId}
              onChange={(event) => setNoticeForm((current) => ({ ...current, targetUserId: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
            >
              <option value="">Seleccionar usuario</option>
              {userOptions.filter((item) => !item.isCurrentUser).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Titulo</span>
            <input
              value={noticeForm.title}
              onChange={(event) => setNoticeForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="Ej.: Favor revisar informe"
            />
          </label>
          <label className="space-y-2 text-sm lg:col-span-2">
            <span className="font-medium text-slate-700">Mensaje</span>
            <textarea
              value={noticeForm.message}
              onChange={(event) => setNoticeForm((current) => ({ ...current, message: event.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="Detalle breve del aviso..."
            />
          </label>
          <label className="space-y-2 text-sm lg:col-span-2">
            <span className="font-medium text-slate-700">Enlace opcional</span>
            <input
              value={noticeForm.href}
              onChange={(event) => setNoticeForm((current) => ({ ...current, href: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
              placeholder="/finanzas?empresa=BG..."
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 lg:col-span-2">
            <input
              type="checkbox"
              checked={noticeForm.sendEmail}
              onChange={(event) => setNoticeForm((current) => ({ ...current, sendEmail: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-700" />
              Enviar tambien por correo si el usuario tiene email y la configuracion SMTP esta activa
            </span>
          </label>
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={noticeSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {noticeSaving ? 'Enviando...' : 'Enviar aviso'}
            </button>
          </div>
        </form>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-700" />
            <h3 className="text-lg font-semibold text-slate-900">Eventos relevantes</h3>
          </div>

          <div className="mt-5 space-y-3">
            {events.length ? (
              events.map((event) => (
                <article key={event.id} className={['rounded-2xl border p-4', toneClasses(event.tone)].join(' ')}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="mt-2 text-sm leading-6">{event.description}</p>
                      {event.href ? (
                        <a href={event.href} className="mt-3 inline-flex text-sm font-medium text-cyan-800 hover:text-cyan-600">
                          Abrir enlace relacionado
                        </a>
                      ) : null}
                    </div>
                    <span className="whitespace-nowrap text-xs font-medium opacity-80">{fmtDate(event.timestamp)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No hay eventos para mostrar.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3 text-slate-900">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-700" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Bandeja interna</p>
              </div>
              <button
                type="button"
                onClick={() => void markAllRead()}
                disabled={markingAll || currentUnread === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                {markingAll ? 'Marcando...' : 'Marcar todo leido'}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {notifications.length ? (
                notifications.map((notification) => (
                  <article
                    key={notification.id}
                    className={[
                      'rounded-2xl border p-4 text-sm',
                      notification.isRead ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-cyan-200 bg-cyan-50 text-cyan-950',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{notification.title}</p>
                        <p className="mt-1 leading-6">{notification.message}</p>
                        <p className="mt-2 text-xs opacity-80">Por: {notification.actorName || 'Sistema'}</p>
                        {notification.href ? (
                          <a href={notification.href} className="mt-2 inline-flex text-xs font-semibold text-cyan-800 hover:text-cyan-600">
                            Abrir
                          </a>
                        ) : null}
                      </div>
                      <span className="text-[11px] font-medium opacity-80">{fmtDate(notification.createdAt)}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  No hay notificaciones internas pendientes.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-slate-900">
              <MonitorSmartphone className="h-4 w-4 text-cyan-700" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Dispositivo reciente</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-500">IP</p>
                <p className="mt-1 font-medium text-slate-900">{summary.ipAddress || '-'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-500">Agente</p>
                <p className="mt-1 break-words font-medium text-slate-900">{summary.userAgent || '-'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-slate-900">
              <Clock3 className="h-4 w-4 text-cyan-700" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Recomendacion</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Si ves una IP o un dispositivo que no reconoces, cambia tu contrasena desde tu perfil y vuelve a iniciar sesion.
            </p>
          </section>
        </aside>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-cyan-700" />
            <h3 className="text-lg font-semibold text-slate-900">Tareas asignadas a mi</h3>
          </div>
          <div className="mt-5 space-y-3">
            {tasksAssigned.length ? (
              tasksAssigned.map((task) => (
                <article key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {(() => {
                    const due = dueState(task.dueDate);
                    const taskCommentsList = commentsByTask[task.id] || [];
                    return (
                      <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{task.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{task.description || 'Sin detalle adicional.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className={['rounded-full border px-2.5 py-1', priorityBadge(task.priority)].join(' ')}>{task.priority}</span>
                        <span className={['rounded-full border px-2.5 py-1', statusBadge(task.status)].join(' ')}>{task.status.replace('_', ' ')}</span>
                        {task.module ? <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">{task.module}</span> : null}
                        {due ? <span className={['rounded-full border px-2.5 py-1', due.className].join(' ')}>{due.label}</span> : null}
                      </div>
                    </div>
                    <select
                      value={task.status}
                      onChange={(event) => void updateTaskStatus(task.id, event.target.value as TaskStatus)}
                      disabled={actionLoading === task.id}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 disabled:opacity-60"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="resuelta">Resuelta</option>
                    </select>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Creada por {task.createdByName}</span>
                    <span>Actualizada {fmtDate(task.updatedAt || task.createdAt)}</span>
                    {task.targetUrl ? (
                      <a href={task.targetUrl} className="font-semibold text-cyan-700 hover:text-cyan-600">
                        Abrir contexto
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Comentarios</p>
                    <div className="mt-3 space-y-2">
                      {taskCommentsList.length ? (
                        taskCommentsList.map((comment) => (
                          <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                              <span className="font-semibold text-slate-700">{comment.authorName}</span>
                              <span>{fmtDate(comment.createdAt)}</span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{comment.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Todavia no hay comentarios en esta tarea.</p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <textarea
                        value={commentForms[task.id] || ''}
                        onChange={(event) => setCommentForms((current) => ({ ...current, [task.id]: event.target.value }))}
                        rows={2}
                        className="min-h-[72px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                        placeholder="Agregar comentario de seguimiento..."
                      />
                      <button
                        type="button"
                        onClick={() => void submitComment(task.id)}
                        disabled={commentSavingFor === task.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 px-4 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50 disabled:opacity-60"
                      >
                        <Send className="h-4 w-4" />
                        {commentSavingFor === task.id ? 'Enviando...' : 'Comentar'}
                      </button>
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No tienes tareas asignadas por ahora.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-cyan-700" />
            <h3 className="text-lg font-semibold text-slate-900">Tareas creadas por mi</h3>
          </div>
          <div className="mt-5 space-y-3">
            {tasksCreated.length ? (
              tasksCreated.map((task) => (
                <article key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {(() => {
                    const due = dueState(task.dueDate);
                    const taskCommentsList = commentsByTask[task.id] || [];
                    return (
                      <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{task.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{task.description || 'Sin detalle adicional.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className={['rounded-full border px-2.5 py-1', priorityBadge(task.priority)].join(' ')}>{task.priority}</span>
                        <span className={['rounded-full border px-2.5 py-1', statusBadge(task.status)].join(' ')}>{task.status.replace('_', ' ')}</span>
                        {due ? <span className={['rounded-full border px-2.5 py-1', due.className].join(' ')}>{due.label}</span> : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Asignada a {task.assignedToName}</span>
                    <span>Actualizada {fmtDate(task.updatedAt || task.createdAt)}</span>
                    {task.targetUrl ? (
                      <a href={task.targetUrl} className="font-semibold text-cyan-700 hover:text-cyan-600">
                        Abrir contexto
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Comentarios</p>
                    <div className="mt-3 space-y-2">
                      {taskCommentsList.length ? (
                        taskCommentsList.map((comment) => (
                          <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                              <span className="font-semibold text-slate-700">{comment.authorName}</span>
                              <span>{fmtDate(comment.createdAt)}</span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{comment.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Todavia no hay comentarios en esta tarea.</p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <textarea
                        value={commentForms[task.id] || ''}
                        onChange={(event) => setCommentForms((current) => ({ ...current, [task.id]: event.target.value }))}
                        rows={2}
                        className="min-h-[72px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                        placeholder="Agregar comentario de seguimiento..."
                      />
                      <button
                        type="button"
                        onClick={() => void submitComment(task.id)}
                        disabled={commentSavingFor === task.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 px-4 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50 disabled:opacity-60"
                      >
                        <Send className="h-4 w-4" />
                        {commentSavingFor === task.id ? 'Enviando...' : 'Comentar'}
                      </button>
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Todavia no creaste tareas internas.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-violet-700" />
            <h3 className="text-lg font-semibold text-slate-900">Informes programados</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Revisa las entregas automaticas guardadas desde los informes y pruebales manualmente antes de moverlas a cron.
          </p>

          <div className="mt-5 space-y-3">
            {reportSchedules.length ? (
              reportSchedules.map((item) => {
                const scheduleLogs = (logsBySchedule[item.id] || []).slice(0, 3);
                return (
                  <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.reportTitle}</h4>
                        <p className="mt-1 text-sm text-slate-500">{item.module || 'General'} · {scheduleFrequencyLabel(item)}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className={['rounded-full border px-2.5 py-1', item.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'].join(' ')}>
                            {item.isActive ? 'Activa' : 'Pausada'}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                            Proximo: {fmtDate(item.nextRunAt)}
                          </span>
                          {item.lastRunAt ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                              Ultimo: {fmtDate(item.lastRunAt)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void runScheduleNow(item)}
                          disabled={scheduleActionId === item.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100 disabled:opacity-60"
                        >
                          <Play className="h-4 w-4" />
                          Ejecutar ahora
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggleSchedule(item, !item.isActive)}
                          disabled={scheduleActionId === item.id}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          {item.isActive ? 'Pausar' : 'Activar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteSchedule(item)}
                          disabled={scheduleActionId === item.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Destinatarios internos: {item.recipientUsers.length || 0}</span>
                      <span>Correos externos: {item.extraEmails.length || 0}</span>
                      {item.targetUrl ? (
                        <a href={item.targetUrl} className="font-semibold text-violet-700 hover:text-violet-600">
                          Abrir informe
                        </a>
                      ) : null}
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Historial reciente</p>
                      <div className="mt-3 space-y-2">
                        {scheduleLogs.length ? (
                          scheduleLogs.map((log) => (
                            <div key={log.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                                <span className={['rounded-full border px-2 py-1 font-semibold', log.status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'].join(' ')}>
                                  {log.status === 'success' ? 'Correcto' : 'Con error'}
                                </span>
                                <span>{fmtDate(log.executedAt)}</span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-700">{log.message}</p>
                              <p className="mt-1 text-xs text-slate-500">Destinatarios enviados: {log.sentCount}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">Todavia no hay ejecuciones registradas para esta programacion.</p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Todavia no guardaste informes programados. Usa el boton Programar correo desde Balance general para crear el primero.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-violet-700" />
            <h3 className="text-lg font-semibold text-slate-900">Ultimas ejecuciones</h3>
          </div>
          <div className="mt-5 space-y-3">
            {reportScheduleLogs.length ? (
              reportScheduleLogs.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', item.status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'].join(' ')}>
                      {item.status === 'success' ? 'Correcto' : 'Con error'}
                    </span>
                    <span className="text-xs text-slate-500">{fmtDate(item.executedAt)}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.reportTitle || `Programacion #${item.scheduleId}`}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.module || 'General'}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-500">Destinatarios enviados: {item.sentCount}</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Aun no hay ejecuciones registradas.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
