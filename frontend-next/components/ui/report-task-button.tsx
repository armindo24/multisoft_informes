'use client';

import { ClipboardPlus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type UserOption = {
  id: number;
  label: string;
  username: string;
  isCurrentUser: boolean;
};

function inferModule(pathname: string) {
  if (pathname.startsWith('/finanzas')) return 'Finanzas';
  if (pathname.startsWith('/ventas')) return 'Ventas';
  if (pathname.startsWith('/compras')) return 'Compras';
  if (pathname.startsWith('/stock')) return 'Stock';
  if (pathname.startsWith('/migraciones')) return 'Migraciones';
  return 'General';
}

export function ReportTaskButton({
  reportTitle,
  taskModule,
  detailHint,
  buttonClassName,
}: {
  reportTitle: string;
  taskModule?: string;
  detailHint?: string;
  buttonClassName?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const moduleName = taskModule || inferModule(pathname);

  const currentUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const [form, setForm] = useState({
    assignedTo: '',
    title: `Revisar ${reportTitle}`,
    description: detailHint || `Dar seguimiento al informe "${reportTitle}".`,
    priority: 'media',
    dueDate: '',
  });

  async function openModal() {
    setOpen(true);
    setMessage(null);
    if (users.length) return;

    setLoadingUsers(true);
    const response = await fetch('/api/auth/tasks/users', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: UserOption[];
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage(payload.message || 'No se pudo cargar la lista de usuarios.');
      setLoadingUsers(false);
      return;
    }

    const available = payload.data.filter((item) => !item.isCurrentUser);
    setUsers(available);
    setForm((current) => ({
      ...current,
      assignedTo: current.assignedTo || String(available[0]?.id || ''),
    }));
    setLoadingUsers(false);
  }

  async function submit() {
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/auth/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedTo: Number(form.assignedTo || 0),
        title: form.title,
        description: form.description,
        priority: form.priority,
        module: moduleName,
        targetUrl: currentUrl,
        dueDate: form.dueDate || null,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessage(payload.message || 'No se pudo asignar la tarea.');
      setSaving(false);
      return;
    }

    setOpen(false);
    setSaving(false);
    setForm((current) => ({
      ...current,
      assignedTo: String(users[0]?.id || ''),
      title: `Revisar ${reportTitle}`,
      description: detailHint || `Dar seguimiento al informe "${reportTitle}".`,
      dueDate: '',
    }));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void openModal()}
        className={buttonClassName || 'inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100'}
      >
        <ClipboardPlus className="size-4" />
        Asignar tarea
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Seguimiento interno</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Asignar tarea desde informe</h3>
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
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Asignar a</span>
                  <select
                    value={form.assignedTo}
                    onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))}
                    disabled={loadingUsers}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 disabled:opacity-60"
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
                  <span className="font-medium text-slate-700">Prioridad</span>
                  <select
                    value={form.priority}
                    onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-medium text-slate-700">Titulo</span>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Modulo</span>
                  <input
                    value={moduleName}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none"
                  />
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
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-medium text-slate-700">Detalle</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-medium text-slate-700">Enlace del informe</span>
                  <input
                    value={currentUrl}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none"
                  />
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
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <ClipboardPlus className="h-4 w-4" />
                {saving ? 'Asignando...' : 'Crear tarea'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
