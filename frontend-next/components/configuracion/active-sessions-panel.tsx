'use client';

import { useEffect, useState } from 'react';

type ActiveSessionRecord = {
  key: string;
  source: 'django' | 'next';
  id: number;
  username: string;
  fullName: string;
  email: string;
  sessions: number;
  maxSessionsPerUser: number;
  expires: string | null;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
};

type Payload = {
  rows: ActiveSessionRecord[];
  totalUsers: number;
  totalSessions: number;
  maxSessionsPerUser: number;
};

function fmtDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-PY');
}

export function ActiveSessionsPanel() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [closingSessionKey, setClosingSessionKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await fetch('/api/config/active-sessions', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: Payload; message?: string };

      if (!response.ok || !payload.ok || !payload.data) {
        setMessage({ type: 'error', text: payload.message || 'No se pudo cargar usuarios conectados.' });
        setLoading(false);
        return;
      }

      setData(payload.data);
      setLoading(false);
    }

    void load();
  }, []);

  async function closeSession(row: ActiveSessionRecord) {
    setClosingSessionKey(row.key);
    setMessage(null);

    const response = await fetch('/api/config/active-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey: row.key, source: row.source }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: Payload; message?: string };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo cerrar la sesion del usuario.' });
      setClosingSessionKey(null);
      return;
    }

    setData(payload.data);
    setMessage({ type: 'success', text: 'Sesion cerrada correctamente.' });
    setClosingSessionKey(null);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className={['rounded-xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
          {message.text}
        </div>
      ) : null}

      {loading || !data ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">Cargando sesiones activas...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Usuarios con sesion</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{data.totalUsers}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Sesiones activas</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{data.totalSessions}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-[1240px] divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Usuario</th>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Limite</th>
                  <th className="px-4 py-3 font-semibold">Ult. actividad</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                  <th className="px-4 py-3 font-semibold">Agente</th>
                  <th className="px-4 py-3 font-semibold">Expira</th>
                  <th className="px-4 py-3 font-semibold">Origen</th>
                  <th className="px-4 py-3 font-semibold text-right">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-slate-500">No hay usuarios con sesion activa.</td>
                  </tr>
                ) : (
                  data.rows.map((row) => (
                    <tr key={`${row.source}-${row.key}`}>
                      <td className="px-4 py-3 font-medium text-slate-900">{row.username}</td>
                      <td className="px-4 py-3 text-slate-700">{row.fullName || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.email || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.maxSessionsPerUser}</td>
                      <td className="px-4 py-3 text-slate-700">{fmtDate(row.lastActivity)}</td>
                      <td className="px-4 py-3 text-slate-700">{row.ipAddress || '-'}</td>
                      <td className="max-w-[280px] truncate px-4 py-3 text-slate-700" title={row.userAgent}>{row.userAgent || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{fmtDate(row.expires)}</td>
                      <td className="px-4 py-3 text-slate-700">{row.source === 'django' ? 'Django' : 'Next'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void closeSession(row)}
                          disabled={closingSessionKey === row.key}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 disabled:opacity-60"
                        >
                          {closingSessionKey === row.key ? 'Cerrando...' : 'Cerrar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
