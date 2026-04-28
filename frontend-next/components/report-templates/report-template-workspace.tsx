'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileStack, Loader2, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { ReportTemplateRecord } from '@/lib/admin-config';
import { CARTERA_TEMPLATE_BLOCKS } from '@/lib/report-template-presets';

type CompanyOption = {
  value: string;
  label: string;
};

type Props = {
  companies: CompanyOption[];
  templates: ReportTemplateRecord[];
  selectedTemplateId?: number | null;
};

function monthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentYear() {
  return String(new Date().getFullYear());
}

export function ReportTemplateWorkspace({ companies, templates, selectedTemplateId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<'success' | 'error'>('success');
  const [form, setForm] = useState({
    name: '',
    description: '',
    empresa: companies[0]?.value || '',
    sucursal: '',
    periodo: currentYear(),
    desde: monthStart(),
    hasta: today(),
    vencimiento: 'true',
    blocks: CARTERA_TEMPLATE_BLOCKS.map((block) => ({
      key: block.key,
      enabled: true,
      columns: block.columns.map((column) => column.key),
    })),
  });

  const enabledCount = useMemo(() => form.blocks.filter((block) => block.enabled).length, [form.blocks]);

  function toggleBlock(blockKey: string) {
    setForm((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.key === blockKey ? { ...block, enabled: !block.enabled } : block)),
    }));
  }

  function toggleColumn(blockKey: string, columnKey: string) {
    setForm((current) => ({
      ...current,
      blocks: current.blocks.map((block) => {
        if (block.key !== blockKey) return block;
        const exists = block.columns.includes(columnKey);
        return {
          ...block,
          columns: exists ? block.columns.filter((item) => item !== columnKey) : [...block.columns, columnKey],
        };
      }),
    }));
  }

  async function saveTemplate() {
    if (!form.name.trim()) {
      setTone('error');
      setMessage('El nombre de la plantilla es obligatorio.');
      return;
    }

    const blocks = form.blocks
      .filter((block) => block.enabled && block.columns.length > 0)
      .map((block) => ({ key: block.key, columns: block.columns }));

    if (!blocks.length) {
      setTone('error');
      setMessage('Selecciona al menos un bloque con una columna visible.');
      return;
    }

    setSaving(true);
    setMessage(null);
    const response = await fetch('/api/report-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        module: 'Informes personalizados',
        templateKey: 'cartera_bloques',
        config: {
          filters: {
            empresa: form.empresa,
            sucursal: form.sucursal,
            periodo: form.periodo,
            desde: form.desde,
            hasta: form.hasta,
            vencimiento: form.vencimiento,
          },
          blocks,
        },
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; data?: { id?: number } };
    if (!response.ok || !payload.ok || !payload.data?.id) {
      setSaving(false);
      setTone('error');
      setMessage(payload.message || 'No se pudo guardar la plantilla.');
      return;
    }

    setTone('success');
    setMessage('Plantilla guardada correctamente.');
    router.push(`/informes-personalizados?template=${payload.data.id}`);
    router.refresh();
  }

  async function deleteTemplate(id: number) {
    setDeletingId(id);
    const response = await fetch(`/api/report-templates/${id}`, { method: 'DELETE' });
    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !payload.ok) {
      setTone('error');
      setMessage(payload.message || 'No se pudo eliminar la plantilla.');
      setDeletingId(null);
      return;
    }

    setTone('success');
    setMessage('Plantilla eliminada.');
    if (selectedTemplateId === id) {
      router.push('/informes-personalizados');
    } else {
      router.refresh();
    }
    setDeletingId(null);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="card px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Nueva plantilla</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Constructor por bloques</h2>
            <p className="mt-1 text-sm text-slate-500">
              Primera etapa para armar informes configurables. Hoy trabaja con el modelo unificado de cartera.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {enabledCount} bloque(s)
          </span>
        </div>

        {message ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${tone === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>
            {message}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Nombre de la plantilla
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ejemplo: Cartera mensual gerencial"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Descripcion
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              placeholder="Resumen ejecutivo para seguimiento de cobrar vs pagar."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Empresa
            <select
              value={form.empresa}
              onChange={(event) => setForm((current) => ({ ...current, empresa: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            >
              {companies.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Sucursal
            <input
              value={form.sucursal}
              onChange={(event) => setForm((current) => ({ ...current, sucursal: event.target.value }))}
              placeholder="Opcional"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Periodo
            <input
              value={form.periodo}
              onChange={(event) => setForm((current) => ({ ...current, periodo: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Cobrar por vencimiento
            <select
              value={form.vencimiento}
              onChange={(event) => setForm((current) => ({ ...current, vencimiento: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            >
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Desde
            <input
              type="date"
              value={form.desde}
              onChange={(event) => setForm((current) => ({ ...current, desde: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Hasta
            <input
              type="date"
              value={form.hasta}
              onChange={(event) => setForm((current) => ({ ...current, hasta: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Bloques</p>
            <p className="mt-1 text-sm text-slate-500">Activa los bloques y define qué columnas visibles quieres guardar en la plantilla.</p>
          </div>

          {CARTERA_TEMPLATE_BLOCKS.map((block) => {
            const blockState = form.blocks.find((item) => item.key === block.key);
            const enabled = Boolean(blockState?.enabled);
            return (
              <div key={block.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleBlock(block.key)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{block.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{block.subtitle}</p>
                  </div>
                </label>

                <div className={`mt-4 grid gap-2 md:grid-cols-2 ${enabled ? '' : 'opacity-50'}`}>
                  {block.columns.map((column) => (
                    <label key={column.key} className="flex items-center gap-2 rounded-xl border border-white bg-white px-3 py-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(blockState?.columns.includes(column.key))}
                        disabled={!enabled}
                        onChange={() => toggleColumn(block.key, column.key)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                      />
                      <span>{column.header}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void saveTemplate()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Guardar plantilla
          </button>
        </div>
      </section>

      <section className="card px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Plantillas guardadas</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Biblioteca inicial</h2>
            <p className="mt-1 text-sm text-slate-500">Abre una plantilla para ver el informe armado con sus bloques y filtros.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {templates.length} total
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {templates.length ? templates.map((template) => (
            <article
              key={template.id}
              className={`rounded-2xl border px-4 py-4 ${selectedTemplateId === template.id ? 'border-cyan-200 bg-cyan-50' : 'border-slate-200 bg-white'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileStack className="size-4 text-cyan-700" />
                    <h3 className="truncate font-semibold text-slate-900">{template.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{template.description || 'Sin descripcion.'}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    {template.templateKey.replace(/_/g, ' ')} · {template.createdByName || template.createdByUsername}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void deleteTemplate(template.id)}
                  disabled={deletingId === template.id}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === template.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/informes-personalizados?template=${template.id}`}
                  className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Abrir plantilla
                </Link>
              </div>
            </article>
          )) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              Todavia no hay plantillas guardadas.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

