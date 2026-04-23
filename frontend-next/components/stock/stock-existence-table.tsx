import { DataTable } from '@/components/ui/data-table';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { StockDepositoRow } from '@/types/stock';

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function StockExistenceTable({
  rows,
  exportBranding,
}: {
  rows: StockDepositoRow[];
  exportBranding?: ExportBrandingOverride;
}) {
  const normalizedRows = rows.map((row) => {
    const existencia = toNumber(row.existencia);
    const puntoPedido = toNumber(row.pto_pedido);
    const estado = existencia <= 0 ? 'Sin stock' : existencia <= puntoPedido && puntoPedido > 0 ? 'Bajo mínimo' : 'OK';
    return {
      articulo: String(row.cod_articulo || row.cod_original || '-'),
      descripcion: String(row.des_art || row.referencia || '-'),
      familia: String(row.des_familia || row.cod_familia || '-'),
      deposito: String(row.cod_deposito || '-'),
      existencia,
      puntoPedido,
      estado,
    };
  });

  return (
    <DataTable
      title="Existencia por depósito"
      subtitle="Vista operativa para detectar faltantes, sobrestock y artículos cercanos al punto de pedido."
      exportName="stock-existencia"
      rows={normalizedRows}
      exportBranding={exportBranding}
      emptyMessage="No hay datos de existencia para el filtro seleccionado."
      columns={[
        { key: 'articulo', header: 'Artículo', sortable: true },
        { key: 'descripcion', header: 'Descripción', sortable: true },
        { key: 'familia', header: 'Familia', sortable: true },
        { key: 'deposito', header: 'Depósito', sortable: true },
        { key: 'existencia', header: 'Existencia', sortable: true, type: 'number', align: 'right' },
        { key: 'puntoPedido', header: 'Pto. pedido', sortable: true, type: 'number', align: 'right' },
        {
          key: 'estado',
          header: 'Estado',
          sortable: true,
          type: 'badge',
          badgeMap: {
            OK: 'bg-emerald-100 text-emerald-700',
            'Bajo mínimo': 'bg-amber-100 text-amber-700',
            'Sin stock': 'bg-rose-100 text-rose-700',
          },
        },
      ]}
    />
  );
}
