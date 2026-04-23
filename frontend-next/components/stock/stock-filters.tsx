'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SelectOption } from '@/types/stock';

export function StockFilters({
  empresas,
  sucursales,
  depositos,
  familias,
  grupos,
  tipos,
  current,
}: {
  empresas: SelectOption[];
  sucursales: SelectOption[];
  depositos: SelectOption[];
  familias: SelectOption[];
  grupos: SelectOption[];
  tipos: SelectOption[];
  current: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressValue, setProgressValue] = useState(18);

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
      <form
        className="card grid gap-3 p-4 xl:grid-cols-8"
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
          const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
          startTransition(() => {
            router.push(nextUrl as Route);
          });
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Empresa</label>
          <select name="empresa" defaultValue={current.empresa} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            {empresas.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sucursal</label>
          <select name="sucursal" defaultValue={current.sucursal} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todas</option>
            {sucursales.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Deposito</label>
          <select name="deposito" defaultValue={current.deposito} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {depositos.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Familia</label>
          <select name="familia" defaultValue={current.familia} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todas</option>
            {familias.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Grupo</label>
          <select name="grupo" defaultValue={current.grupo} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {grupos.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
          <select name="tipo" defaultValue={current.tipo} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {tipos.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Moneda</label>
          <select name="moneda" defaultValue={current.moneda} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="L">Guaranies</option>
            <option value="E">Dolares</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Existencia</label>
          <select name="existencia" defaultValue={current.existencia} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todas</option>
            <option value="mayor">Mayor a 0</option>
            <option value="igual">Igual a 0</option>
            <option value="menor">Menor a 0</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Estado</label>
          <select name="estado" defaultValue={current.estado} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </select>
        </div>
        <div className="xl:col-span-7 flex items-end gap-2 justify-end">
          <button disabled={isSubmitting || isPending} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-80">
            {isSubmitting || isPending ? 'Aplicando...' : 'Aplicar'}
          </button>
          <Link href="/stock" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Limpiar
          </Link>
        </div>
      </form>

      {isSubmitting || isPending ? (
        <>
          <div className="pointer-events-none fixed right-6 top-24 z-40 w-full max-w-sm">
            <div className="rounded-2xl border border-cyan-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Procesando stock</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">Consultando existencias, valorizado y alertas del deposito...</p>
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

                <div className="card grid gap-3 p-4 xl:grid-cols-8">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index}>
                      <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />
                      <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                    </div>
                  ))}
                </div>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
