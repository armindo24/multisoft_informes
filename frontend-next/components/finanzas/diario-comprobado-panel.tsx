'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';

import { exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';
import { DiarioRow } from '@/types/finanzas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function text(value: unknown) {
  return String(value ?? '');
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

function displayValue(moneda: string, local: number, foreign: number) {
  if (moneda === 'extranjera') return formatUs(foreign);
  return formatGs(local);
}

function displayHeader(moneda: string) {
  if (moneda === 'ambas') return ['Debe M.L.', 'Haber M.L.', 'Debe M.E.', 'Haber M.E.'];
  if (moneda === 'extranjera') return ['Debe', 'Haber'];
  return ['Debe', 'Haber'];
}

type Totals = {
  debito: number;
  credito: number;
  debitoMe: number;
  creditoMe: number;
};

function emptyTotals(): Totals {
  return { debito: 0, credito: 0, debitoMe: 0, creditoMe: 0 };
}

function addRowToTotals(totals: Totals, row: DiarioRow): Totals {
  return {
    debito: totals.debito + num(row.DEBITO || row.debito),
    credito: totals.credito + num(row.CREDITO || row.credito),
    debitoMe: totals.debitoMe + num(row.DEBITO_ME || row.debito_me),
    creditoMe: totals.creditoMe + num(row.CREDITO_ME || row.credito_me),
  };
}

function buildExportData(rows: DiarioRow[], moneda: string) {
  const grouped = new Map<string, { header: DiarioRow; rows: DiarioRow[]; totals: Totals }>();
  let totalGeneral = emptyTotals();

  for (const row of rows) {
    const key = text(row.NroTransac || row.nrotransac || '');
    const existing = grouped.get(key);
    if (existing) {
      existing.rows.push(row);
      existing.totals = addRowToTotals(existing.totals, row);
    } else {
      grouped.set(key, {
        header: row,
        rows: [row],
        totals: addRowToTotals(emptyTotals(), row),
      });
    }
    totalGeneral = addRowToTotals(totalGeneral, row);
  }

  const headers =
    moneda === 'ambas'
      ? ['Tipo', 'Nro. Comp.', 'Transac.', 'Fecha', 'Sec.', 'Cuenta', 'Nombre cuenta', 'Auxiliar', 'Nombre auxiliar', 'Concepto', 'Debe M.L.', 'Haber M.L.', 'Debe M.E.', 'Haber M.E.']
      : ['Tipo', 'Nro. Comp.', 'Transac.', 'Fecha', 'Sec.', 'Cuenta', 'Nombre cuenta', 'Auxiliar', 'Nombre auxiliar', 'Concepto', 'Debe', 'Haber'];

  const exportRows: Array<Array<unknown>> = [];

  if (moneda !== 'extranjera') {
    exportRows.push(['TOTAL GENERAL', 'M.L. (PYG)', formatGs(totalGeneral.debito), formatGs(totalGeneral.credito), formatGs(totalGeneral.debito - totalGeneral.credito)]);
  }
  if (moneda !== 'local') {
    exportRows.push(['TOTAL GENERAL', 'M.E. (USD)', formatUs(totalGeneral.debitoMe), formatUs(totalGeneral.creditoMe), formatUs(totalGeneral.debitoMe - totalGeneral.creditoMe)]);
  }
  if (exportRows.length) {
    exportRows.push([]);
  }

  for (const [key, groupData] of grouped.entries()) {
    const header = groupData.header;

    exportRows.push([
      'ASIENTO',
      text(header?.TIPOASIENTO || header?.TipoAsiento || header?.tipoasiento || '-'),
      text(header?.NroCompr || header?.nrocompr || '-'),
      key || '-',
      text(header?.Fecha || header?.fecha || '-'),
    ]);

    for (const row of groupData.rows) {
      const baseRow = [
        text(header?.TIPOASIENTO || header?.TipoAsiento || header?.tipoasiento || '-'),
        text(row.NroCompr || row.nrocompr || '-'),
        text(row.NroTransac || row.nrotransac || key),
        text(row.Fecha || row.fecha || '-'),
        text(row.Linea || row.linea || ''),
        text(row.CodPlanCta || row.codplancta || ''),
        text(row.NOMBRECUENTA || row.nombrecuenta || ''),
        text(row.CodPlanAux || row.codplanaux || ''),
        text(row.NOMBRECUENTAAUX || row.nombrecuentaaux || ''),
        text(row.Concepto || row.concepto || ''),
      ];

      if (moneda === 'ambas') {
        exportRows.push([
          ...baseRow,
          formatGs(num(row.DEBITO || row.debito)),
          formatGs(num(row.CREDITO || row.credito)),
          formatUs(num(row.DEBITO_ME || row.debito_me)),
          formatUs(num(row.CREDITO_ME || row.credito_me)),
        ]);
      } else {
        exportRows.push([
          ...baseRow,
          displayValue(moneda, num(row.DEBITO || row.debito), num(row.DEBITO_ME || row.debito_me)),
          displayValue(moneda, num(row.CREDITO || row.credito), num(row.CREDITO_ME || row.credito_me)),
        ]);
      }
    }

    if (moneda === 'ambas') {
      exportRows.push([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'TOTALES',
        formatGs(groupData.totals.debito),
        formatGs(groupData.totals.credito),
        formatUs(groupData.totals.debitoMe),
        formatUs(groupData.totals.creditoMe),
      ]);
    } else {
      exportRows.push([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'TOTALES',
        displayValue(moneda, groupData.totals.debito, groupData.totals.debitoMe),
        displayValue(moneda, groupData.totals.credito, groupData.totals.creditoMe),
      ]);
    }

    exportRows.push([]);
  }

  return { headers, rows: exportRows };
}

export function DiarioComprobadoPanel({
  rows,
  moneda,
}: {
  rows: DiarioRow[];
  moneda: string;
}) {
  const grouped = new Map<string, { header: DiarioRow; rows: DiarioRow[]; totals: Totals }>();
  let totalGeneral = emptyTotals();

  for (const row of rows) {
    const key = text(row.NroTransac || row.nrotransac || '');
    const existing = grouped.get(key);
    if (existing) {
      existing.rows.push(row);
      existing.totals = addRowToTotals(existing.totals, row);
    } else {
      grouped.set(key, {
        header: row,
        rows: [row],
        totals: addRowToTotals(emptyTotals(), row),
      });
    }
    totalGeneral = addRowToTotals(totalGeneral, row);
  }

  const ordered = Array.from(grouped.entries());
  const generalDifferenceLocal = totalGeneral.debito - totalGeneral.credito;
  const generalDifferenceForeign = totalGeneral.debitoMe - totalGeneral.creditoMe;
  const exportData = buildExportData(rows, moneda);

  function exportExcel() {
    exportRowsToExcel({
      title: 'Libro diario',
      subtitle: 'Asientos agrupados por transaccion.',
      filename: 'libro-diario',
      headers: exportData.headers,
      rows: exportData.rows,
    });
  }

  function exportPdf() {
    exportRowsToPdf({
      title: 'Libro diario',
      subtitle: 'Asientos agrupados por transaccion.',
      headers: exportData.headers,
      rows: exportData.rows,
    });
  }

  return (
    <section id="libro-diario" className="scroll-mt-28 space-y-4">
      <div className="card flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Libro diario</h2>
          <p className="mt-1 text-sm text-slate-500">Agrupa asientos por transaccion, con detalle de cuentas, auxiliares y totales como en el reporte anterior.</p>
        </div>
        {ordered.length ? (
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
        ) : null}
      </div>

      {ordered.length === 0 ? (
        <div className="card px-5 py-10 text-sm text-slate-500">No hay datos disponibles para este libro diario.</div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-semibold text-slate-900">Total general</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left">Moneda</th>
                    <th className="px-4 py-3 text-right">Debe</th>
                    <th className="px-4 py-3 text-right">Haber</th>
                    <th className="px-4 py-3 text-right">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {moneda !== 'extranjera' ? (
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold">M.L. (PYG)</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatGs(totalGeneral.debito)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatGs(totalGeneral.credito)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatGs(generalDifferenceLocal)}</td>
                    </tr>
                  ) : null}
                  {moneda !== 'local' ? (
                    <tr>
                      <td className="px-4 py-3 font-semibold">M.E. (USD)</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatUs(totalGeneral.debitoMe)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatUs(totalGeneral.creditoMe)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatUs(generalDifferenceForeign)}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {ordered.map(([key, groupData]) => {
            const group = groupData.rows;
            const header = groupData.header;
            const totals = groupData.totals;
            const amountHeaders = displayHeader(moneda);

            return (
              <div key={key} className="card overflow-hidden">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-4">
                    <div><span className="font-semibold text-slate-900">Tipo Cbte.:</span> {text(header?.TIPOASIENTO || header?.TipoAsiento || header?.tipoasiento || '-')}</div>
                    <div><span className="font-semibold text-slate-900">Nro. de Cbte.:</span> {text(header?.NroCompr || header?.nrocompr || '-')}</div>
                    <div><span className="font-semibold text-slate-900">Nro. de Transac.:</span> {key || '-'}</div>
                    <div><span className="font-semibold text-slate-900">Fecha:</span> {text(header?.Fecha || header?.fecha || '-')}</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-3 text-left">Sec.</th>
                        <th className="px-3 py-3 text-left">Cuenta</th>
                        <th className="px-3 py-3 text-left">Nombre</th>
                        <th className="px-3 py-3 text-left">Auxiliar</th>
                        <th className="px-3 py-3 text-left">Nombre</th>
                        <th className="px-3 py-3 text-left">Concepto</th>
                        <th className="px-3 py-3 text-right">{amountHeaders[0]}</th>
                        <th className="px-3 py-3 text-right">{amountHeaders[1]}</th>
                        {moneda === 'ambas' ? (
                          <>
                            <th className="px-3 py-3 text-right">{amountHeaders[2]}</th>
                            <th className="px-3 py-3 text-right">{amountHeaders[3]}</th>
                          </>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody>
                      {group.map((row, index) => (
                        <tr key={`${key}-${index}`} className="border-b border-slate-100">
                          <td className="px-3 py-2">{text(row.Linea || row.linea || '')}</td>
                          <td className="px-3 py-2">{text(row.CodPlanCta || row.codplancta || '')}</td>
                          <td className="px-3 py-2">{text(row.NOMBRECUENTA || row.nombrecuenta || '')}</td>
                          <td className="px-3 py-2">{text(row.CodPlanAux || row.codplanaux || '')}</td>
                          <td className="px-3 py-2">{text(row.NOMBRECUENTAAUX || row.nombrecuentaaux || '')}</td>
                          <td className="px-3 py-2">{text(row.Concepto || row.concepto || '')}</td>
                          <td className="px-3 py-2 text-right">{displayValue(moneda, num(row.DEBITO || row.debito), num(row.DEBITO_ME || row.debito_me))}</td>
                          <td className="px-3 py-2 text-right">{displayValue(moneda, num(row.CREDITO || row.credito), num(row.CREDITO_ME || row.credito_me))}</td>
                          {moneda === 'ambas' ? (
                            <>
                              <td className="px-3 py-2 text-right">{formatUs(num(row.DEBITO_ME || row.debito_me))}</td>
                              <td className="px-3 py-2 text-right">{formatUs(num(row.CREDITO_ME || row.credito_me))}</td>
                            </>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold text-slate-900">
                        <td colSpan={6} className="px-3 py-3 text-right">TOTALES</td>
                        <td className="px-3 py-3 text-right">{displayValue(moneda, totals.debito, totals.debitoMe)}</td>
                        <td className="px-3 py-3 text-right">{displayValue(moneda, totals.credito, totals.creditoMe)}</td>
                        {moneda === 'ambas' ? (
                          <>
                            <td className="px-3 py-3 text-right">{formatUs(totals.debitoMe)}</td>
                            <td className="px-3 py-3 text-right">{formatUs(totals.creditoMe)}</td>
                          </>
                        ) : null}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}

        </>
      )}
    </section>
  );
}
