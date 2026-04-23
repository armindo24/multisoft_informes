'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SelectOption } from '@/types/stock';

export function StockCostoArticuloFullFilters({
  empresas,
  tipos,
  current,
}: {
  empresas: SelectOption[];
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
        id="costo-articulo-full"
        className="card grid gap-3 p-4 xl:grid-cols-8"
        onSubmit={(event) => {
          event.preventDefault();
          setProgressValue(18);
          setIsSubmitting(true);
          const formData = new FormData(event.currentTarget);
          const query = new URLSearchParams();
          formData.forEach((value, key) => {
            const normalized = String(value || '').trim();
            if (normalized) query.set(key, normalized);
          });
          const fechad = query.get('fechad') || '';
          const fechah = query.get('fechah') || '';
          if (fechad && fechah && fechad > fechah) {
            query.set('fechad', fechah);
            query.set('fechah', fechad);
          }
          const normalizedDesde = query.get('fechad') || query.get('fechah') || '';
          const normalizedHasta = query.get('fechah') || query.get('fechad') || '';
          const fechaBase = normalizedDesde || normalizedHasta;
          if (fechaBase && /^\d{4}-\d{2}-\d{2}$/.test(fechaBase)) {
            const [year, month] = fechaBase.split('-');
            query.set('periodo', `${year}${month}`);
            query.set('anho', year);
          }
          if (normalizedDesde || normalizedHasta) {
            query.set('fecha_inicio_desde', normalizedDesde);
            query.set('fecha_inicio_hasta', normalizedHasta);
            query.set('fecha_fin_desde', normalizedDesde);
            query.set('fecha_fin_hasta', normalizedHasta);
          }
          if (query.get('ecuacion_mat') === 'S') {
            query.set('recalcular', 'S');
          }
          query.set('section', 'costo-articulo-full');
          query.set('submitted', '1');
          const nextUrl = `${pathname}?${query.toString()}#costo-articulo-full`;
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Articulo</label>
          <input name="articulo" defaultValue={current.articulo} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Codigo articulo" />
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Estado</label>
          <select name="estado" defaultValue={current.estado} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
            <option value="T">Todos heredado</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Fecha desde</label>
          <input type="date" name="fechad" defaultValue={current.fechad} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Fecha hasta</label>
          <input type="date" name="fechah" defaultValue={current.fechah} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" name="calcular_empresa" value="S" defaultChecked={current.calcular_empresa === 'S'} />
          Calcular toda empresa
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" name="ecuacion_mat" value="S" defaultChecked={current.ecuacion_mat === 'S'} />
          Ecuacion BC materiales
        </label>
        <div className="xl:col-span-8 flex items-end gap-2 justify-end">
          <button
            type="submit"
            id="btn-procesar-costo-articulo-full"
            disabled={isSubmitting || isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-80"
          >
            {isSubmitting || isPending ? 'Procesando...' : 'Procesar'}
          </button>
          <Link href="/stock?section=costo-articulo-full#costo-articulo-full" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Limpiar
          </Link>
        </div>
      </form>

      {isSubmitting || isPending ? (
        <div className="pointer-events-none fixed right-6 top-24 z-40 w-full max-w-sm">
          <div className="rounded-2xl border border-cyan-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Procesando stock</p>
                <p className="mt-1 text-sm font-medium text-slate-900">Procesando costo articulo full...</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">{progressValue}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-100">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 transition-all duration-200" style={{ width: `${progressValue}%` }} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
