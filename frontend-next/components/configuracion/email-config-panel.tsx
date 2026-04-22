'use client';

import { useEffect, useState } from 'react';

type EmailConfigRecord = {
  enabled: boolean;
  host: string;
  port: number;
  fromName: string;
  fromEmail: string;
  replyToName: string;
  replyToEmail: string;
  envelopeFrom: string;
  useSsl: boolean;
  useTls: boolean;
  useAuth: boolean;
  username: string;
  password: string;
  updatedAt: string | null;
};

const emptyConfig: EmailConfigRecord = {
  enabled: false,
  host: '',
  port: 25,
  fromName: '',
  fromEmail: '',
  replyToName: '',
  replyToEmail: '',
  envelopeFrom: '',
  useSsl: false,
  useTls: false,
  useAuth: false,
  username: '',
  password: '',
  updatedAt: null,
};

export function EmailConfigPanel() {
  const [config, setConfig] = useState<EmailConfigRecord>(emptyConfig);
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<'save' | 'test' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await fetch('/api/config/email', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: EmailConfigRecord; message?: string };

      if (!response.ok || !payload.ok || !payload.data) {
        setMessage({ type: 'error', text: payload.message || 'No se pudo cargar la configuracion de email.' });
        setLoading(false);
        return;
      }

      setConfig(payload.data);
      setLoading(false);
    }

    void load();
  }, []);

  function updateField<K extends keyof EmailConfigRecord>(key: K, value: EmailConfigRecord[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  async function submit(action: 'save' | 'test') {
    setSubmitting(action);
    setMessage(null);

    const response = await fetch('/api/config/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...config,
        action,
        testEmail,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: EmailConfigRecord; message?: string };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo procesar la configuracion de email.' });
      setSubmitting(null);
      return;
    }

    setConfig(payload.data);
    setMessage({
      type: 'success',
      text: action === 'test' ? 'Correo de prueba enviado correctamente.' : 'Configuracion de email guardada correctamente.',
    });
    setSubmitting(null);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className={['rounded-xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">Cargando configuracion de email...</div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <input type="checkbox" checked={config.enabled} onChange={(event) => updateField('enabled', event.target.checked)} />
              <span>Habilitar configuracion de email</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <input type="checkbox" checked={config.useSsl} onChange={(event) => updateField('useSsl', event.target.checked)} />
              <span>Usar SSL</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <input type="checkbox" checked={config.useTls} onChange={(event) => updateField('useTls', event.target.checked)} />
              <span>Usar StartTLS</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Servidor SMTP</span>
              <input value={config.host} onChange={(event) => updateField('host', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Puerto</span>
              <input type="number" value={config.port} onChange={(event) => updateField('port', Number(event.target.value || 25))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <input type="checkbox" checked={config.useAuth} onChange={(event) => updateField('useAuth', event.target.checked)} />
              <span>Usar autenticacion</span>
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Remitente (Nombre)</span>
              <input value={config.fromName} onChange={(event) => updateField('fromName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Remitente (Email)</span>
              <input type="email" value={config.fromEmail} onChange={(event) => updateField('fromEmail', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Envelope From</span>
              <input type="email" value={config.envelopeFrom} onChange={(event) => updateField('envelopeFrom', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Responder a (Nombre)</span>
              <input value={config.replyToName} onChange={(event) => updateField('replyToName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Responder a (Email)</span>
              <input type="email" value={config.replyToEmail} onChange={(event) => updateField('replyToEmail', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Usuario SMTP</span>
              <input value={config.username} onChange={(event) => updateField('username', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700 md:col-span-2 xl:col-span-3">
              <span className="mb-2 block font-medium">Contrasena SMTP</span>
              <input type="password" value={config.password} onChange={(event) => updateField('password', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Email de prueba</span>
              <input type="email" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} placeholder="usuario@dominio.com" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <button type="button" onClick={() => void submit('save')} disabled={submitting !== null} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {submitting === 'save' ? 'Guardando...' : 'Guardar configuracion'}
            </button>
            <button type="button" onClick={() => void submit('test')} disabled={submitting !== null} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-60">
              {submitting === 'test' ? 'Enviando...' : 'Enviar prueba'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
