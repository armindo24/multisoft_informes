import { DataTable } from '@/components/ui/data-table';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { OrdenCompraRow } from '@/types/compras';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function PurchaseOrdersTable({
  rows,
  exportBranding,
}: {
  rows: OrdenCompraRow[];
  exportBranding?: ExportBrandingOverride;
}) {
  const normalizedRows = rows.map((row) => ({
    ordenCompra: String(row.nroordcomp || 'oc'),
    fecha: String(row.fechaorden || '').slice(0, 10),
    proveedor: String(row.razonsocial || '-'),
    responsable: String(row.responsable || '-'),
    departamento: String(row.descrip || '-'),
    cumplido: num(row.porccumplido),
    estado: String(row.estado || '-'),
    total: num(row.total),
  }));

  return (
    <DataTable
      title="Órdenes de compra"
      subtitle="Seguimiento de órdenes abiertas, responsables y avance de cumplimiento."
      exportName="ordenes-compra"
      rows={normalizedRows}
      exportBranding={exportBranding}
      columns={[
        { key: 'ordenCompra', header: 'N° OC', sortable: true },
        { key: 'fecha', header: 'Fecha', sortable: true, type: 'date' },
        { key: 'proveedor', header: 'Proveedor', sortable: true },
        { key: 'responsable', header: 'Responsable', sortable: true },
        { key: 'departamento', header: 'Departamento', sortable: true },
        { key: 'cumplido', header: 'Cumplido %', sortable: true, type: 'number', align: 'right' },
        { key: 'estado', header: 'Estado', sortable: true, type: 'badge', badgeMap: { Abierta: 'bg-amber-100 text-amber-700', Cerrada: 'bg-emerald-100 text-emerald-700', Anulada: 'bg-rose-100 text-rose-700' } },
        { key: 'total', header: 'Total', sortable: true, type: 'currency', align: 'right' },
      ]}
    />
  );
}
