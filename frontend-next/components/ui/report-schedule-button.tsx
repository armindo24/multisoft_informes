'use client';

import { CalendarClock, Mail, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';

type UserOption = {
  id: number;
  label: string;
  username: string;
  isCurrentUser: boolean;
};

type ReportScheduleFrequency = 'diaria' | 'semanal' | 'mensual';
type ReportScheduleRangeMode = 'fijo' | 'enero_mes_actual';

const WEEK_DAYS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
];

export function ReportScheduleButton({
  reportKey,
  reportTitle,
  reportModule,
  detailHint,
  reportParams,
  buttonClassName,
}: {
  reportKey: string;
  reportTitle: string;
  reportModule: string;
  detailHint?: string;
  reportParams?: Record<string, string>;
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
  const [mounted, setMounted] = useState(false);

  const currentUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const currentParams = useMemo(() => {
    const merged: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (value) merged[key] = value;
    }
    for (const [key, value] of Object.entries(reportParams || {})) {
      if (value) merged[key] = value;
    }
    return merged;
  }, [reportParams, searchParams]);

  const supportsDynamicMonthRange =
    reportKey === 'finanzas.balance_general'
    || reportKey === 'finanzas.balance_general_puc'
    || reportKey === 'stock.costo_articulo_full'
    || reportKey === 'cartera.unificada'
    || reportKey === 'plantillas.cartera_bloques';
  const dynamicRangeHint = reportKey === 'stock.costo_articulo_full'
    ? 'En Costo Articulo Full toma siempre el mes completo de ejecucion. Ejemplo: 2026-01-01 a 2026-01-31, luego 2026-02-01 a 2026-02-28.'
    : reportKey === 'cartera.unificada' || reportKey === 'plantillas.cartera_bloques'
      ? 'En Cartera toma siempre el mes completo de ejecucion. Ejemplo: 2026-01-01 a 2026-01-31, luego 2026-02-01 a 2026-02-28.'
      : 'Si hoy guardas un balance con 01 - 05, el mes siguiente se enviara como 01 - 06, y asi sucesivamente.';

  const [form, setForm] = useState({
    recipientUserIds: [] as number[],
    extraEmails: '',
    frequency: 'mensual' as ReportScheduleFrequency,
    rangeMode: 'fijo' as ReportScheduleRangeMode,
    timeOfDay: '08:00',
    dayOfWeek: '1',
    dayOfMonth: '1',
    emailSubject: `Entrega automatica: ${reportTitle}`,
    emailMessage: detailHint || `Se genero automaticamente el informe "${reportTitle}" para seguimiento ejecutivo.`,
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
      setMessage(payload.message || 'No se pudo cargar la lista de usuarios.');
      setLoadingUsers(false);
      return;
    }

    const available = payload.data.filter((item) => !item.isCurrentUser);
    setUsers(available);
    setLoadingUsers(false);
  }

  function toggleRecipient(id: number) {
    setForm((current) => ({
      ...current,
      recipientUserIds: current.recipientUserIds.includes(id)
        ? current.recipientUserIds.filter((item) => item !== id)
        : [...current.recipientUserIds, id],
    }));
  }

  async function submit() {
    setSaving(true);
    setMessage(null);
    setMessageTone('error');

    const scheduleParams = { ...currentParams };
    if (supportsDynamicMonthRange) {
      if (form.rangeMode === 'enero_mes_actual') {
        scheduleParams.schedule_range_mode = 'enero_mes_actual';
      } else {
        delete scheduleParams.schedule_range_mode;
      }
    }

    const response = await fetch('/api/auth/report-schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportKey,
        reportTitle,
        module: reportModule,
        targetUrl: currentUrl,
        reportParams: scheduleParams,
        frequency: form.frequency,
        timeOfDay: form.timeOfDay,
        dayOfWeek: form.frequency === 'semanal' ? Number(form.dayOfWeek || 1) : null,
        dayOfMonth: form.frequency === 'mensual' ? Number(form.dayOfMonth || 1) : null,
        recipientUserIds: form.recipientUserIds,
        extraEmails: form.extraEmails,
        emailSubject: form.emailSubject,
        emailMessage: form.emailMessage,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setMessage(payload.message || 'No se pudo guardar la programacion.');
      setSaving(false);
      return;
    }

    setMessageTone('success');
    setMessage('Programacion guardada correctamente.');
    setSaving(false);
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
        className={buttonClassName || 'inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100'}
      >
        <CalendarClock className="size-4" />
        Programar correo
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
              <div className="relative isolate flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">Entrega automatica</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Programar informe por correo</h3>
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

                <div className="relative flex-1 overflow-y-auto bg-white px-6 py-5">
                  <div className="space-y-4">
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

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 text-sm md:col-span-2">
                        <span className="font-medium text-slate-700">Destinatarios internos</span>
                        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
                          {loadingUsers ? (
                            <p className="text-slate-500">Cargando usuarios...</p>
                          ) : users.length ? (
                            users.map((item) => (
                              <label key={item.id} className="flex items-center gap-3 rounded-xl border border-white bg-white px-3 py-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={form.recipientUserIds.includes(item.id)}
                                  onChange={() => toggleRecipient(item.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-violet-500 focus:ring-violet-400"
                                />
                                <span>{item.label}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-slate-500">No hay usuarios disponibles.</p>
                          )}
                        </div>
                      </div>

                      <label className="space-y-2 text-sm md:col-span-2">
                        <span className="font-medium text-slate-700">Correos externos adicionales</span>
                        <input
                          value={form.extraEmails}
                          onChange={(event) => setForm((current) => ({ ...current, extraEmails: event.target.value }))}
                          placeholder="gerencia@cliente.com, finanzas@cliente.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                        />
                      </label>

                      <label className="space-y-2 text-sm">
                        <span className="font-medium text-slate-700">Frecuencia</span>
                        <select
                          value={form.frequency}
                          onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value as ReportScheduleFrequency }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                        >
                          <option value="diaria">Diaria</option>
                          <option value="semanal">Semanal</option>
                          <option value="mensual">Mensual</option>
                        </select>
                      </label>

                      <label className="space-y-2 text-sm">
                        <span className="font-medium text-slate-700">Hora</span>
                        <input
                          type="time"
                          value={form.timeOfDay}
                          onChange={(event) => setForm((current) => ({ ...current, timeOfDay: event.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                        />
                      </label>

                      {supportsDynamicMonthRange ? (
                        <label className="space-y-2 text-sm md:col-span-2">
                          <span className="font-medium text-slate-700">Rango mensual</span>
                          <select
                            value={form.rangeMode}
                            onChange={(event) => setForm((current) => ({ ...current, rangeMode: event.target.value as ReportScheduleRangeMode }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                          >
                            <option value="fijo">Fijo, mantener exactamente los meses guardados</option>
                            <option value="enero_mes_actual">
                              {reportKey === 'stock.costo_articulo_full' || reportKey === 'cartera.unificada' || reportKey === 'plantillas.cartera_bloques'
                                ? 'Dinamico, mes completo de ejecucion'
                                : 'Dinamico, desde el mes inicial hasta el mes de ejecucion'}
                            </option>
                          </select>
                          <p className="text-xs leading-5 text-slate-500">
                            {dynamicRangeHint}
                          </p>
                        </label>
                      ) : null}

                      {form.frequency === 'semanal' ? (
                        <label className="space-y-2 text-sm">
                          <span className="font-medium text-slate-700">Dia semanal</span>
                          <select
                            value={form.dayOfWeek}
                            onChange={(event) => setForm((current) => ({ ...current, dayOfWeek: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                          >
                            {WEEK_DAYS.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}

                      {form.frequency === 'mensual' ? (
                        <label className="space-y-2 text-sm">
                          <span className="font-medium text-slate-700">Dia del mes</span>
                          <input
                            type="number"
                            min={1}
                            max={31}
                            value={form.dayOfMonth}
                            onChange={(event) => setForm((current) => ({ ...current, dayOfMonth: event.target.value }))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                          />
                        </label>
                      ) : null}

                      <label className="space-y-2 text-sm md:col-span-2">
                        <span className="font-medium text-slate-700">Asunto del correo</span>
                        <input
                          value={form.emailSubject}
                          onChange={(event) => setForm((current) => ({ ...current, emailSubject: event.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                        />
                      </label>

                      <label className="space-y-2 text-sm md:col-span-2">
                        <span className="font-medium text-slate-700">Mensaje base</span>
                        <textarea
                          rows={4}
                          value={form.emailMessage}
                          onChange={(event) => setForm((current) => ({ ...current, emailMessage: event.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400"
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

                      <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900 md:col-span-2">
                        <div className="inline-flex items-center gap-2 font-semibold">
                          <Mail className="h-4 w-4" />
                          Esta programacion enviara el correo con enlace directo mas los adjuntos Excel y PDF del informe.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
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
                    <CalendarClock className="h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar programacion'}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
