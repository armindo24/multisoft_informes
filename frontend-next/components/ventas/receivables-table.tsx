import { DataTable } from '@/components/ui/data-table';
import { CuentaCobrar } from '@/types/ventas';

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function ReceivablesTable({ rows }: { rows: CuentaCobrar[] }) {
  let saldoAcumulado = 0;
  let totalImporte = 0;
  let totalSaldo = 0;
  const normalizedRows = rows.map((row) => {
    const importe = num(row.importe);
    const saldo = num(row.saldo);
    totalImporte += importe;
    totalSaldo += saldo;
    saldoAcumulado += num(row.saldo);

    return {
      tipo: row.des_tp_comp ? `${row.cod_tp_comp || ''} - ${row.des_tp_comp}` : String(row.cod_tp_comp || '-'),
      comprobante: String(row.comp_numero || '-'),
      cuota: String(row.cuota_numero || '-'),
      cliente: String(row.razon_social || row.cod_cliente || '-'),
      emision: String(row.fecha_emi || '').slice(0, 10),
      vencimiento: String(row.fecha_ven || '').slice(0, 10),
      importe,
      saldo,
      saldoAcumulado,
    };
  });

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Total importe</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(totalImporte)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Total saldo</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(totalSaldo)}
          </p>
        </div>
      </section>

      <DataTable
        title="Cuentas por cobrar"
        subtitle="Documentos pendientes con estructura mas cercana al informe historico."
        exportName="cuentas-por-cobrar"
        rows={normalizedRows}
        columns={[
          { key: 'tipo', header: 'Tipo Comprobante', sortable: true },
          { key: 'comprobante', header: '# Comprobante', sortable: true },
          { key: 'cuota', header: 'Cuota', sortable: true },
          { key: 'cliente', header: 'Cliente', sortable: true },
          { key: 'emision', header: 'Emision', sortable: true, type: 'date' },
          { key: 'vencimiento', header: 'Vencimiento', sortable: true, type: 'date' },
          { key: 'importe', header: 'Importe', sortable: true, type: 'currency', align: 'right' },
          { key: 'saldo', header: 'Saldo', sortable: true, type: 'currency', align: 'right' },
          { key: 'saldoAcumulado', header: 'Saldo Acumulado', sortable: true, type: 'currency', align: 'right' },
        ]}
      />
    </div>
  );
}
