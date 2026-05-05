'use client';

import { useState } from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';

import { downloadBlob } from '@/components/ui/export-utils';
import { EmptyState } from '@/components/ui/empty-state';

type Rg90Row = Record<string, unknown>;
type Rg90Summary = {
  grav5: number;
  grav10: number;
  iva5: number;
  iva10: number;
  exentas: number;
  total: number;
};

type Rg90PanelProps = {
  empresa: string;
  periodo: string;
  mes: string;
  sucursal: string;
  tipoInformacion: string;
  descargarRegistrosExportados: boolean;
  rows: Rg90Row[];
  debug?: Record<string, unknown> | null;
  summary?: {
    note_credit_total?: number;
    visible_total?: number;
    exento_total?: number;
  } | null;
  warning?: string | null;
};

function tipoInformacionLabel(value: string) {
  if (value === 'COMPRA') return 'Libro de compras';
  return 'Libro de ventas';
}

function monthLabel(value: string) {
  const labels: Record<string, string> = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre',
  };
  return labels[value] || value;
}

function toText(value: unknown) {
  return String(value ?? '').trim();
}

function toNumber(value: unknown) {
  const normalized = Number(value ?? 0);
  return Number.isFinite(normalized) ? normalized : 0;
}

function padLeft(value: unknown, size: number) {
  let text = String(value ?? '').replace(/\D/g, '');
  while (text.length < size) text = `0${text}`;
  return text.slice(-size);
}

