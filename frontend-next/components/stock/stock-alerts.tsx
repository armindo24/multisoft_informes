import { StockDepositoRow } from '@/types/stock';

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function StockAlerts({ rows }: { rows: StockDepositoRow[] }) {
  const alerts = rows
    .map((row) => ({
      article: row.cod_articulo || row.cod_original || '-',
      description: row.des_art || row.referencia || 'Sin descripción',
      deposito: row.cod_deposito || '-',
      existencia: toNumber(row.existencia),
      puntoPedido: toNumber(row.pto_pedido),
    }))
    .filter((row) => row.existencia <= row.puntoPedido)
    .sort((a, b) => a.existencia - b.existencia)
    .slice(0, 6);

  return (
    <section className="card p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Alertas de reposición</h2>
        <p className="mt-1 text-sm text-slate-500">Artículos en o por debajo del punto de pedido.</p>
      </div>
      <div className="space-y-3">
        {alerts.length ? alerts.map((item) => (
          <div key={`${item.article}-${item.deposito}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{item.article} · {item.description}</p>
                <p className="mt-1 text-sm text-slate-500">Depósito {item.deposito}</p>
              </div>
              <span className={`badge ${item.existencia <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                {item.existencia <= 0 ? 'Sin stock' : 'Bajo mínimo'}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">Existencia: {item.existencia.toLocaleString('es-PY')} · Punto de pedido: {item.puntoPedido.toLocaleString('es-PY')}</p>
          </div>
        )) : <p className="text-sm text-slate-500">No se detectaron alertas con los filtros actuales.</p>}
      </div>
    </section>
  );
}
