'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';

import { exportRowsToExcel, exportRowsToPdf, type ExportBrandingOverride } from '@/components/ui/export-utils';
import { BalanceAuxRow, BalanceRow } from '@/types/finanzas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function text(value: unknown) {
  return String(value ?? '');
}

function saldo(row: BalanceRow) {
  return num(row.SALDO || row.saldo);
}

function debit(row: BalanceRow) {
  return num(row.TOTAL_DEBITO || row.total_debito);
}

function credit(row: BalanceRow) {
  return num(row.TOTAL_CREDITO || row.total_credito);
}

function findSaldo(rows: BalanceRow[], pattern: RegExp) {
  for (const row of rows) {
    const name = text(row.Nombre || row.nombre).toUpperCase();
    if (pattern.test(name)) {
      return Math.abs(saldo(row));
    }
  }
  return 0;
}

function sumBy(rows: BalanceRow[], getter: (row: BalanceRow) => number) {
  return rows.reduce((acc, row) => acc + getter(row), 0);
}

function formatGs(value: number) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUs(value: number) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatByCurrency(value: number, moneda: string) {
  return moneda === 'extranjera' ? formatUs(value) : formatGs(value);
}

function fmtCell(value: number, kind: 'local' | 'extranjera', selected: string) {
  if (selected === 'local' && kind === 'extranjera') return '-';
  if (selected === 'extranjera' && kind === 'local') return '-';
  return kind === 'local' ? formatGs(value) : formatUs(value);
}

function summary(rows: BalanceRow[]) {
  const activos = findSaldo(rows, /^ACTIVO$/);
  const pasivos = findSaldo(rows, /^PASIVO$/);
  const patrimonio = findSaldo(rows, /PATRIMONIO/);
  const ingresos = findSaldo(rows, /^INGRESOS$/);
  const egresos = findSaldo(rows, /^EGRESOS$/);
  return {
    activos,
    pasivos,
    patrimonio,
    ingresos,
    egresos,
    resultado: ingresos - egresos,
  };
}

function monthName(month: string) {
  const names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const index = Math.max(1, Math.min(12, Number(month))) - 1;
  return names[index];
}

function auxRowName(row: BalanceAuxRow) {
  return text(row.Nombre || '-');
}

function auxRowValue(row: BalanceAuxRow, key: 'Debito' | 'Credito' | 'Saldo') {
  return num(row[key]);
}

function cardTitleClasses() {
  return 'px-4 py-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-900';
}

