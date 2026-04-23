'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import { useMemo } from 'react';
import { downloadBlob, exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';
import type { ExportMetaItem } from '@/components/ui/export-utils';
import { BalanceRow } from '@/types/finanzas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function getCode(row: BalanceRow) {
  return String(row.CodPlanCta || row.codplancta || '');
}

function getName(row: BalanceRow) {
  return String(row.Nombre || row.nombre || 'Sin descripcion');
}

function getLevel(row: BalanceRow) {
  return Number(row.Nivel || row.nivel || 0);
}

function formatCurrency(value: number, decimals = 0) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function getRowTone(level: number) {
  if (level <= 1) return 'bg-slate-100 font-extrabold text-slate-950';
  if (level === 2) return 'bg-slate-50 font-bold text-slate-900';
  if (level === 3) return 'bg-white font-semibold text-slate-900';
  return 'bg-white text-slate-700';
}

function getIndent(level: number) {
  if (level <= 1) return 0;
  if (level === 2) return 10;
  if (level === 3) return 22;
  if (level === 4) return 34;
  return 46;
}

export function BalanceTable({
  rows,
  result = 0,
  resultME = 0,
  moneda = 'local',
  title = 'Balance general',
  description = 'Vista completa con jerarquia de cuentas y saldos, mas cercana al informe historico.',
  pucExport,
  showPucMapping = false,
  exportMeta,
}: {
  rows: BalanceRow[];
  result?: number;
  resultME?: number;
  moneda?: string;
  title?: string;
  description?: string;
  pucExport?: {
    codigoEntidad: string;
    periodo: string;
    mesh: string;
    esCasaDeBolsa?: boolean;
    ruc?: string;
  };
  showPucMapping?: boolean;
  exportMeta?: ExportMetaItem[];
}) {
  const isBoth = moneda === 'ambas';

  const normalizedRows = useMemo(() => rows.map((row) => ({
    cuenta: getCode(row),
    descripcion: getName(row),
    cuentaPuc: String((row as BalanceRow & { codplanctauni?: string; CodPlanCtaUni?: string }).codplanctauni || (row as BalanceRow & { codplanctauni?: string; CodPlanCtaUni?: string }).CodPlanCtaUni || ''),
    descripcionPuc: String((row as BalanceRow & { nombreuni?: string; NombreUni?: string }).nombreuni || (row as BalanceRow & { nombreuni?: string; NombreUni?: string }).NombreUni || ''),
    nivel: getLevel(row),
    debito: num(row.TOTAL_DEBITO || row.total_debito),
    credito: num(row.TOTAL_CREDITO || row.total_credito),
    saldo: num(row.SALDO || row.saldo),
    guaranies: num(row.SALDO_LOCAL || row.saldo_local || row.SALDO || row.saldo),
    dolares: num(row.SALDO_ME || row.saldo_me),
  })), [rows]);

  const resultLabelLocal = result >= 0 ? 'Utilidad' : 'Perdida';
  const resultLabelME = resultME >= 0 ? 'Utilidad' : 'Perdida';
  const absoluteResult = Math.abs(result);
  const absoluteResultME = Math.abs(resultME);

  function buildExportData() {
    const headers = isBoth
      ? (showPucMapping
        ? ['Cuenta', 'Descripcion', 'Cuenta PUC', 'Descripcion PUC', 'Guaranies', 'Dolares']
        : ['Cuenta', 'Descripcion', 'Guaranies', 'Dolares'])
      : (showPucMapping
        ? ['Cuenta', 'Descripcion', 'Cuenta PUC', 'Descripcion PUC', 'Debito', 'Credito', 'Saldo']
        : ['Cuenta', 'Descripcion', 'Debito', 'Credito', 'Saldo']);
    const rows = normalizedRows.map((row) =>
      isBoth
        ? (showPucMapping
          ? [row.cuenta, row.descripcion, row.cuentaPuc, row.descripcionPuc, formatCurrency(row.guaranies), formatCurrency(row.dolares, 2)]
          : [row.cuenta, row.descripcion, formatCurrency(row.guaranies), formatCurrency(row.dolares, 2)])
        : (showPucMapping
          ? [row.cuenta, row.descripcion, row.cuentaPuc, row.descripcionPuc, formatCurrency(row.debito), formatCurrency(row.credito), formatCurrency(row.saldo)]
          : [row.cuenta, row.descripcion, formatCurrency(row.debito), formatCurrency(row.credito), formatCurrency(row.saldo)]),
    );

    const extraRows = isBoth
      ? [
          headers.map((_, index) => (index === 0 ? `RESULTADO DEL EJERCICIO (+) ${resultLabelLocal} (-) Perdida : ${formatCurrency(absoluteResult)} GS.` : '')),
          headers.map((_, index) => (index === 0 ? `RESULTADO DEL EJERCICIO (+) ${resultLabelME} (-) Perdida : ${formatCurrency(absoluteResultME, 2)} U$S.` : '')),
        ]
      : [
          headers.map((_, index) => (index === 0 ? `RESULTADO DEL EJERCICIO (+) ${resultLabelLocal} (-) Perdida : ${formatCurrency(absoluteResult)} GS.` : '')),
        ];

    return { headers, rows: [...rows, ...extraRows] };
  }

  function exportExcel() {
    const data = buildExportData();
    exportRowsToExcel({
      title,
      subtitle: description,
      filename: 'balance-general',
      headers: data.headers,
      rows: data.rows,
      meta: exportMeta,
    });
  }

  function exportPdf() {
    const data = buildExportData();
    exportRowsToPdf({
      title,
      subtitle: description,
      headers: data.headers,
      rows: data.rows,
      meta: exportMeta,
    });
  }

  function exportPucTxt() {
    if (!pucExport || !rows.length) return;

    const codigoUnico = String(pucExport.codigoEntidad || '').trim();
    if (!codigoUnico) {
      window.alert('Debe ingresar el Codigo de Entidad.');
      return;
    }

    const esCasaDeBolsa = Boolean(pucExport.esCasaDeBolsa);
    const ruc = String(pucExport.ruc || '').trim();
    if (!esCasaDeBolsa && !ruc) {
      window.alert('Debe ingresar el RUC con digito verificador.');
      return;
    }

    const year = Number(pucExport.periodo);
    const month = Number(pucExport.mesh);
    const day = Number.isFinite(year) && Number.isFinite(month) && month >= 1 && month <= 12
      ? new Date(year, month, 0).getDate()
      : 1;
    const fechaCompacta = `${pucExport.periodo}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    const cabecera = esCasaDeBolsa
      ? `EEFF-${codigoUnico}-${fechaCompacta}`
      : `EEFF-${codigoUnico}-${ruc}-${fechaCompacta}`;
    const formulario = esCasaDeBolsa ? '001' : '002';
    const fila1 = esCasaDeBolsa ? 'EEFF001   ' : 'EEFF002   ';
    const contenido: string[] = [];

    if (esCasaDeBolsa) {
      contenido.push(`${fila1}${fechaCompacta}${codigoUnico}${String(rows.length).padStart(9, ' ')}`);
    } else {
      const baseCab = `${fila1}${fechaCompacta}${codigoUnico}${ruc}`;
      const espacios = Math.max(0, 61 - baseCab.length - String(rows.length).length);
      contenido.push(`${baseCab}${' '.repeat(espacios)}${String(rows.length)}`);
    }

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i] as BalanceRow & { simbolo?: string; tipo_cuenta?: string };
      const cuenta = String(row.CodPlanCta || row.codplancta || '').padEnd(18, ' ');
      const simbolo = String(row.simbolo || 'PYG').trim() || 'PYG';
      const tipoCuenta = String(row.tipo_cuenta || '').trim();
      const monto = Math.round(Math.abs(num(row.SALDO || row.saldo)));
      const montoRellenado = `${String(monto).padStart(18, '0')}00`;
      const nroLinea = String(i + 1).padStart(9, '0');
      contenido.push(`${formulario}${cuenta}${simbolo}0${tipoCuenta}${fechaCompacta}${montoRellenado}${nroLinea}`);
    }

    downloadBlob(`${cabecera}.txt`, contenido.join('\r\n'), 'text/plain;charset=utf-8;');
  }

  return (
    <div className="space-y-3">
      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              {pucExport ? (
                <button type="button" onClick={exportPucTxt} className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 transition hover:bg-sky-100">
                  <FileSpreadsheet className="size-4" /> Exportar Datos
                </button>
              ) : null}
              <button type="button" onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100">
                <FileSpreadsheet className="size-4" /> Excel
              </button>
              <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 transition hover:bg-rose-100">
                <FileDown className="size-4" /> PDF
              </button>
            </div>
          </div>
        </div>

        {normalizedRows.length === 0 ? (
          <div className="px-5 py-10 text-sm text-slate-500">No hay datos disponibles para este balance.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 text-left font-semibold">Cuenta</th>
                  <th className="px-3 py-3 text-left font-semibold">Descripcion</th>
                  {showPucMapping ? (
                    <>
                      <th className="px-3 py-3 text-left font-semibold">Cuenta PUC</th>
                      <th className="px-3 py-3 text-left font-semibold">Descripcion PUC</th>
                    </>
                  ) : null}
                  {isBoth ? (
                    <>
                      <th className="px-3 py-3 text-right font-semibold">Guaranies</th>
                      <th className="px-3 py-3 text-right font-semibold">Dolares</th>
                    </>
                  ) : (
                    <>
                      <th className="px-3 py-3 text-right font-semibold">Debito</th>
                      <th className="px-3 py-3 text-right font-semibold">Credito</th>
                      <th className="px-3 py-3 text-right font-semibold">Saldo</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {normalizedRows.map((row) => (
                  <tr key={`${row.cuenta}-${row.descripcion}`} className={`border-b border-slate-100 ${getRowTone(row.nivel)}`}>
                    <td className="px-3 py-2 align-top">{row.cuenta}</td>
                    <td className="px-3 py-2 align-top">
                      <div style={{ paddingLeft: `${getIndent(row.nivel)}px` }}>
                        {row.descripcion}
                      </div>
                    </td>
                    {showPucMapping ? (
                      <>
                        <td className="px-3 py-2 align-top">{row.cuentaPuc || '-'}</td>
                        <td className="px-3 py-2 align-top">{row.descripcionPuc || '-'}</td>
                      </>
                    ) : null}
                    {isBoth ? (
                      <>
                        <td className="px-3 py-2 text-right align-top">{formatCurrency(row.guaranies)}</td>
                        <td className="px-3 py-2 text-right align-top">{formatCurrency(row.dolares, 2)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 text-right align-top">{formatCurrency(row.debito)}</td>
                        <td className="px-3 py-2 text-right align-top">{formatCurrency(row.credito)}</td>
                        <td className="px-3 py-2 text-right align-top">{formatCurrency(row.saldo)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="space-y-2">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-5 py-3 text-center text-sm font-semibold text-cyan-950">
          RESULTADO DEL EJERCICIO (+) Utilidad (-) Perdida : {formatCurrency(absoluteResult)} GS.
        </div>

        {isBoth ? (
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-center text-sm font-semibold text-sky-950">
            RESULTADO DEL EJERCICIO (+) Utilidad (-) Perdida : {formatCurrency(absoluteResultME, 2)} U$S.
          </div>
        ) : null}

        <div className="text-center text-xs text-slate-500">
          Local: {resultLabelLocal}
          {isBoth ? ` | Extranjera: ${resultLabelME}` : ''}
        </div>
      </div>
    </div>
  );
}
