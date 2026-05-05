'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SelectOption } from '@/types/compras';

export function PurchaseFilters({
  empresas,
  sucursales,
  departamentos,
  proveedores,
  tiposoc,
  current,
}: {
  empresas: SelectOption[];
  sucursales: SelectOption[];
  departamentos: SelectOption[];
  proveedores: SelectOption[];
  tiposoc: SelectOption[];
  current: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressValue, setProgressValue] = useState(18);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isSubmitting && !isPending) return;

    const timer = window.setInterval(() => {
      setProgressValue((currentValue) => {
        if (currentValue >= 92) return currentValue;
        return Math.min(92, currentValue + (currentValue < 60 ? 14 : 6));
      });
    }, 220);

    return () => window.clearInterval(timer);
  }, [isPending, isSubmitting]);

  useEffect(() => {
    if (!isPending) {
      setIsSubmitting(false);
      setProgressValue(18);
    }
  }, [isPending]);

  return (
    <>
      <button
        type="button"
        onClick={() => setFiltersOpen((currentValue) => !currentValue)}
        className="mb-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm md:hidden"
      >
        {filtersOpen ? 'Ocultar filtros' : 'Filtros'}
      </button>
      <form
        className={`${filtersOpen ? 'grid' : 'hidden'} card gap-3 p-3 md:grid md:grid-cols-2 xl:grid-cols-4`}
        onSubmit={(event) => {
          event.preventDefault();
          setProgressValue(18);
          setIsSubmitting(true);
          const formData = new FormData(event.currentTarget);
          const query = new URLSearchParams();
          formData.forEach((value, key) => {
            const normalized = String(value || '').trim();
            if (normalized) {
              query.set(key, normalized);
            }
          });
          query.set('section', current.section || 'compras-resumen');
          const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
          startTransition(() => {
            router.push(nextUrl as Route);
          });
        }}
      >
        <input type="hidden" name="section" value={current.section || 'compras-resumen'} />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Empresa</label>
          <select name="empresa" defaultValue={current.empresa} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            {empresas.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sucursal</label>
          <select name="sucursal" defaultValue={current.sucursal} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todas</option>
            {sucursales.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Departamento</label>
          <select name="departamento" defaultValue={current.departamento} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {departamentos.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Proveedor</label>
          <select name="proveedor" defaultValue={current.proveedor} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {proveedores.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Fecha Desde</label>
          <input name="compras_start" type="date" defaultValue={current.compras_start} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Fecha Hasta</label>
          <input name="compras_end" type="date" defaultValue={current.compras_end} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Agrupar por</label>
          <select name="agrupar" defaultValue={current.agrupar} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Normal</option>
            <option value="Cod_Tp_Comp">Comprobante</option>
            <option value="RazonSocial">Proveedor</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Moneda</label>
          <select name="moneda" defaultValue={current.moneda} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="GS">Local</option>
            <option value="US">Extranjera</option>
          </select>
        </div>
        <div className="md:col-span-2 xl:col-span-4 flex items-end justify-end gap-2 pt-1">
          <button disabled={isSubmitting || isPending} className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-80">
            {isSubmitting || isPending ? 'Aplicando...' : 'Aplicar'}
          </button>
          <Link href="/compras?section=compras-resumen#compras-resumen" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Limpiar</Link>
        </div>
      </form>

      {isSubmitting || isPending ? (
        <>
          <div className="pointer-events-none fixed right-6 top-24 z-40 w-full max-w-sm">
            <div className="rounded-2xl border border-cyan-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Procesando compras</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">Consultando compras, ordenes y rankings del periodo...</p>
                </div>
                <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">{progressValue}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-100">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 transition-all duration-200" style={{ width: `${progressValue}%` }} />
              </div>
            </div>
          </div>

          <div className="pointer-events-none fixed inset-x-0 bottom-0 top-[88px] z-30 overflow-hidden px-7 pb-8">
            <div className="h-full overflow-hidden rounded-[28px] bg-slate-50/94 backdrop-blur-[2px]">
              <div className="space-y-5 p-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-10 w-56 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full max-w-3xl animate-pulse rounded bg-slate-200" />
                </div>

                <div className="card grid gap-3 p-3 xl:grid-cols-8">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index}>
                      <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />
                      <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                    </div>
                  ))}
                </div>

                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="card p-5">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
