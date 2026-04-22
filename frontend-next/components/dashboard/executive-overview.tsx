import Link from 'next/link';
import type { Route } from 'next';

export type ExecutiveModuleStatus = {
  name: string;
  href: Route;
  status: 'Conectado' | 'Sin datos' | 'Pendiente';
  detail: string;
};

const statusClasses: Record<ExecutiveModuleStatus['status'], string> = {
  Conectado: 'bg-emerald-100 text-emerald-700',
  'Sin datos': 'bg-amber-100 text-amber-700',
  Pendiente: 'bg-slate-100 text-slate-700',
};

export function ExecutiveOverview({ items }: { items: ExecutiveModuleStatus[] }) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Estado de módulos</h2>
          <p className="mt-1 text-sm text-slate-500">Resumen rápido del avance de migración y conectividad del nuevo frontend.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
              </div>
              <span className={`badge ${statusClasses[item.status]}`}>{item.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
