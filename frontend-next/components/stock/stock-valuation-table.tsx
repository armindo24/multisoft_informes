import { DataTable } from '@/components/ui/data-table';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { StockValorizadoRow } from '@/types/stock';

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function StockValuationTable({
  rows,
  exportBranding,
  scheduleConfig,
}: {
  rows: StockValorizadoRow[];
  currencyLabel: string;
  exportBranding?: ExportBrandingOverride;
  scheduleConfig?: {
    reportKey: string;
    reportModule: string;
    reportParams?: Record<string, string>;
  };
}) {
  const normalizedRows = rows.map((row) => {
    const costo = toNumber(row.costo);
    const existencia = toNumber(row.total_existencia);
    return {
      articulo: String(row.cod_articulo || row.cod_original || '-'),
      descripcion: String(row.des_art || '-'),
      sucursal: String(row.des_sucursal || row.cod_sucursal || '-'),
      deposito: String(row.des_deposito || row.cod_deposito || '-'),
      existencia,
      costo,
      valorTotal: costo * existencia,
    };
  });

  return (
    <DataTable
      title="Stock valorizado"
      subtitle="Resumen financiero del inventario usando el costeo elegido por el backend actual."
      exportName="stock-valorizado"
      rows={normalizedRows}
      exportBranding={exportBranding}
      taskModule="Stock"
      scheduleConfig={scheduleConfig}
      emptyMessage="No hay datos valorizados para el filtro seleccionado."
      columns={[
        { key: 'articulo', header: 'Artículo', sortable: true },
        { key: 'descripcion', header: 'Descripción', sortable: true },
        { key: 'sucursal', header: 'Sucursal', sortable: true },
        { key: 'deposito', header: 'Depósito', sortable: true },
        { key: 'existencia', header: 'Existencia', sortable: true, type: 'number', align: 'right' },
        { key: 'costo', header: 'Costo', sortable: true, type: 'currency', align: 'right' },
        { key: 'valorTotal', header: 'Valor total', sortable: true, type: 'currency', align: 'right' },
      ]}
    />
  );
}
