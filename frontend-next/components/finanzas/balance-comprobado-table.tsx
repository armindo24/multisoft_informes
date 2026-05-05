'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import { exportRowsToExcel, exportRowsToPdf, type ExportBrandingOverride } from '@/components/ui/export-utils';
import { EmptyState } from '@/components/ui/empty-state';
import { BalanceRow } from '@/types/finanzas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function code(row: BalanceRow) {
  return String(row.CodPlanCta || row.codplancta || '');
}

function name(row: BalanceRow) {
  return String(row.Nombre || row.nombre || 'Sin descripcion');
}

function levelFromCode(value: string) {
  if (value.length <= 1) return 1;
  if (value.length <= 2) return 2;
  if (value.length <= 4) return 3;
  return 4;
}

function formatValue(value: number, moneda: string) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: moneda === 'extranjera' ? 2 : 0,
    maximumFractionDigits: moneda === 'extranjera' ? 2 : 0,
  }).format(value);
}

function rowTone(level: number) {
  if (level === 1) return 'bg-white font-bold text-slate-950';
  if (level === 2) return 'bg-slate-50 font-semibold text-slate-900';
  if (level === 3) return 'bg-white font-semibold text-slate-800';
  return 'bg-white text-slate-700';
}

function indent(level: number) {
  if (level <= 1) return 0;
  if (level === 2) return 12;
  if (level === 3) return 26;
  return 40;
}

export function BalanceComprobadoTable({
  rows,
  moneda,
  exportBranding,
}: {
  rows: BalanceRow[];
  moneda: string;
  exportBranding?: ExportBrandingOverride;
}) {
  const normalized = rows.map((row) => {
    const rowCode = code(row);
    const level = levelFromCode(rowCode);
    const previous = row as BalanceRow & { SALDO_ANTERIOR?: unknown; saldo_anterior?: unknown };
    return {
      code: rowCode,
      name: name(row),
      level,
      saldoAnterior: num(previous.SALDO_ANTERIOR || previous.saldo_anterior),
      debito: num(row.TOTAL_DEBITO || row.total_debito),
      credito: num(row.TOTAL_CREDITO || row.total_credito),
      saldo: num(row.SALDO || row.saldo),
    };
  });

  const totals = normalized.reduce((acc, row) => ({
    saldoAnterior: acc.saldoAnterior + row.saldoAnterior,
    debito: acc.debito + row.debito,
    credito: acc.credito + row.credito,
    saldo: acc.saldo + row.saldo,
  }), { saldoAnterior: 0, debito: 0, credito: 0, saldo: 0 });

  function buildExportData() {
    return {
      headers: ['Codigo', 'Nombre de la cuenta', 'Saldo anterior', 'Debito del mes', 'Credito del mes', 'Saldo actual'],
      rows: normalized.map((row) => [
        row.code,
        row.name,
        formatValue(row.saldoAnterior, moneda),
        formatValue(row.debito, moneda),
        formatValue(row.credito, moneda),
        formatValue(row.saldo, moneda),
      ]),
    };
  }

  function exportExcel() {
    const data = buildExportData();
    exportRowsToExcel({
      title: 'Balance general comprobado',
      subtitle: 'Compara saldo anterior, debito del mes, credito del mes y saldo actual como en el informe historico.',
      filename: 'balance-general-comprobado',
      headers: data.headers,
      rows: data.rows,
      branding: exportBranding,
    });
  }

  function exportPdf() {
    const data = buildExportData();
    exportRowsToPdf({
      title: 'Balance general comprobado',
      subtitle: 'Compara saldo anterior, debito del mes, credito del mes y saldo actual como en el informe historico.',
      headers: data.headers,
      rows: data.rows,
      branding: exportBranding,
    });
  }

  return (
    <section id="balance-general-comprobado" className="card overflow-hidden scroll-mt-28">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Balance general comprobado</h2>
            <p className="mt-1 text-sm text-slate-500">Compara saldo anterior, debito del mes, credito del mes y saldo actual como en el informe historico.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={exportExcel} disabled={!normalized.length} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
              <FileSpreadsheet className="size-4" /> Excel
            </button>
            <button type="button" onClick={exportPdf} disabled={!normalized.length} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-50">
              <FileDown className="size-4" /> PDF
            </button>
          </div>
        </div>
      </div>

      {normalized.length === 0 ? (
        <div className="px-4 py-5">
          <EmptyState title="Sin datos de balance comprobado" description="No hay datos disponibles para este balance comprobado." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr className="border-b border-slate-200">
                <th className="px-3 py-3 text-left">Codigo</th>
                <th className="px-3 py-3 text-left">Nombre de la cuenta</th>
                <th className="px-3 py-3 text-right">Saldo anterior</th>
                <th className="px-3 py-3 text-right">Debito del mes</th>
                <th className="px-3 py-3 text-right">Credito del mes</th>
                <th className="px-3 py-3 text-right">Saldo actual</th>
              </tr>
            </thead>
            <tbody>
              {normalized.map((row) => (
                <tr key={`${row.code}-${row.name}`} className={`border-b border-slate-100 ${rowTone(row.level)}`}>
                  <td className="px-3 py-2">{row.code}</td>
                  <td className="px-3 py-2">
                    <div style={{ paddingLeft: `${indent(row.level)}px` }}>{row.name}</div>
                  </td>
                  <td className="px-3 py-2 text-right">{formatValue(row.saldoAnterior, moneda)}</td>
                  <td className="px-3 py-2 text-right">{formatValue(row.debito, moneda)}</td>
                  <td className="px-3 py-2 text-right">{formatValue(row.credito, moneda)}</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatValue(row.saldo, moneda)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="px-3 py-3" />
                <td className="px-3 py-3">TOTALES</td>
                <td className="px-3 py-3 text-right">{formatValue(totals.saldoAnterior, moneda)}</td>
                <td className="px-3 py-3 text-right">{formatValue(totals.debito, moneda)}</td>
                <td className="px-3 py-3 text-right">{formatValue(totals.credito, moneda)}</td>
                <td className="px-3 py-3 text-right">{formatValue(totals.saldo, moneda)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}
