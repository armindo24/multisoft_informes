import { DataTable } from '@/components/ui/data-table';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { CompraRow } from '@/types/compras';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function PurchasesTable({
  rows,
  exportBranding,
}: {
  rows: CompraRow[];
  exportBranding?: ExportBrandingOverride;
}) {
  const normalizedRows = rows.map((row) => ({
    fecha: String(row.FechaFact || row.fecha_fact || '').slice(0, 10),
    comprobante: `${row.Cod_Tp_Comp || row.cod_tp_comp || ''} - ${row.NroFact || row.nrofact || ''}`,
    proveedor: String(row.RazonSocial || row.razon_social || '-'),
    sucursal: String(row.des_sucursal || '-'),
    gravada: num(row.gravada),
    iva: num(row.IVA || row.iva),
    total: num(row.total),
    estado: String(row.estado || row.Asentado || '-'),
  }));

  return (
    <DataTable
      title="Compras del período"
      subtitle="Facturas de compra filtradas por empresa, sucursal, proveedor y fechas."
      exportName="compras-periodo"
      rows={normalizedRows}
      exportBranding={exportBranding}
      columns={[
        { key: 'fecha', header: 'Fecha', sortable: true, type: 'date' },
        { key: 'comprobante', header: 'Comprobante', sortable: true },
        { key: 'proveedor', header: 'Proveedor', sortable: true },
        { key: 'sucursal', header: 'Sucursal', sortable: true },
        { key: 'gravada', header: 'Gravada', sortable: true, type: 'currency', align: 'right' },
        { key: 'iva', header: 'IVA', sortable: true, type: 'currency', align: 'right' },
        { key: 'total', header: 'Total', sortable: true, type: 'currency', align: 'right' },
        { key: 'estado', header: 'Estado', sortable: true, type: 'badge', badgeMap: { A: 'bg-emerald-100 text-emerald-700', Pendiente: 'bg-amber-100 text-amber-700', Anulado: 'bg-rose-100 text-rose-700' } },
      ]}
    />
  );
}