function formatAmount(value: unknown) {
  return toNumber(value).toLocaleString('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatFactor(value: unknown) {
  return toNumber(value).toLocaleString('es-PY', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

function formatDate(value: unknown) {
  const text = toText(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return `${text.slice(8, 10)}/${text.slice(5, 7)}/${text.slice(0, 4)}`;
  }
  return text;
}

function formatDay(value: unknown) {
  const text = toText(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(8, 10);
  }
  return '';
}

function ventaTotal(row: Rg90Row) {
  return (
    ventaGrav5(row) +
    ventaGrav10(row) +
    ventaIva5(row) +
    ventaIva10(row) +
    ventaExenta(row)
  );
}

function isVentaTipo5(row: Rg90Row) {
  return toText(row.tipo_registro || row.tipo) === '5' || toText(row.tp_def).toUpperCase() === 'NP';
}

function ventaGrav5(row: Rg90Row) {
  const grav5 = toNumber(row.total_grav_5);
  const iva5 = toNumber(row.total_iva_5);
  if (toText(row.tipo_iva).toUpperCase() !== 'D' && grav5 >= iva5) return grav5 - iva5;
  return grav5;
}

function ventaGrav10(row: Rg90Row) {
  const grav10 = valueFromPrimaryOrFallback(row.total_grav_10, row.total_grav);
  const iva10 = valueFromPrimaryOrFallback(row.total_iva_10 ?? row.tot_iva_10, row.total_iva);
  if (toText(row.tipo_iva).toUpperCase() !== 'D' && grav10 >= iva10) return grav10 - iva10;
  return grav10;
}

function ventaIva5(row: Rg90Row) {
  return valueFromPrimaryOrFallback(row.total_iva_5, row.tot_iva_5);
}

function ventaIva10(row: Rg90Row) {
  return valueFromPrimaryOrFallback(row.total_iva_10 ?? row.tot_iva_10, row.total_iva);
}

function ventaExenta(row: Rg90Row) {
  return valueFromPrimaryOrFallback(row.total_exenta, row.to_exento);
}

function ventaCondicion(row: Rg90Row) {
  const code = toText(row.cod_con_vta);
  const label = toText(row.des_con_vta);
  if (code && label) return `${code} ${label}`;
  return label || code || 'Contado';
}

function ventaNumero(row: Rg90Row) {
  const est = toText(row.cod_establecimiento);
  const pto = toText(row.cod_ptoexpedicion);
  const nro = toText(row.comp_nro_timb || row.comp_inicial);
  if (est || pto || nro) {
    return `${padLeft(est || '0', 3)}-${padLeft(pto || '0', 3)}-${padLeft(nro || '0', 7)}`;
  }
  return toText(row.comp_inicial);
}

function compraNumero(row: Rg90Row) {
  const raw = toText(row.nrofact || row.comp_inicial);
  if (!raw) return '';
  if (raw.includes('-')) {
    const parts = raw.split('-');
    if (parts.length >= 3) {
      return `${padLeft(parts[0], 3)}-${padLeft(parts[1], 3)}-${padLeft(parts[2], 7)}`;
    }
    return raw;
  }
  const digits = String(raw).replace(/\.0+$/, '').replace(/\D/g, '');
  if (!digits) return raw;
  if (digits.length <= 7) {
    return `000-000-${padLeft(digits, 7)}`;
  }
  if (digits.length < 13) {
    const prefix = `00${digits.slice(0, 4)}`.slice(-6);
    const nro = digits.slice(4);
    return `${prefix.slice(0, 3)}-${prefix.slice(3, 6)}-${padLeft(nro, 7)}`;
  }
  return `${padLeft(digits.slice(0, 3), 3)}-${padLeft(digits.slice(3, 6), 3)}-${padLeft(digits.slice(6), 7)}`;
}

function compraCondicion(row: Rg90Row) {
  const code = toText(row.cod_con_vta);
  const label = toText(row.des_con_vta);
  if (code && label) return `${code} ${label}`;
  if (code) return code;
  return toText(row.tp_def).toUpperCase() === 'CD' ? 'Credito' : 'Contado';
}

function compraIva5(row: Rg90Row) {
  return valueFromPrimaryOrFallback(row.tot_iva_5, row.total_iva_5);
}

function compraIva10(row: Rg90Row) {
  return valueFromPrimaryOrFallback(row.tot_iva_10, row.total_iva_10 ?? row.total_iva);
}

function compraGrav5(row: Rg90Row) {
  if (row.total_grav_5 === null || row.total_grav_5 === undefined || row.total_grav_5 === '') {
    const iva5 = compraIva5(row);
    return iva5 ? Math.round((iva5 * 100) / 5) : 0;
  }
  return toNumber(row.total_grav_5);
}

function compraGrav10(row: Rg90Row) {
  if (row.total_grav_10 === null || row.total_grav_10 === undefined || row.total_grav_10 === '') {
    const iva10 = compraIva10(row);
    return iva10 ? Math.round((iva10 * 100) / 10) : 0;
  }
  return toNumber(row.total_grav_10);
}

function compraExenta(row: Rg90Row) {
  return valueFromPrimaryOrFallback(row.total_exenta, row.to_exento);
}

function compraTotal(row: Rg90Row) {
  return (
    compraGrav5(row) +
    compraIva5(row) +
    compraGrav10(row) +
    compraIva10(row) +
    compraExenta(row)
  );
}

function isNotaCredito(row: Rg90Row) {
  const tpDef = toText(row.tp_def).toUpperCase();
  return tpDef === 'NC' || tpDef === 'NP' || isVentaTipo5(row);
}

function rowTotal(row: Rg90Row, isVentas: boolean) {
  return isVentas ? ventaTotal(row) : compraTotal(row);
}

function rowGravado(row: Rg90Row) {
  return ventaGrav5(row) + ventaGrav10(row);
}

function valueFromPrimaryOrFallback(primary: unknown, fallback: unknown) {
  if (primary === null || primary === undefined || primary === '') {
    return toNumber(fallback);
  }
  return toNumber(primary);
}

function summarizeRows(rows: Rg90Row[], predicate?: (row: Rg90Row) => boolean) {
  return rows.reduce<Rg90Summary>((acc, row) => {
    if (predicate && !predicate(row)) return acc;
    const grav5 = ventaGrav5(row);
    const grav10 = ventaGrav10(row);
    const iva5 = ventaIva5(row);
    const iva10 = ventaIva10(row);
    const exentas = ventaExenta(row);
    acc.grav5 += grav5;
    acc.grav10 += grav10;
    acc.iva5 += iva5;
    acc.iva10 += iva10;
    acc.exentas += exentas;
    acc.total += grav5 + grav10 + iva5 + iva10 + exentas;
    return acc;
  }, {
    grav5: 0,
    grav10: 0,
    iva5: 0,
    iva10: 0,
    exentas: 0,
    total: 0,
  });
}

function rowKey(row: Rg90Row, index: number) {
  return [
    toText(row.tipo_registro || row.tipo),
    toText(row.cod_tp_comp),
    toText(row.nrofact || row.comp_inicial),
    toText(row.codprov || row.clientes || row.ruc),
    String(index),
  ].join(':');
}

function previewRowsForTipo(tipoInformacion: string, rows: Rg90Row[]) {
  if (tipoInformacion !== 'VENTA') return rows;
  const normales: Rg90Row[] = [];
  const notasProveedor: Rg90Row[] = [];
  for (const row of rows) {
    const tpDef = toText(row.tp_def).toUpperCase();
    if (tpDef === 'NC') continue;
    if (tpDef === 'NP') {
      notasProveedor.push(row);
      continue;
    }
    normales.push(row);
  }
  return [...normales, ...notasProveedor];
}

export function Rg90Panel({ empresa, periodo, mes, sucursal, tipoInformacion, descargarRegistrosExportados, rows, debug, summary, warning }: Rg90PanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const isVentas = tipoInformacion === 'VENTA';
  const displayRows = previewRowsForTipo(tipoInformacion, rows);
  const ventasSummary = summarizeRows(displayRows, (row) => !isNotaCredito(row));
  const notaCreditoSummary = summarizeRows(displayRows, (row) => isNotaCredito(row));
  const netoSummary = {
    grav5: ventasSummary.grav5 - notaCreditoSummary.grav5,
    grav10: ventasSummary.grav10 - notaCreditoSummary.grav10,
    iva5: ventasSummary.iva5 - notaCreditoSummary.iva5,
    iva10: ventasSummary.iva10 - notaCreditoSummary.iva10,
      exentas: ventasSummary.exentas - notaCreditoSummary.exentas,
      total: ventasSummary.total - notaCreditoSummary.total,
    };
  const totalMonto = isVentas
    ? (summary?.visible_total == null
        ? displayRows.filter((row) => !isNotaCredito(row)).reduce((acc, row) => acc + rowTotal(row, isVentas), 0)
        : toNumber(summary.visible_total))
    : displayRows.filter((row) => !isNotaCredito(row)).reduce((acc, row) => acc + rowTotal(row, isVentas), 0);
  const totalExento = isVentas
    ? (summary?.exento_total == null
        ? displayRows.filter((row) => !isNotaCredito(row)).reduce((acc, row) => acc + toNumber(row.total_exenta || row.to_exento), 0)
        : toNumber(summary.exento_total))
    : (summary?.exento_total == null
        ? displayRows.filter((row) => !isNotaCredito(row)).reduce((acc, row) => acc + compraExenta(row), 0)
        : toNumber(summary.exento_total));
  const totalNotaCreditoVisible = displayRows
    .filter((row) => isNotaCredito(row))
    .reduce((acc, row) => acc + rowTotal(row, isVentas), 0);
  const totalNotaCredito = isVentas
    ? totalNotaCreditoVisible
    : (summary?.note_credit_total == null ? totalNotaCreditoVisible : toNumber(summary.note_credit_total));
  const kpiItems = [
    { label: 'Registros', value: displayRows.length.toLocaleString('es-PY') },
    { label: 'Monto visible', value: formatAmount(totalMonto) },
    { label: 'Exento', value: formatAmount(totalExento) },
    { label: 'Nota credito', value: formatAmount(totalNotaCredito) },
  ];

  async function exportRg90() {
    try {
      setIsExporting(true);
      const desde = `${periodo}-${mes}-01`;
      const lastDay = new Date(Number(periodo), Number(mes), 0).getDate();
      const hasta = `${periodo}-${mes}-${String(lastDay).padStart(2, '0')}`;
      const search = new URLSearchParams({
        empresa,
        periodo,
        desde,
        hasta,
        tipoInformacion,
      });
      if (descargarRegistrosExportados) {
        search.set('descargarRegistrosExportados', 'true');
      }
      if (sucursal) {
        search.set('sucursal', sucursal);
      }
      const response = await fetch(`/api/finanzas/rg90/export?${search.toString()}`, {
        cache: 'no-store',
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: { filename?: string; content?: string; data?: { filename?: string; content?: string } };
      };
      const data = payload?.data?.data || payload?.data;
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.message || 'No se pudo generar el archivo RG90.');
      }
      const filename = String(data?.filename || `RG90_${empresa}_${periodo}${mes}.txt`);
      const content = String(data?.content || '');
      if (!content) {
        throw new Error('El archivo RG90 se genero sin contenido.');
      }
      downloadBlob(filename, content, 'text/plain;charset=utf-8;');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No se pudo exportar RG90.');
    } finally {
      setIsExporting(false);
    }
  }

  async function exportRg90Csv() {
    try {
      setIsExportingCsv(true);
      const desde = `${periodo}-${mes}-01`;
      const lastDay = new Date(Number(periodo), Number(mes), 0).getDate();
      const hasta = `${periodo}-${mes}-${String(lastDay).padStart(2, '0')}`;
      const search = new URLSearchParams({
        empresa,
        periodo,
        desde,
        hasta,
        tipoInformacion,
        format: 'csv',
      });
      if (descargarRegistrosExportados) {
        search.set('descargarRegistrosExportados', 'true');
      }
      if (sucursal) {
        search.set('sucursal', sucursal);
      }
      const response = await fetch(`/api/finanzas/rg90/export?${search.toString()}`, {
        cache: 'no-store',
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: { filename?: string; content?: string; data?: { filename?: string; content?: string } };
      };
      const data = payload?.data?.data || payload?.data;
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.message || 'No se pudo generar el archivo CSV de ejemplo.');
      }
      const filename = String(data?.filename || `RG90_${empresa}_${periodo}${mes}.csv`);
      const content = String(data?.content || '');
      if (!content) {
        throw new Error('El archivo CSV de ejemplo se genero sin contenido.');
      }
      downloadBlob(filename, content, 'text/csv;charset=utf-8;');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No se pudo exportar el CSV de ejemplo.');
    } finally {
      setIsExportingCsv(false);
    }
  }

  return (
    <section id="rg90" className="scroll-mt-28 space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {kpiItems.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">{item.label}</p>
            <p className="mt-1.5 text-lg font-semibold leading-tight text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {warning ? (
        <EmptyState title="RG90 no disponible" description={warning} tone="error" />
      ) : displayRows.length ? (
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900">
                {tipoInformacionLabel(tipoInformacion)} · {empresa} · {monthLabel(mes)} {periodo}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {sucursal ? `Sucursal ${sucursal}` : 'Todas las sucursales'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
              <button
                type="button"
                onClick={exportRg90Csv}
                disabled={isExportingCsv || displayRows.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileSpreadsheet className="size-4" />
                {isExportingCsv ? 'Generando CSV...' : 'Exportar CSV'}
              </button>
              <button
                type="button"
                onClick={exportRg90}
                disabled={isExporting || displayRows.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileDown className="size-4" />
                {isExporting ? 'Generando TXT...' : 'Exportar TXT'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isVentas ? (
              <table className="min-w-[1600px] text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">Dia</th>
                    <th className="px-3 py-3 text-left font-semibold">Nro. Compr.</th>
                    <th className="px-3 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-3 py-3 text-left font-semibold">Razon Social/Apellidos/Nombres</th>
                    <th className="px-3 py-3 text-left font-semibold">R.U.C.</th>
                    <th className="px-3 py-3 text-right font-semibold">Gravadas 5%</th>
                    <th className="px-3 py-3 text-right font-semibold">Gravadas 10%</th>
                    <th className="px-3 py-3 text-right font-semibold">Impuesto 5%</th>
                    <th className="px-3 py-3 text-right font-semibold">Impuesto 10%</th>
                    <th className="px-3 py-3 text-right font-semibold">Exentas</th>
                    <th className="px-3 py-3 text-right font-semibold">TOTAL</th>
                    <th className="px-3 py-3 text-left font-semibold">Cond.de Venta</th>
                    <th className="px-3 py-3 text-right font-semibold">Cant.</th>
                    <th className="px-3 py-3 text-right font-semibold">Dias</th>
                    <th className="px-3 py-3 text-right font-semibold">F.Cambio</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row, index) => (
                    <tr key={rowKey(row, index)} className="border-t border-slate-100 align-top text-slate-700">
                      <td className="whitespace-nowrap px-3 py-3">{formatDay(row.fechafact)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{ventaNumero(row)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{formatDate(row.fechafact)}</td>
                      <td className="px-3 py-3">{toText(row.razonsocial)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{toText(row.ruc)}</td>
                        <td className="px-3 py-3 text-right">{formatAmount(ventaGrav5(row))}</td>
                        <td className="px-3 py-3 text-right">{formatAmount(ventaGrav10(row))}</td>
                        <td className="px-3 py-3 text-right">{formatAmount(ventaIva5(row))}</td>
                        <td className="px-3 py-3 text-right">{formatAmount(ventaIva10(row))}</td>
                        <td className="px-3 py-3 text-right">{formatAmount(ventaExenta(row))}</td>
                      <td className="px-3 py-3 text-right font-medium text-slate-900">{formatAmount(ventaTotal(row))}</td>
                      <td className="whitespace-nowrap px-3 py-3">{ventaCondicion(row)}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(row.cuota)}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(row.dias_credito)}</td>
                      <td className="px-3 py-3 text-right">{formatFactor(row.factcambio)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-50 text-slate-900">
                  <tr className="font-semibold">
                    <td className="px-3 py-3" colSpan={6}>Ventas</td>
                    <td className="px-3 py-3 text-right">{formatAmount(ventasSummary.grav5)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(ventasSummary.grav10)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(ventasSummary.iva5)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(ventasSummary.iva10)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(ventasSummary.exentas)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(ventasSummary.total)}</td>
                    <td className="px-3 py-3" colSpan={4}></td>
                  </tr>
                  <tr className="font-semibold text-rose-800">
                    <td className="px-3 py-3" colSpan={6}>Notas de Credito</td>
                    <td className="px-3 py-3 text-right">{formatAmount(notaCreditoSummary.grav5)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(notaCreditoSummary.grav10)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(notaCreditoSummary.iva5)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(notaCreditoSummary.iva10)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(notaCreditoSummary.exentas)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(notaCreditoSummary.total)}</td>
                    <td className="px-3 py-3" colSpan={4}></td>
                  </tr>
                  <tr className="font-bold">
                    <td className="px-3 py-3" colSpan={6}>Neto</td>
                    <td className="px-3 py-3 text-right">{formatAmount(netoSummary.grav5)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(netoSummary.grav10)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(netoSummary.iva5)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(netoSummary.iva10)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(netoSummary.exentas)}</td>
                    <td className="px-3 py-3 text-right">{formatAmount(netoSummary.total)}</td>
                    <td className="px-3 py-3" colSpan={4}></td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <table className="min-w-[1550px] text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-3 py-3 text-left font-semibold">Numero</th>
                    <th className="px-3 py-3 text-left font-semibold">Timbrado</th>
                    <th className="px-3 py-3 text-left font-semibold">Proveedor</th>
                    <th className="px-3 py-3 text-left font-semibold">R.U.C.</th>
                    <th className="px-3 py-3 text-right font-semibold">Gravadas 5%</th>
                    <th className="px-3 py-3 text-right font-semibold">IVA 5%</th>
                    <th className="px-3 py-3 text-right font-semibold">Gravadas 10%</th>
                    <th className="px-3 py-3 text-right font-semibold">IVA 10%</th>
                    <th className="px-3 py-3 text-right font-semibold">Total IVA</th>
                    <th className="px-3 py-3 text-right font-semibold">Exentas</th>
                    <th className="px-3 py-3 text-right font-semibold">Total Factura</th>
                    <th className="px-3 py-3 text-right font-semibold">Base Imponible</th>
                    <th className="px-3 py-3 text-left font-semibold">Condicion de Compra</th>
                    <th className="px-3 py-3 text-right font-semibold">Cant Cuotas</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row, index) => (
                    <tr key={rowKey(row, index)} className="border-t border-slate-100 align-top text-slate-700">
                      <td className="whitespace-nowrap px-3 py-3">{formatDate(row.fechafact)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{compraNumero(row)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{toText(row.timbradoprov || row.timbrado)}</td>
                      <td className="px-3 py-3">{toText(row.razonsocial)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{toText(row.ruc)}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(compraGrav5(row))}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(compraIva5(row))}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(compraGrav10(row))}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(compraIva10(row))}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(compraIva5(row) + compraIva10(row))}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(compraExenta(row))}</td>
                      <td className="px-3 py-3 text-right font-medium text-slate-900">{formatAmount(compraTotal(row))}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(row.valor_imponible)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{compraCondicion(row)}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(row.cuota || 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <EmptyState
            title="Sin registros RG90"
            description="No se encontraron registros para este periodo, sucursal y tipo de informacion."
          />
          {isVentas && debug ? (
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm text-cyan-950">
              <p className="font-semibold">Diagnostico del dataset de ventas</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Tipo 1</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.tipo_1_vtacab_clientes)}</p>
                  <p className="text-xs text-slate-500">VTACAB clientes</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Tipo 2</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.tipo_2_resumen)}</p>
                  <p className="text-xs text-slate-500">Resumen ventas</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Tipo 3</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.tipo_3_cliente_varios)}</p>
                  <p className="text-xs text-slate-500">Cliente varios</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Tipo 4</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.tipo_4_sin_nombre)}</p>
                  <p className="text-xs text-slate-500">Sin nombre</p>
                </div>
              </div>
            </div>
          ) : !isVentas && debug ? (
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm text-cyan-950">
              <p className="font-semibold">Diagnostico del dataset de compras</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">FACTCAB</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.compra_factcab)}</p>
                  <p className="text-xs text-slate-500">Compras locales</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">LIQUIDACION</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.compra_liquidacion)}</p>
                  <p className="text-xs text-slate-500">Liquidacion importacion</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">DESPACHO</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.compra_despacho)}</p>
                  <p className="text-xs text-slate-500">Despachos</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">LIQTARJ</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.compra_liqtarj)}</p>
                  <p className="text-xs text-slate-500">Liquidacion tarjetas</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-white px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">VTACAB NC</p>
                  <p className="mt-1 text-lg font-semibold">{formatAmount(debug.compra_vtacab_nc)}</p>
                  <p className="text-xs text-slate-500">Notas de credito ventas</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
