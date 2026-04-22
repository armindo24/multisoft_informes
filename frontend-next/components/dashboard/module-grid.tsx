import Link from 'next/link';
import type { ModuleSummary } from '@/types/dashboard';

export function ModuleGrid({ items }: { items: ModuleSummary[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <Link key={item.id} href={item.href} className="card p-5 transition hover:-translate-y-0.5 hover:border-teal-300">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
            <span className="badge bg-slate-100 text-slate-700">Módulo</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {item.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
