import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, Boxes, CreditCard, ShoppingCart, TrendingUp } from 'lucide-react';

const actions = [
  { href: '/ventas', label: 'Analizar ventas', description: 'Facturacion, ranking y cuentas por cobrar.', icon: TrendingUp },
  { href: '/stock', label: 'Controlar stock', description: 'Existencia por deposito y valorizado.', icon: Boxes },
  { href: '/finanzas', label: 'Revisar finanzas', description: 'Balance, flujo de caja y cuentas por pagar.', icon: CreditCard },
  { href: '/compras', label: 'Seguir compras', description: 'Ordenes y ranking de proveedores.', icon: ShoppingCart },
] as Array<{ href: Route; label: string; description: string; icon: typeof TrendingUp }>;

export function QuickActions() {
  return (
    <section className="card p-5">
      <h2 className="text-lg font-semibold text-slate-900">Acciones rapidas</h2>
      <p className="mt-1 text-sm text-slate-500">Accesos directos a los modulos ya migrados a Next.js.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-3 inline-flex rounded-xl bg-slate-900 p-2 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-slate-900">{action.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
