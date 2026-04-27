'use client';

import { FileDown, FileSpreadsheet, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getVentaDetalle } from '@/lib/api';
import { exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { ReportNoticeButton } from '@/components/ui/report-notice-button';
import { ReportTaskButton } from '@/components/ui/report-task-button';
import { VentaDetalle, VentaResumen } from '@/types/ventas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function money(value: unknown) {
  return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(num(value));
}

function groupLabel(groupBy: string) {
  if (groupBy === 'cod_tp_comp') return 'Comprobante';
  if (groupBy === 'cod_vendedor') return 'Vendedor';
  return 'Cliente';
}

function groupValue(row: VentaResumen, groupBy: string) {
  if (groupBy === 'cod_tp_comp') return String(row.des_tp_comp || row.cod_tp_comp || 'Sin comprobante');
  if (groupBy === 'cod_vendedor') return String(row.des_vendedor || 'Sin vendedor');
  return String(row.razon_social || row.cliente || 'Sin cliente');
}

function detailSummary(items: VentaDetalle[]) {
  return items.reduce<{ cantidad: number; total: number }>(
    (acc, item) => ({
      cantidad: acc.cantidad + num(item.cantidad),
      total: acc.total + num(item.total_neto),
    }),
    { cantidad: 0, total: 0 },
  );
}

