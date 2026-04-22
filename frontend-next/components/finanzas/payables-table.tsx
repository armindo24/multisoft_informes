import { DataTable } from '@/components/ui/data-table';
import { CuentaPagarRow } from '@/types/finanzas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function getProvider(row: CuentaPagarRow) {
  return String(row.RazonSocial || row.razonsocial || row.CodProv || row.codprov || 'Proveedor');
}

function getCurrency(row: CuentaPagarRow) {
  return String(row.Descrip || row.descrip || row.CodMoneda || row.codmoneda || '-');
}

export function PayablesTable({ rows }: { rows: CuentaPagarRow[] }) {
  const normalizedRows = rows.map((row) => ({
    proveedor: getProvider(row),
    moneda: getCurrency(row),
    saldoAnterior: num(row.SaldoAnterior || row.saldoanterior),
    creditos: num(row.TotalCredito || row.totalcredito),
    debitos: num(row.TotalDebito || row.totaldebito),
    saldo: num(row.Saldo || row.saldo),
  }));

  return (
    <DataTable
      title="Cuentas por pagar"
      subtitle="Saldos abiertos de proveedores dentro del período consultado."
      exportName="cuentas-por-pagar"
      rows={normalizedRows}
      initialPageSize={5}
      pageSizeOptions={[5, 10, 25, 50]}
      emptyMessage="No hay saldos pendientes para proveedores con este filtro."
      columns={[
        { key: 'proveedor', header: 'Proveedor', sortable: true },
        { key: 'moneda', header: 'Moneda', sortable: true },
        { key: 'saldoAnterior', header: 'Saldo anterior', sortable: true, type: 'currency', align: 'right' },
        { key: 'creditos', header: 'Créditos', sortable: true, type: 'currency', align: 'right' },
        { key: 'debitos', header: 'Débitos', sortable: true, type: 'currency', align: 'right' },
        { key: 'saldo', header: 'Saldo', sortable: true, type: 'currency', align: 'right' },
      ]}
    />
  );
}