function buildExportData(params: {
  moneda: string;
  empresaLabel: string;
  periodo: string;
  desdeLabel: string;
  hastaLabel: string;
  localRows: BalanceRow[];
  foreignRows: BalanceRow[];
  clientes: BalanceAuxRow[];
  proveedores: BalanceAuxRow[];
  monthlyResults: Array<{ month: string; ingresos: number; egresos: number; resultado: number }>;
}) {
  const localSummary = summary(params.localRows);
  const foreignSummary = summary(params.foreignRows);
  const selectedRows = params.moneda === 'extranjera' ? params.foreignRows : params.localRows;
  const composicion = {
    activos: findSaldo(selectedRows, /^ACTIVO$/),
    pasivos: findSaldo(selectedRows, /^PASIVO$/),
    patrimonio: findSaldo(selectedRows, /PATRIMONIO/),
  };
  const totalLocalDeb = sumBy(params.localRows, debit);
  const totalLocalCre = sumBy(params.localRows, credit);
  const totalForeignDeb = sumBy(params.foreignRows, debit);
  const totalForeignCre = sumBy(params.foreignRows, credit);

  const headers = ['Seccion', 'Concepto', 'Valor 1', 'Valor 2', 'Valor 3'];
  const rows: Array<Array<unknown>> = [
    ['Informe', 'Empresa', params.empresaLabel || '-', '', ''],
    ['Informe', 'Periodo', params.periodo, '', ''],
    ['Informe', 'Desde', params.desdeLabel, '', ''],
    ['Informe', 'Hasta', params.hastaLabel, '', ''],
    [],
    ['Totalizacion general', 'Debitos ML', formatGs(totalLocalDeb), '', ''],
    ['Totalizacion general', 'Creditos ML', formatGs(totalLocalCre), '', ''],
    ['Totalizacion general', 'Saldo ML', formatGs(totalLocalDeb - totalLocalCre), '', ''],
    ['Totalizacion general', 'Debitos ME', formatUs(totalForeignDeb), '', ''],
    ['Totalizacion general', 'Creditos ME', formatUs(totalForeignCre), '', ''],
    ['Totalizacion general', 'Saldo ME', formatUs(totalForeignDeb - totalForeignCre), '', ''],
    [],
    ['Resumen ejecutivo', 'Total Activos', fmtCell(localSummary.activos, 'local', params.moneda), fmtCell(foreignSummary.activos, 'extranjera', params.moneda), ''],
    ['Resumen ejecutivo', 'Total Pasivos', fmtCell(localSummary.pasivos, 'local', params.moneda), fmtCell(foreignSummary.pasivos, 'extranjera', params.moneda), ''],
    ['Resumen ejecutivo', 'Patrimonio Neto', fmtCell(localSummary.patrimonio, 'local', params.moneda), fmtCell(foreignSummary.patrimonio, 'extranjera', params.moneda), ''],
    ['Resumen ejecutivo', 'Total Ingresos', fmtCell(localSummary.ingresos, 'local', params.moneda), fmtCell(foreignSummary.ingresos, 'extranjera', params.moneda), ''],
    ['Resumen ejecutivo', 'Total Egresos', fmtCell(localSummary.egresos, 'local', params.moneda), fmtCell(foreignSummary.egresos, 'extranjera', params.moneda), ''],
    ['Resumen ejecutivo', 'Resultado del Ejercicio', fmtCell(localSummary.resultado, 'local', params.moneda), fmtCell(foreignSummary.resultado, 'extranjera', params.moneda), ''],
    [],
    ['Composicion patrimonial', 'Activos', formatByCurrency(composicion.activos, params.moneda), '', ''],
    ['Composicion patrimonial', 'Pasivos', formatByCurrency(composicion.pasivos, params.moneda), '', ''],
    ['Composicion patrimonial', 'Patrimonio', formatByCurrency(composicion.patrimonio, params.moneda), '', ''],
    ['Composicion patrimonial', 'Total General', formatByCurrency(composicion.activos + composicion.pasivos + composicion.patrimonio, params.moneda), '', ''],
    [],
    ['Clientes', 'Cliente', 'Debito', 'Credito', 'Saldo'],
    ...(
      params.clientes.length
        ? params.clientes.map((row) => [
            'Clientes',
            auxRowName(row),
            formatByCurrency(auxRowValue(row, 'Debito'), params.moneda),
            formatByCurrency(auxRowValue(row, 'Credito'), params.moneda),
            formatByCurrency(auxRowValue(row, 'Saldo'), params.moneda),
          ])
        : [['Clientes', 'Sin datos', '', '', '']]
    ),
    [],
    ['Proveedores', 'Proveedor', 'Debito', 'Credito', 'Saldo'],
    ...(
      params.proveedores.length
        ? params.proveedores.map((row) => [
            'Proveedores',
            auxRowName(row),
            formatByCurrency(auxRowValue(row, 'Debito'), params.moneda),
            formatByCurrency(auxRowValue(row, 'Credito'), params.moneda),
            formatByCurrency(auxRowValue(row, 'Saldo'), params.moneda),
          ])
        : [['Proveedores', 'Sin datos', '', '', '']]
    ),
    [],
    ['Resultados por periodo', 'Periodo', 'Ingresos', 'Egresos', 'Resultado'],
    ...(
      params.monthlyResults.length
        ? params.monthlyResults.map((row) => [
            'Resultados por periodo',
            monthName(row.month),
            formatByCurrency(row.ingresos, params.moneda),
            formatByCurrency(row.egresos, params.moneda),
            formatByCurrency(row.resultado, params.moneda),
          ])
        : [['Resultados por periodo', 'Sin datos', '', '', '']]
    ),
  ];

  return { headers, rows };
}

