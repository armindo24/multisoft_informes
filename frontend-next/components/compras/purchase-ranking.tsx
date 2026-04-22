import { RankingCompraItem } from '@/types/compras';

function money(value: unknown) {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(safe);
}

export function PurchaseRanking({
  title,
  subtitle,
  items,
  mode,
}: {
  title: string;
  subtitle: string;
  items: RankingCompraItem[];
  mode: 'proveedor' | 'articulo';
}) {
  return (
    <div className="card p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-4 space-y-3">
        {items.length ? items.slice(0, 5).map((item, index) => {
          const label = mode === 'proveedor'
            ? (item.RazonSocial || item.CodProv || 'Sin proveedor')
            : (item.Des_Art || item.Cod_Articulo || 'Sin artículo');
          const total = mode === 'proveedor' ? item.TotalCompras : item.TotalItem;
          return (
            <div key={`${label}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">#{index + 1}</p>
                  <p className="font-medium text-slate-800">{label}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{money(total)}</p>
              </div>
            </div>
          );
        }) : <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">Sin datos para el filtro actual.</div>}
      </div>
    </div>
  );
}
