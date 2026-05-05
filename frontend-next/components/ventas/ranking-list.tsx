import { RankingItem } from '@/types/ventas';
import { EmptyState } from '@/components/ui/empty-state';

function money(value: number) {
  return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(value || 0);
}

export function RankingList({ title, subtitle, items }: { title: string; subtitle: string; items: RankingItem[] }) {
  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-4 space-y-3">
        {items.length ? items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="rounded-xl border border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">#{index + 1}</p>
                <p className="font-medium text-slate-800">{item.label}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{money(item.total)}</p>
            </div>
          </div>
        )) : <EmptyState title="Sin ranking" description="No hay datos para este ranking." />}
      </div>
    </div>
  );
}
