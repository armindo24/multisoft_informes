'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { ReportNoticeButton } from '@/components/ui/report-notice-button';
import { ReportTaskButton } from '@/components/ui/report-task-button';
import { EmptyState } from '@/components/ui/empty-state';

const palette = ['#155eef', '#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#06b6d4', '#2563eb'];

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatAmount(value: number, agrupacion: string, moneda: string) {
  if (agrupacion === 'articulos') {
    return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(value);
  }
  const maximumFractionDigits = moneda === 'US' ? 2 : 0;
  return new Intl.NumberFormat('es-PY', { maximumFractionDigits }).format(value);
}

function groupTitle(agrupacion: string) {
  if (agrupacion === 'articulos') return 'articulos';
  if (agrupacion === 'vendedores') return 'vendedores';
  return 'clientes';
}

export function SalesStats({
  rows,
  agrupacion,
  moneda,
  exportBranding,
}: {
  rows: Array<Record<string, unknown>>;
  agrupacion: string;
  moneda: string;
  exportBranding?: ExportBrandingOverride;
}) {
  const groupedMap = new Map<string, { label: string; total: number; venta: number; credito: number }>();
  const monthMap = new Map<string, { month: string; venta: number; credito: number }>();

  for (const row of rows) {
    const label = String(row.nombre || row.label || row.vend || 'Sin descripcion');
    const tipo = String(row.tipo || 'venta').toLowerCase();
    const total = num(row.total);
    const current = groupedMap.get(label) || { label, total: 0, venta: 0, credito: 0 };
    current.total += total;
    current.venta += tipo === 'credito' ? 0 : total;
    current.credito += tipo === 'credito' ? total : 0;
    groupedMap.set(label, current);

    const year = String(row.anho || '');
    const month = String(row.mes || '').padStart(2, '0');
    const bucket = `${year}-${month}`;
    const monthEntry = monthMap.get(bucket) || { month: bucket, venta: 0, credito: 0 };
    monthEntry.venta += tipo === 'credito' ? 0 : total;
    monthEntry.credito += tipo === 'credito' ? total : 0;
    monthMap.set(bucket, monthEntry);
  }

  const topRows = Array.from(groupedMap.values()).sort((a, b) => b.total - a.total).slice(0, 10);
  const trendRows = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  const total = topRows.reduce((acc, item) => acc + item.total, 0);
  const principal = topRows[0];

  function exportStatsExcel() {
    exportRowsToExcel({
      title: 'Estadisticas de ventas',
      subtitle: `Vista por ${groupTitle(agrupacion)}.`,
      filename: 'ventas-estadisticas',
      headers: ['Nombre', 'Monto', 'Ventas', 'Creditos', 'Participacion %'],
      rows: topRows.map((item) => {
        const pct = total > 0 ? (item.total * 100) / total : 0;
        return [
          item.label,
          formatAmount(item.total, agrupacion, moneda),
          formatAmount(item.venta, agrupacion, moneda),
          formatAmount(item.credito, agrupacion, moneda),
          `${pct.toFixed(1)}%`,
        ];
      }),
      branding: exportBranding,
    });
  }

  function exportStatsPdf() {
    exportRowsToPdf({
      title: 'Estadisticas de ventas',
      subtitle: `Vista por ${groupTitle(agrupacion)}.`,
      headers: ['Nombre', 'Monto', 'Ventas', 'Creditos', 'Participacion %'],
      rows: topRows.map((item) => {
        const pct = total > 0 ? (item.total * 100) / total : 0;
        return [
          item.label,
          formatAmount(item.total, agrupacion, moneda),
          formatAmount(item.venta, agrupacion, moneda),
          formatAmount(item.credito, agrupacion, moneda),
          `${pct.toFixed(1)}%`,
        ];
      }),
      branding: exportBranding,
    });
  }

  return (
    <section id="estadisticas-ventas" className="scroll-mt-28 card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-3">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Estadisticas de ventas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vista inspirada en el informe anterior, con ranking, participacion y evolucion mensual por {groupTitle(agrupacion)}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ReportNoticeButton
              reportTitle="Estadisticas de ventas"
              detailHint={`Vista por ${groupTitle(agrupacion)}.`}
            />
            <ReportTaskButton
              reportTitle="Estadisticas de ventas"
              taskModule="Ventas"
              detailHint={`Vista por ${groupTitle(agrupacion)}.`}
            />
            <button type="button" onClick={exportStatsExcel} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
              <FileSpreadsheet className="size-4" />
              Excel
            </button>
            <button type="button" onClick={exportStatsPdf} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-50">
              <FileDown className="size-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {!rows.length ? (
        <div className="px-4 py-5">
          <EmptyState title="Sin datos estadisticos" description="No hay datos estadisticos para este filtro." />
        </div>
      ) : (
        <div className="space-y-4 px-5 py-4">
          <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Total neto</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{formatAmount(total, agrupacion, moneda)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Cantidad analizada</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{topRows.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Principal</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{principal?.label || '-'}</p>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Top ranking</h3>
                <p className="mt-1 text-sm text-slate-500">Distribucion principal de {groupTitle(agrupacion)}.</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={70} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => formatAmount(num(value), agrupacion, moneda)} />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {topRows.map((entry, index) => (
                        <Cell key={`${entry.label}-${index}`} fill={palette[index % palette.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Participacion</h3>
                <p className="mt-1 text-sm text-slate-500">Peso relativo del top visible.</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topRows} dataKey="total" nameKey="label" innerRadius={72} outerRadius={110} paddingAngle={2}>
                      {topRows.map((entry, index) => (
                        <Cell key={`${entry.label}-pie-${index}`} fill={palette[index % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatAmount(num(value), agrupacion, moneda)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Evolucion mensual</h3>
                <p className="mt-1 text-sm text-slate-500">Comparacion entre ventas y notas de credito por mes.</p>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => formatAmount(num(value), agrupacion, moneda)} />
                    <Area type="monotone" dataKey="venta" stroke="#155eef" fill="#bfdbfe" strokeWidth={2} />
                    <Area type="monotone" dataKey="credito" stroke="#ef4444" fill="#fecaca" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Top detallado</h3>
                <p className="mt-1 text-sm text-slate-500">Resumen porcentual del ranking.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Nombre</th>
                      <th className="px-3 py-2 text-right font-semibold">Monto</th>
                      <th className="px-3 py-2 text-right font-semibold">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {topRows.map((item, index) => {
                      const pct = total > 0 ? (item.total * 100) / total : 0;
                      return (
                        <tr key={`${item.label}-row-${index}`} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2 text-slate-700">{item.label}</td>
                          <td className="px-3 py-2 text-right text-slate-700">{formatAmount(item.total, agrupacion, moneda)}</td>
                          <td className="px-3 py-2 text-right text-slate-700">{pct.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
