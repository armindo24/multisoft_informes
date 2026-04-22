'use client';

import { Bell, Clock3, MonitorSmartphone, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

type NotificationSummary = {
  activeSessions: number;
  lastActivity: string | null;
  ipAddress: string;
  userAgent: string;
  companyCount: number;
  hasRecoveryEmail: boolean;
};

type NotificationEvent = {
  id: string;
  title: string;
  description: string;
  tone: 'info' | 'success' | 'warning' | 'neutral';
  timestamp: string | null;
};

type NotificationsPanelProps = {
  initialSummary: NotificationSummary;
  initialEvents: NotificationEvent[];
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

export function NotificationsPanel({ initialSummary, initialEvents }: NotificationsPanelProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/auth/notifications', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: {
        summary?: NotificationSummary;
        events?: NotificationEvent[];
      };
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data?.summary || !payload.data?.events) {
      setMessage(payload.message || 'No se pudieron actualizar las notificaciones.');
      setLoading(false);
      return;
    }

    setSummary(payload.data.summary);
    setEvents(payload.data.events);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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
        </div>
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
    </div>
  );
}