export function BalanceIntegralPanel({
  moneda,
  empresaLabel,
  periodo,
  desdeLabel,
  hastaLabel,
  localRows,
  foreignRows,
  clientes,
  proveedores,
  monthlyResults,
  exportBranding,
}: {
  moneda: string;
  empresaLabel: string;
  periodo: string;
  desdeLabel: string;
  hastaLabel: string;
  localRows: BalanceRow[];
  foreignRows: BalanceRow[];
  clientes: BalanceAuxRow[];
  proveedores: BalanceAuxRow[];
  monthlyResults: Array<{ month: string; ingresos: number; egresos: number; resultado: number }>;
  exportBranding?: ExportBrandingOverride;
}) {
  const localSummary = summary(localRows);
  const foreignSummary = summary(foreignRows);
  const selectedRows = moneda === 'extranjera' ? foreignRows : localRows;
  const composicion = {
    activos: findSaldo(selectedRows, /^ACTIVO$/),
    pasivos: findSaldo(selectedRows, /^PASIVO$/),
    patrimonio: findSaldo(selectedRows, /PATRIMONIO/),
  };
  const totalComposicion = composicion.activos + composicion.pasivos + composicion.patrimonio;
  const totalLocalDeb = sumBy(localRows, debit);
  const totalLocalCre = sumBy(localRows, credit);
  const totalForeignDeb = sumBy(foreignRows, debit);
  const totalForeignCre = sumBy(foreignRows, credit);
  const exportData = buildExportData({
    moneda,
    empresaLabel,
    periodo,
    desdeLabel,
    hastaLabel,
    localRows,
    foreignRows,
    clientes,
    proveedores,
    monthlyResults,
  });

  function exportExcel() {
    exportRowsToExcel({
      title: 'Balance integral',
      subtitle: `${empresaLabel || '-'} · Periodo ${periodo} · ${desdeLabel} a ${hastaLabel}`,
      filename: 'balance-integral',
      headers: exportData.headers,
      rows: exportData.rows,
      branding: exportBranding,
    });
  }

  function exportPdf() {
    exportRowsToPdf({
      title: 'Balance integral',
      subtitle: `${empresaLabel || '-'} · Periodo ${periodo} · ${desdeLabel} a ${hastaLabel}`,
      headers: exportData.headers,
      rows: exportData.rows,
      branding: exportBranding,
    });
  }

  return (
    <section id="balance-integral" className="scroll-mt-28 space-y-4">
      <div className="card flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Balance integral</h2>
          <p className="mt-1 text-sm text-slate-500">Resumen ejecutivo, auxiliares y resultados por periodo tomando como base la vista historica.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>
          <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
            <FileDown className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card px-5 py-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-900">Informe</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <div><span className="font-semibold text-slate-900">Empresa:</span> {empresaLabel || '-'}</div>
            <div><span className="font-semibold text-slate-900">Periodo:</span> {periodo}</div>
            <div><span className="font-semibold text-slate-900">Desde:</span> {desdeLabel}</div>
            <div><span className="font-semibold text-slate-900">Hasta:</span> {hastaLabel}</div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className={cardTitleClasses()}>Totalizacion general</div>
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Debitos ML</td><td className="px-4 py-2 text-right font-semibold">{formatGs(totalLocalDeb)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Creditos ML</td><td className="px-4 py-2 text-right font-semibold">{formatGs(totalLocalCre)}</td></tr>
              <tr className="border-t border-slate-100 bg-slate-50"><td className="px-4 py-2 font-semibold">Saldo ML</td><td className="px-4 py-2 text-right font-bold">{formatGs(totalLocalDeb - totalLocalCre)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Debitos ME</td><td className="px-4 py-2 text-right font-semibold">{formatUs(totalForeignDeb)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Creditos ME</td><td className="px-4 py-2 text-right font-semibold">{formatUs(totalForeignCre)}</td></tr>
              <tr className="border-t border-slate-100 bg-slate-50"><td className="px-4 py-2 font-semibold">Saldo ME</td><td className="px-4 py-2 text-right font-bold">{formatUs(totalForeignDeb - totalForeignCre)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card overflow-hidden">
          <div className={cardTitleClasses()}>Resumen ejecutivo</div>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-2 text-left">Concepto</th>
                <th className="px-4 py-2 text-right">Local</th>
                <th className="px-4 py-2 text-right">Extranjera</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Total Activos</td><td className="px-4 py-2 text-right">{fmtCell(localSummary.activos, 'local', moneda)}</td><td className="px-4 py-2 text-right">{fmtCell(foreignSummary.activos, 'extranjera', moneda)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Total Pasivos</td><td className="px-4 py-2 text-right">{fmtCell(localSummary.pasivos, 'local', moneda)}</td><td className="px-4 py-2 text-right">{fmtCell(foreignSummary.pasivos, 'extranjera', moneda)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Patrimonio Neto</td><td className="px-4 py-2 text-right">{fmtCell(localSummary.patrimonio, 'local', moneda)}</td><td className="px-4 py-2 text-right">{fmtCell(foreignSummary.patrimonio, 'extranjera', moneda)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Total Ingresos</td><td className="px-4 py-2 text-right">{fmtCell(localSummary.ingresos, 'local', moneda)}</td><td className="px-4 py-2 text-right">{fmtCell(foreignSummary.ingresos, 'extranjera', moneda)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Total Egresos</td><td className="px-4 py-2 text-right">{fmtCell(localSummary.egresos, 'local', moneda)}</td><td className="px-4 py-2 text-right">{fmtCell(foreignSummary.egresos, 'extranjera', moneda)}</td></tr>
              <tr className="border-t border-slate-100 bg-slate-50"><td className="px-4 py-2 font-semibold">Resultado del Ejercicio</td><td className="px-4 py-2 text-right font-bold">{fmtCell(localSummary.resultado, 'local', moneda)}</td><td className="px-4 py-2 text-right font-bold">{fmtCell(foreignSummary.resultado, 'extranjera', moneda)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className={cardTitleClasses()}>Composicion patrimonial</div>
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Activos</td><td className="px-4 py-2 text-right font-semibold">{formatByCurrency(composicion.activos, moneda)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Pasivos</td><td className="px-4 py-2 text-right font-semibold">{formatByCurrency(composicion.pasivos, moneda)}</td></tr>
              <tr className="border-t border-slate-100"><td className="px-4 py-2">Patrimonio</td><td className="px-4 py-2 text-right font-semibold">{formatByCurrency(composicion.patrimonio, moneda)}</td></tr>
              <tr className="border-t border-slate-100 bg-slate-50"><td className="px-4 py-2 font-semibold">Total General</td><td className="px-4 py-2 text-right font-bold">{formatByCurrency(totalComposicion, moneda)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card overflow-hidden">
          <div className={cardTitleClasses()}>Saldos de clientes por auxiliar</div>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-right">Debito</th>
                <th className="px-4 py-2 text-right">Credito</th>
                <th className="px-4 py-2 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length ? clientes.map((row, index) => (
                <tr key={`${row.CodPlanCta || 'cli'}-${row.CodPlanAux || index}`} className="border-t border-slate-100">
                  <td className="px-4 py-2">{auxRowName(row)}</td>
                  <td className="px-4 py-2 text-right">{formatByCurrency(auxRowValue(row, 'Debito'), moneda)}</td>
                  <td className="px-4 py-2 text-right">{formatByCurrency(auxRowValue(row, 'Credito'), moneda)}</td>
                  <td className="px-4 py-2 text-right font-semibold">{formatByCurrency(auxRowValue(row, 'Saldo'), moneda)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className={cardTitleClasses()}>Saldos de proveedores por auxiliar</div>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-right">Debito</th>
                <th className="px-4 py-2 text-right">Credito</th>
                <th className="px-4 py-2 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.length ? proveedores.map((row, index) => (
                <tr key={`${row.CodPlanCta || 'prov'}-${row.CodPlanAux || index}`} className="border-t border-slate-100">
                  <td className="px-4 py-2">{auxRowName(row)}</td>
                  <td className="px-4 py-2 text-right">{formatByCurrency(auxRowValue(row, 'Debito'), moneda)}</td>
                  <td className="px-4 py-2 text-right">{formatByCurrency(auxRowValue(row, 'Credito'), moneda)}</td>
                  <td className="px-4 py-2 text-right font-semibold">{formatByCurrency(auxRowValue(row, 'Saldo'), moneda)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className={cardTitleClasses()}>Resultados por periodo</div>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-2 text-left">Periodo</th>
              <th className="px-4 py-2 text-right">Ingresos</th>
              <th className="px-4 py-2 text-right">Egresos</th>
              <th className="px-4 py-2 text-right">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {monthlyResults.length ? monthlyResults.map((row) => (
              <tr key={row.month} className="border-t border-slate-100">
                <td className="px-4 py-2">{monthName(row.month)}</td>
                <td className="px-4 py-2 text-right">{formatByCurrency(row.ingresos, moneda)}</td>
                <td className="px-4 py-2 text-right">{formatByCurrency(row.egresos, moneda)}</td>
                <td className="px-4 py-2 text-right font-semibold">{formatByCurrency(row.resultado, moneda)}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Sin datos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
