'use client';

import { BellRing, Mail, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type UserOption = {
  id: number;
  label: string;
  username: string;
  isCurrentUser: boolean;
};

export function ReportNoticeButton({
  reportTitle,
  detailHint,
  buttonClassName,
}: {
  reportTitle: string;
  detailHint?: string;
  buttonClassName?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');
  const [users, setUsers] = useState<UserOption[]>([]);

  const currentUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const [form, setForm] = useState({
    targetUserId: '',
    title: `Aviso sobre ${reportTitle}`,
    message: detailHint || `Favor revisar el informe "${reportTitle}".`,
    sendEmail: false,
  });

  async function openModal() {
    setOpen(true);
    setMessage(null);
    setMessageTone('error');
    if (users.length) return;

    setLoadingUsers(true);
    const response = await fetch('/api/auth/tasks/users', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: UserOption[];
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo cargar la lista de usuarios.');
      setLoadingUsers(false);
      return;
    }

    const available = payload.data.filter((item) => !item.isCurrentUser);
    setUsers(available);
    setForm((current) => ({
      ...current,
      targetUserId: current.targetUserId || String(available[0]?.id || ''),
    }));
    setLoadingUsers(false);
  }

  async function submit() {
    setSaving(true);
    setMessage(null);
    setMessageTone('error');

    const response = await fetch('/api/auth/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: Number(form.targetUserId || 0),
        title: form.title,
        message: form.message,
        href: currentUrl,
        sendEmail: form.sendEmail,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessageTone('error');
      setMessage(payload.message || 'No se pudo enviar el aviso.');
      setSaving(false);
      return;
    }

    setMessageTone('success');
    setMessage(payload.message || 'Aviso enviado correctamente.');
    setSaving(false);
    setForm((current) => ({
      ...current,
      targetUserId: String(users[0]?.id || ''),
      title: `Aviso sobre ${reportTitle}`,
      message: detailHint || `Favor revisar el informe "${reportTitle}".`,
      sendEmail: false,
    }));
    setTimeout(() => {
      setOpen(false);
      setMessage(null);
      setMessageTone('error');
    }, 900);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void openModal()}
        className={buttonClassName || 'inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100'}
      >
        <BellRing className="size-4" />
        Avisar usuario
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Aviso directo</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Avisar usuario desde informe</h3>
                <p className="mt-2 text-sm text-slate-500">{reportTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
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

              <div className="grid gap-4">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Destinatario</span>
                  <select
                    value={form.targetUserId}
                    onChange={(event) => setForm((current) => ({ ...current, targetUserId: event.target.value }))}
                    disabled={loadingUsers}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 disabled:opacity-60"
                  >
                    <option value="">{loadingUsers ? 'Cargando usuarios...' : 'Seleccionar usuario'}</option>
                    {users.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Titulo</span>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Mensaje</span>
                  <textarea
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Enlace del informe</span>
                  <input
                    value={currentUrl}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.sendEmail}
                    onChange={(event) => setForm((current) => ({ ...current, sendEmail: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-700" />
                    Enviar tambien por correo si el destinatario tiene email
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || loadingUsers}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
              >
                <BellRing className="h-4 w-4" />
                {saving ? 'Enviando...' : 'Enviar aviso'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