export function SalesTable({
  rows,
  groupBy,
  exportBranding,
}: {
  rows: VentaResumen[];
  groupBy: string;
  exportBranding?: ExportBrandingOverride;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [selectedRow, setSelectedRow] = useState<VentaResumen | null>(null);
  const [detailRows, setDetailRows] = useState<VentaDetalle[]>([]);

  const groupedRows = useMemo(() => {
    const buckets = new Map<string, VentaResumen[]>();
    for (const row of rows) {
      const key = groupValue(row, groupBy);
      const currentGroup = buckets.get(key) || [];
      currentGroup.push(row);
      buckets.set(key, currentGroup);
    }
    return Array.from(buckets.entries());
  }, [groupBy, rows]);

  const summary = useMemo(
    () => rows.reduce(
      (acc, row) => ({
        comprobantes: acc.comprobantes + 1,
        gravado: acc.gravado + num(row.to_gravado),
        iva: acc.iva + num(row.total_iva),
        descuento: acc.descuento + num(row.totaldescuento),
        total: acc.total + num(row.to_gravado) + num(row.total_iva),
      }),
      { comprobantes: 0, gravado: 0, iva: 0, descuento: 0, total: 0 },
    ),
    [rows],
  );

  const selectedSummary = useMemo(() => detailSummary(detailRows), [detailRows]);

  async function openDetail(row: VentaResumen) {
    setSelectedRow(row);
    setDetailRows([]);
    setDetailError('');
    setDetailOpen(true);
    setDetailLoading(true);

    const empresa = String(row.cod_empresa || '').trim();
    const comprobante = String(row.comp_numero || '').trim();
    const response = empresa && comprobante ? await getVentaDetalle({ empresa, comprobante }) : null;

    if (!response) {
      setDetailError('No se pudo cargar el detalle de la venta seleccionada.');
      setDetailLoading(false);
      return;
    }

    setDetailRows((response.data || []) as VentaDetalle[]);
    setDetailLoading(false);
  }

  function exportResumenExcel() {
    exportRowsToExcel({
      title: 'Ventas resumido y detallado',
      subtitle: `Agrupado por ${groupLabel(groupBy).toLowerCase()}.`,
      filename: 'ventas-resumen',
      headers: ['Grupo', 'Comprobante', 'Cliente', 'RUC', 'Fecha', 'IVA', 'Gravado', 'Descuento', 'Total'],
      rows: groupedRows.flatMap(([group, items]) =>
        items.map((row) => [
          group,
          `${row.cod_tp_comp || ''} - ${row.comp_numero || ''}`,
          String(row.razon_social || row.cliente || '-'),
          String(row.ruc || '-'),
          String(row.fecha || '').slice(0, 10) || '-',
          money(row.total_iva),
          money(row.to_gravado),
          money(row.totaldescuento),
          money(num(row.to_gravado) + num(row.total_iva)),
        ]),
      ),
      branding: exportBranding,
    });
  }

  function exportResumenPdf() {
    exportRowsToPdf({
      title: 'Ventas resumido y detallado',
      subtitle: `Agrupado por ${groupLabel(groupBy).toLowerCase()}.`,
      headers: ['Grupo', 'Comprobante', 'Cliente', 'RUC', 'Fecha', 'IVA', 'Gravado', 'Descuento', 'Total'],
      rows: groupedRows.flatMap(([group, items]) =>
        items.map((row) => [
          group,
          `${row.cod_tp_comp || ''} - ${row.comp_numero || ''}`,
          String(row.razon_social || row.cliente || '-'),
          String(row.ruc || '-'),
          String(row.fecha || '').slice(0, 10) || '-',
          money(row.total_iva),
          money(row.to_gravado),
          money(row.totaldescuento),
          money(num(row.to_gravado) + num(row.total_iva)),
        ]),
      ),
      branding: exportBranding,
    });
  }

  function exportDetalleExcel() {
    if (!detailRows.length) return;
    exportRowsToExcel({
      title: `Detalle de venta ${selectedRow?.comp_numero || ''}`.trim(),
      subtitle: String(selectedRow?.razon_social || selectedRow?.cliente || ''),
      filename: 'ventas-detalle',
      headers: ['Deposito', 'Articulo', 'Descripcion', 'Lista', 'Cantidad', 'Pr. Unit.', '% Dcto.', 'Total'],
      rows: detailRows.map((item) => [
        String(item.cod_deposito || '-'),
        String(item.cod_articulo || '-'),
        String(item.descrip || '-'),
        String(item.lista_prec || '-'),
        money(item.cantidad),
        money(item.pr_unit),
        money(item.descuento),
        money(item.total_neto),
      ]),
      branding: exportBranding,
    });
  }

  function exportDetallePdf() {
    if (!detailRows.length) return;
    exportRowsToPdf({
      title: `Detalle de venta ${selectedRow?.comp_numero || ''}`.trim(),
      subtitle: String(selectedRow?.razon_social || selectedRow?.cliente || ''),
      headers: ['Deposito', 'Articulo', 'Descripcion', 'Lista', 'Cantidad', 'Pr. Unit.', '% Dcto.', 'Total'],
      rows: detailRows.map((item) => [
        String(item.cod_deposito || '-'),
        String(item.cod_articulo || '-'),
        String(item.descrip || '-'),
        String(item.lista_prec || '-'),
        money(item.cantidad),
        money(item.pr_unit),
        money(item.descuento),
        money(item.total_neto),
      ]),
      branding: exportBranding,
    });
  }

  return (
    <>
      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Ventas resumido y detallado</h2>
              <p className="mt-1 text-sm text-slate-500">
                Agrupado por {groupLabel(groupBy).toLowerCase()} y con acceso al detalle completo por comprobante, como en la pantalla anterior.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Comprobantes</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{summary.comprobantes}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gravado</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(summary.gravado)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">IVA</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(summary.iva)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(summary.total)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReportNoticeButton
                reportTitle="Ventas resumido y detallado"
                detailHint={`Agrupado por ${groupLabel(groupBy).toLowerCase()}.`}
              />
              <ReportTaskButton
                reportTitle="Ventas resumido y detallado"
                taskModule="Ventas"
                detailHint={`Agrupado por ${groupLabel(groupBy).toLowerCase()}.`}
              />
              <button type="button" onClick={exportResumenExcel} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                <FileSpreadsheet className="size-4" />
                Excel
              </button>
              <button type="button" onClick={exportResumenPdf} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-50">
                <FileDown className="size-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-10 text-sm text-slate-500">No hay ventas para mostrar con los filtros actuales.</div>
        ) : (
          <div className="space-y-5 px-5 py-5">
            {groupedRows.map(([group, items]) => (
              <div key={group} className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{groupLabel(groupBy)}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{group}</h3>
                  </div>
                  <div className="text-sm text-slate-600">{items.length} comprobantes</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-white text-left text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Detalle</th>
                        <th className="px-4 py-3 font-semibold">Comprobante</th>
                        <th className="px-4 py-3 font-semibold">Cliente</th>
                        <th className="px-4 py-3 font-semibold">RUC</th>
                        <th className="px-4 py-3 font-semibold">Fecha</th>
                        <th className="px-4 py-3 text-right font-semibold">IVA</th>
                        <th className="px-4 py-3 text-right font-semibold">Gravado</th>
                        <th className="px-4 py-3 text-right font-semibold">Descuento</th>
                        <th className="px-4 py-3 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {items.map((row, index) => (
                        <tr key={`${row.comp_numero || 'comp'}-${index}`} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => openDetail(row)}
                              className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-medium text-cyan-800 transition hover:bg-cyan-100"
                            >
                              <Search className="size-4" />
                              Ver detalle
                            </button>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{`${row.cod_tp_comp || ''} - ${row.comp_numero || ''}`}</td>
                          <td className="px-4 py-3 text-slate-700">{String(row.razon_social || row.cliente || '-')}</td>
                          <td className="px-4 py-3 text-slate-700">{String(row.ruc || '-')}</td>
                          <td className="px-4 py-3 text-slate-700">{String(row.fecha || '').slice(0, 10) || '-'}</td>
                          <td className="px-4 py-3 text-right text-slate-700">{money(row.total_iva)}</td>
                          <td className="px-4 py-3 text-right text-slate-700">{money(row.to_gravado)}</td>
                          <td className="px-4 py-3 text-right text-slate-700">{money(row.totaldescuento)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900">{money(num(row.to_gravado) + num(row.total_iva))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {detailOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Detalle de venta</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">{selectedRow?.comp_numero || 'Comprobante'}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedRow?.cod_cliente || ''} {selectedRow?.razon_social || selectedRow?.cliente || ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tipo</p>
                <p className="mt-1 font-medium text-slate-900">{selectedRow?.cod_tp_comp || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fecha</p>
                <p className="mt-1 font-medium text-slate-900">{String(selectedRow?.fecha || '').slice(0, 10) || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Bruto</p>
                <p className="mt-1 font-medium text-slate-900">{money(selectedRow?.to_gravado)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">IVA</p>
                <p className="mt-1 font-medium text-slate-900">{money(selectedRow?.total_iva)}</p>
              </div>
            </div>

            <div className="max-h-[52vh] overflow-auto px-6 py-5">
              <div className="mb-4 flex justify-end gap-2">
                <ReportNoticeButton
                  reportTitle={`Detalle de venta ${selectedRow?.comp_numero || ''}`.trim() || 'Detalle de venta'}
                  detailHint={String(selectedRow?.razon_social || selectedRow?.cliente || '')}
                />
                <ReportTaskButton
                  reportTitle={`Detalle de venta ${selectedRow?.comp_numero || ''}`.trim() || 'Detalle de venta'}
                  taskModule="Ventas"
                  detailHint={String(selectedRow?.razon_social || selectedRow?.cliente || '')}
                />
                <button type="button" onClick={exportDetalleExcel} disabled={!detailRows.length} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                  <FileSpreadsheet className="size-4" />
                  Excel
                </button>
                <button type="button" onClick={exportDetallePdf} disabled={!detailRows.length} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-50">
                  <FileDown className="size-4" />
                  PDF
                </button>
              </div>
              {detailLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : detailError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{detailError}</div>
              ) : detailRows.length === 0 ? (
                <div className="text-sm text-slate-500">No se encontraron lineas para este comprobante.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Dep.</th>
                        <th className="px-4 py-3 font-semibold">Art.</th>
                        <th className="px-4 py-3 font-semibold">Descripcion</th>
                        <th className="px-4 py-3 font-semibold">Lista</th>
                        <th className="px-4 py-3 text-right font-semibold">Cant.</th>
                        <th className="px-4 py-3 text-right font-semibold">Pr. Unit.</th>
                        <th className="px-4 py-3 text-right font-semibold">% Dcto.</th>
                        <th className="px-4 py-3 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {detailRows.map((item, index) => (
                        <tr key={`${item.linea || 'linea'}-${item.cod_articulo || 'art'}-${item.cod_deposito || 'dep'}-${index}`} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3">{String(item.cod_deposito || '-')}</td>
                          <td className="px-4 py-3">{String(item.cod_articulo || '-')}</td>
                          <td className="px-4 py-3">{String(item.descrip || '-')}</td>
                          <td className="px-4 py-3">{String(item.lista_prec || '-')}</td>
                          <td className="px-4 py-3 text-right">{money(item.cantidad)}</td>
                          <td className="px-4 py-3 text-right">{money(item.pr_unit)}</td>
                          <td className="px-4 py-3 text-right">{money(item.descuento)}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">{money(item.total_neto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Cantidad</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(selectedSummary.cantidad)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Descuento</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(selectedRow?.totaldescuento)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Neto</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(selectedSummary.total)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total cabecera</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{money(num(selectedRow?.to_gravado) + num(selectedRow?.total_iva))}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
