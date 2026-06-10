'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import { exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';
import type { ExportBrandingOverride, ExportMetaItem } from '@/components/ui/export-utils';
import { ReportScheduleButton } from '@/components/ui/report-schedule-button';
import { EmptyState } from '@/components/ui/empty-state';
import { StockCostoArticuloFullRow } from '@/types/stock';

function formatNumber(value: unknown, decimals = 0) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return '0';
  return number.toLocaleString('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

type ColumnDef = {
  key: string;
  label: string;
  align: 'left' | 'right';
  decimals?: number;
  sticky?: boolean;
  minWidth?: string;
  left?: string;
};

function buildColumns(ecuacionMat?: boolean): readonly ColumnDef[] {
  if (ecuacionMat) {
    return [
      { key: 'anio', label: 'AÑO', align: 'left', sticky: true, minWidth: '50px', left: '0px' },
      { key: 'mes', label: 'MES', align: 'left', sticky: true, minWidth: '46px', left: '50px' },
      { key: 'cod_articulo', label: 'CÓD. PY', align: 'left', sticky: true, minWidth: '82px', left: '96px' },
      { key: 'cod_pt_reacondicionado', label: 'CÓD. REAC.', align: 'left', sticky: true, minWidth: '92px', left: '178px' },
      { key: 'des_art', label: 'PRODUCTO', align: 'left', sticky: true, minWidth: '210px', left: '270px' },
      { key: 'fob_usd_origen', label: 'FOB USD', align: 'right', decimals: 2 },
      { key: 'porcentaje_costo_total_importacion', label: '% CTO. IMP.', align: 'right', decimals: 2 },
      { key: 'costo_total_us_actual', label: 'CTO. USD', align: 'right', decimals: 2 },
      { key: 'servicio_clasificacion_director', label: 'STICKER / ENG.', align: 'right', decimals: 0 },
      { key: 'servicio_clasificacion_proveedor', label: 'PROSPECTO', align: 'right', decimals: 0 },
      { key: 'servicio_no_gr', label: 'SERV. MO', align: 'right', decimals: 0 },
      { key: 'estuche_gr', label: 'ESTUCHE GS.', align: 'right', decimals: 0 },
      { key: 'prospecto_gr', label: 'PROS. GS.', align: 'right', decimals: 0 },
      { key: 'inkjet_gr', label: 'INKJET GS.', align: 'right', decimals: 0 },
      { key: 'sticker_sello_seguridad', label: 'STICKER / SELLO', align: 'right', decimals: 0 },
      { key: 'solvente_celofane', label: 'SOLV. / CUCHARA', align: 'right', decimals: 0 },
      { key: 'total_costo_produccion_gs', label: 'CTO. PROD. GS.', align: 'right', decimals: 0 },
      { key: 'total_costo_produccion_us', label: 'CTO. PROD. USD', align: 'right', decimals: 2 },
      { key: 'costo_total_final_us', label: 'CTO. FINAL USD', align: 'right', decimals: 2 },
    ] as const;
  }

  return [
    { key: 'cod_articulo', label: 'Código', align: 'left' },
    { key: 'des_art', label: 'Descripción', align: 'left' },
    { key: 'cod_tp_art', label: 'Tipo', align: 'left' },
    { key: 'estado', label: 'Estado', align: 'left' },
    { key: 'cto_prom_gs', label: 'Costo Promedio Gs', align: 'right', decimals: 0 },
    { key: 'cto_ult_gs', label: 'Costo Ultimo Gs', align: 'right', decimals: 0 },
    { key: 'cto_prom_me', label: 'Costo Promedio U$', align: 'right', decimals: 2 },
    { key: 'cto_ult_me', label: 'Costo Ultimo U$', align: 'right', decimals: 2 },
    { key: 'codmoneda', label: 'Moneda', align: 'left' },
    { key: 'iva', label: 'IVA', align: 'left' },
    { key: 'existencia', label: 'Existencia', align: 'right', decimals: 2 },
  ] as const;
}

function getCellValue(row: StockCostoArticuloFullRow, key: string) {
  if (key === 'iva') {
    return row.iva ?? row.cod_iva ?? '-';
  }
  return row[key];
}

function renderCellValue(row: StockCostoArticuloFullRow, column: ColumnDef) {
  const value = getCellValue(row, column.key);
  if (typeof column.decimals === 'number') {
    return formatNumber(value, column.decimals);
  }
  return String(value ?? '-');
}

function getStickyClasses(column: ColumnDef, section: 'head' | 'body') {
  if (!column.sticky) return '';
  return section === 'head'
    ? 'sticky left-0 z-40 bg-slate-50 shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)]'
    : 'sticky left-0 z-10 bg-white shadow-[8px_0_12px_-12px_rgba(15,23,42,0.25)]';
}

function getCellStyle(column: ColumnDef) {
  const style: Record<string, string> = {};
  if (column.minWidth) {
    style.minWidth = column.minWidth;
  }
  if (column.sticky && column.left) {
    style.left = column.left;
  }
  return Object.keys(style).length ? style : undefined;
}

export function StockCostoArticuloFullTable({
  rows,
  empresa,
  fechad,
  fechah,
  ecuacionMat,
  exportBranding,
  scheduleConfig,
}: {
  rows: StockCostoArticuloFullRow[];
  empresa: string;
  fechad: string;
  fechah: string;
  ecuacionMat?: boolean;
  exportBranding?: ExportBrandingOverride;
  scheduleConfig?: {
    reportKey: string;
    reportModule: string;
    reportParams?: Record<string, string>;
  };
}) {
  const columns = buildColumns(ecuacionMat);
  const exportMeta: ExportMetaItem[] = [
    { label: 'Empresa', value: empresa || '-' },
    { label: 'Desde', value: fechad || '-' },
    { label: 'Hasta', value: fechah || '-' },
  ];

  function exportExcel() {
    if (!rows.length) return;
    exportRowsToExcel({
      title: 'Costo Articulo Full',
      subtitle: ecuacionMat
        ? 'Vista Ecuacion BC materiales, con columnas alineadas al formato historico.'
        : 'Vista basada en el endpoint actual del backend, alineada al informe historico.',
      filename: 'costo_articulo_full',
      headers: columns.map((column) => column.label),
      rows: rows.map((row) => columns.map((column) => renderCellValue(row, column))),
      meta: exportMeta,
      branding: exportBranding,
    });
  }

  function exportPdf() {
    if (!rows.length) return;
    exportRowsToPdf({
      title: 'Costo Articulo Full',
      subtitle: ecuacionMat
        ? 'Vista Ecuacion BC materiales, con columnas alineadas al formato historico.'
        : 'Vista basada en el endpoint actual del backend, alineada al informe historico.',
      headers: columns.map((column) => column.label),
      rows: rows.map((row) => columns.map((column) => renderCellValue(row, column))),
      meta: exportMeta,
      branding: exportBranding,
    });
  }

  return (
    <section className="card overflow-hidden">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Costo Articulo Full</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {ecuacionMat
                ? 'Vista Ecuacion BC materiales, con columnas alineadas al formato historico.'
                : 'Vista basada en el endpoint actual del backend, alineada al informe historico.'}
            </p>
          </div>
          <div className="flex gap-2">
            {scheduleConfig ? (
              <ReportScheduleButton
                reportKey={scheduleConfig.reportKey}
                reportTitle="Costo Articulo Full"
                reportModule={scheduleConfig.reportModule}
                detailHint={ecuacionMat
                  ? 'Entrega automatica de costo articulo full en modo ecuacion BC materiales.'
                  : 'Entrega automatica de costo articulo full para seguimiento corporativo.'}
                reportParams={scheduleConfig.reportParams}
                buttonClassName="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100"
              />
            ) : null}
            <button
              type="button"
              onClick={exportExcel}
              disabled={!rows.length}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={!rows.length}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-[11px] leading-4">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`sticky top-0 z-30 h-8 border-b border-slate-200 bg-slate-50 px-2 py-1.5 align-middle font-semibold text-slate-700 ${column.align === 'right' ? 'text-right' : 'text-left'} ${getStickyClasses(column, 'head')}`}
                  style={getCellStyle(column)}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={`${row.cod_articulo || index}-${index}`} className="hover:bg-slate-50/80">
                  {columns.map((column) => (
                    <td
                      key={`${column.key}-${index}`}
                      className={`h-8 border-b border-slate-100 px-2 py-1.5 ${column.align === 'right' ? 'text-right tabular-nums' : ''} ${getStickyClasses(column, 'body')}`}
                      style={getCellStyle(column)}
                    >
                      {renderCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-5">
                  <EmptyState title="Sin datos de costo" description="No hay datos disponibles para este informe." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
