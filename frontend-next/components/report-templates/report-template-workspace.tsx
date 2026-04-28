'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, FilePenLine, FileStack, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { ReportTemplateRecord } from '@/lib/admin-config';
import {
  buildDefaultTemplateBlocks,
  getReportTemplateBlocks,
  getReportTemplatePreset,
  REPORT_TEMPLATE_PRESETS,
  type ReportTemplatePresetKey,
} from '@/lib/report-template-presets';

type CompanyOption = {
  value: string;
  label: string;
};

type Props = {
  companies: CompanyOption[];
  templates: ReportTemplateRecord[];
  selectedTemplate?: ReportTemplateRecord | null;
  selectedTemplateId?: number | null;
};

type TemplateFormState = {
  name: string;
  description: string;
  templateKey: ReportTemplatePresetKey;
  empresa: string;
  sucursal: string;
  periodo: string;
  desde: string;
  hasta: string;
  vencimiento: string;
  moneda: string;
  departamento: string;
  order: string;
  blocks: Array<{
    key: string;
    enabled: boolean;
    columns: string[];
  }>;
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

function buildDefaultForm(companies: CompanyOption[], templateKey: ReportTemplatePresetKey = 'cartera_bloques'): TemplateFormState {
  return {
    name: '',
    description: '',
    templateKey,
    empresa: companies[0]?.value || '',
    sucursal: '',
    periodo: currentYear(),
    desde: monthStart(),
    hasta: today(),
    vencimiento: 'true',
    moneda: 'GS',
    departamento: '',
    order: 'cod_cliente',
    blocks: buildDefaultTemplateBlocks(templateKey).map((block) => ({
      key: block.key,
      enabled: true,
      columns: block.columns,
    })),
  };
}

function buildFormFromTemplate(template: ReportTemplateRecord, companies: CompanyOption[]): TemplateFormState {
  const raw = (template.config || {}) as Record<string, unknown>;
  const filters = raw.filters && typeof raw.filters === 'object' && !Array.isArray(raw.filters)
    ? raw.filters as Record<string, unknown>
    : {};
  const templateKey = (String(template.templateKey || 'cartera_bloques').trim() || 'cartera_bloques') as ReportTemplatePresetKey;
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : [];

  const selectedBlocks = blocksRaw
    .map((item) => (item && typeof item === 'object' ? item as Record<string, unknown> : null))
    .filter(Boolean)
    .map((item) => ({
      key: String(item?.key || '').trim(),
      columns: Array.isArray(item?.columns) ? item.columns.map((column) => String(column || '').trim()).filter(Boolean) : [],
    }))
    .filter((item) => item.key);

  return {
    name: template.name,
    description: template.description,
    templateKey,
    empresa: String(filters.empresa || companies[0]?.value || '').trim(),
    sucursal: String(filters.sucursal || '').trim(),
    periodo: String(filters.periodo || currentYear()).trim(),
    desde: String(filters.desde || monthStart()).trim(),
    hasta: String(filters.hasta || today()).trim(),
    vencimiento: String(filters.vencimiento || 'true').trim() || 'true',
    moneda: String(filters.moneda || 'GS').trim() || 'GS',
    departamento: String(filters.departamento || '').trim(),
    order: String(filters.order || 'cod_cliente').trim() || 'cod_cliente',
    blocks: getReportTemplateBlocks(templateKey).map((block) => {
      const selected = selectedBlocks.find((item) => item.key === block.key);
      return {
        key: block.key,
        enabled: Boolean(selected),
        columns: selected?.columns.length ? selected.columns : block.columns.map((column) => column.key),
      };
    }),
  };
}

function describeTemplate(template: ReportTemplateRecord) {
  const raw = (template.config || {}) as Record<string, unknown>;
  const filters = raw.filters && typeof raw.filters === 'object' && !Array.isArray(raw.filters)
    ? raw.filters as Record<string, unknown>
    : {};
  const templateKey = String(template.templateKey || '').trim();
  const preset = getReportTemplatePreset(templateKey);
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : [];
  const blockKeys = blocksRaw
    .map((item) => (item && typeof item === 'object' ? String((item as Record<string, unknown>).key || '').trim() : ''))
    .filter(Boolean);

  return {
    empresa: String(filters.empresa || '').trim(),
    periodo: String(filters.periodo || '').trim(),
    presetLabel: preset?.label || template.templateKey,
    blockCount: blockKeys.length,
    blockLabels: blockKeys
      .map((key) => getReportTemplateBlocks(templateKey).find((block) => block.key === key)?.label || key)
      .slice(0, 2),
  };
}

export function ReportTemplateWorkspace({ companies, templates, selectedTemplate, selectedTemplateId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<'success' | 'error'>('success');
  const [form, setForm] = useState<TemplateFormState>(() => buildDefaultForm(companies));

  useEffect(() => {
    if (!selectedTemplate) return;
    setEditingTemplateId(selectedTemplate.id);
    setForm(buildFormFromTemplate(selectedTemplate, companies));
  }, [companies, selectedTemplate]);

  const currentPreset = useMemo(
    () => getReportTemplatePreset(form.templateKey) || REPORT_TEMPLATE_PRESETS[0],
    [form.templateKey],
  );

  const enabledCount = useMemo(() => form.blocks.filter((block) => block.enabled).length, [form.blocks]);

  function replaceBlocks(templateKey: ReportTemplatePresetKey) {
    setForm((current) => ({
      ...current,
      templateKey,
      blocks: buildDefaultTemplateBlocks(templateKey).map((block) => ({
        key: block.key,
        enabled: true,
        columns: block.columns,
      })),
    }));
  }

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
    const response = await fetch(editingTemplateId ? `/api/report-templates/${editingTemplateId}` : '/api/report-templates', {
      method: editingTemplateId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        module: 'Informes personalizados',
        templateKey: form.templateKey,
        config: {
          filters: {
            empresa: form.empresa,
            sucursal: form.sucursal,
            periodo: form.periodo,
            desde: form.desde,
            hasta: form.hasta,
            vencimiento: form.vencimiento,
            moneda: form.moneda,
            departamento: form.departamento,
            order: form.order,
          },
          blocks,
        },
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; data?: { id?: number } };
    if (!response.ok || !payload.ok || !payload.data?.id) {
      setSaving(false);
      setTone('error');
      setMessage(payload.message || `No se pudo ${editingTemplateId ? 'actualizar' : 'guardar'} la plantilla.`);
      return;
    }

    setSaving(false);
    setTone('success');
    setMessage(editingTemplateId ? 'Plantilla actualizada correctamente.' : 'Plantilla guardada correctamente.');
    setEditingTemplateId(payload.data.id || null);
    router.push(`/informes-personalizados?template=${payload.data.id}`);
    router.refresh();
  }

  function startEditTemplate(template: ReportTemplateRecord) {
    setEditingTemplateId(template.id);
    setMessage(null);
    setForm(buildFormFromTemplate(template, companies));
  }

  function duplicateTemplate(template: ReportTemplateRecord) {
    const next = buildFormFromTemplate(template, companies);
    setEditingTemplateId(null);
    setMessage('La plantilla se cargo como copia. Ajusta lo que necesites y guarda.');
    setTone('success');
    setForm({
      ...next,
      name: `${template.name} (Copia)`,
    });
    router.push('/informes-personalizados');
  }

  function resetForm() {
    setEditingTemplateId(null);
    setMessage(null);
    setForm(buildDefaultForm(companies));
    router.push('/informes-personalizados');
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">{editingTemplateId ? 'Edicion' : 'Nueva plantilla'}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Constructor por bloques</h2>
            <p className="mt-1 text-sm text-slate-500">
              Arma informes unificados por preset y guarda la combinacion de bloques, columnas y filtros para reutilizarla.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {enabledCount} bloque(s)
            </span>
            {editingTemplateId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <X className="size-3.5" />
                Cancelar
              </button>
            ) : null}
          </div>
        </div>

        {message ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${tone === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>
            {message}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Preset
            <select
              value={form.templateKey}
              onChange={(event) => replaceBlocks(event.target.value as ReportTemplatePresetKey)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            >
              {REPORT_TEMPLATE_PRESETS.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Preset activo</p>
            <p className="mt-2 font-semibold text-slate-900">{currentPreset.label}</p>
            <p className="mt-1 leading-6">{currentPreset.description}</p>
          </div>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Nombre de la plantilla
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ejemplo: Cierre comercial mensual"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Descripcion
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              placeholder="Resumen ejecutivo del informe personalizado."
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
              placeholder="Codigo de sucursal"
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

          {form.templateKey === 'cartera_bloques' ? (
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
          ) : null}

          {form.templateKey === 'ventas_compras_bloques' ? (
            <>
              <label className="text-sm font-medium text-slate-700">
                Moneda
                <input
                  value={form.moneda}
                  onChange={(event) => setForm((current) => ({ ...current, moneda: event.target.value }))}
                  placeholder="GS"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Departamento compras
                <input
                  value={form.departamento}
                  onChange={(event) => setForm((current) => ({ ...current, departamento: event.target.value }))}
                  placeholder="Ejemplo: 1"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Agrupar ventas por
                <select
                  value={form.order}
                  onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
                >
                  <option value="cod_cliente">Cliente</option>
                  <option value="cod_tp_comp">Comprobante</option>
                  <option value="cod_vendedor">Vendedor</option>
                </select>
              </label>
            </>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Bloques</p>
            <p className="mt-1 text-sm text-slate-500">Activa los bloques y define qué columnas visibles quieres guardar en la plantilla.</p>
          </div>

          {currentPreset.blocks.map((block) => {
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
            {editingTemplateId ? 'Actualizar plantilla' : 'Guardar plantilla'}
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
          {templates.length ? templates.map((template) => {
            const meta = describeTemplate(template);

            return (
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
                      {meta.presetLabel} · {template.createdByName || template.createdByUsername}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      {meta.empresa ? (
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-medium text-cyan-700">
                          Empresa {meta.empresa}
                        </span>
                      ) : null}
                      {meta.periodo ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                          Periodo {meta.periodo}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                        {meta.blockCount} bloque(s)
                      </span>
                      {meta.blockLabels.map((label) => (
                        <span key={label} className="rounded-full border border-white bg-white px-3 py-1">
                          {label}
                        </span>
                      ))}
                    </div>
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
                  <button
                    type="button"
                    onClick={() => startEditTemplate(template)}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
                  >
                    <FilePenLine className="size-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateTemplate(template)}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                  >
                    <Copy className="size-4" />
                    Duplicar
                  </button>
                  <Link
                    href={`/informes-personalizados?template=${template.id}`}
                    className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Abrir plantilla
                  </Link>
                </div>
              </article>
            );
          }) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              Todavia no hay plantillas guardadas.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
