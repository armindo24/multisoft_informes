'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SelectOption } from '@/types/ventas';

export function SalesFilters({
  empresas,
  sucursales,
  tiposCliente,
  vendedores,
  calificaciones,
  condicionesVenta,
  cobradores,
  zonas,
  movimientosCobrar,
  current,
  showStatsFields,
  showReceivablesFields,
}: {
  empresas: SelectOption[];
  sucursales: SelectOption[];
  tiposCliente: SelectOption[];
  vendedores: SelectOption[];
  calificaciones: SelectOption[];
  condicionesVenta: SelectOption[];
  cobradores: SelectOption[];
  zonas: SelectOption[];
  movimientosCobrar: SelectOption[];
  current: Record<string, string>;
  showStatsFields: boolean;
  showReceivablesFields: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressValue, setProgressValue] = useState(18);
  const [agrupacion, setAgrupacion] = useState(current.agrupacion || 'clientes');
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
        className={[
          filtersOpen ? 'grid' : 'hidden',
          `card gap-3 p-3 md:grid ${showStatsFields || showReceivablesFields ? 'lg:grid-cols-5 xl:grid-cols-8' : 'lg:grid-cols-4 xl:grid-cols-8'}`,
        ].join(' ')}
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
          <select name="empresa" defaultValue={current.empresa} className={`w-full rounded-xl border border-slate-200 bg-white px-3 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'}`}>
            {empresas.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sucursal</label>
          <select name="sucursal" defaultValue={current.sucursal} className={`w-full rounded-xl border border-slate-200 bg-white px-3 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'}`}>
            <option value="">Todas</option>
            {sucursales.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Moneda</label>
          <select name="moneda" defaultValue={current.moneda} className={`w-full rounded-xl border border-slate-200 bg-white px-3 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'}`}>
            <option value="GS">Guaranies</option>
            <option value="US">Dolares</option>
          </select>
        </div>

        {!showReceivablesFields ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Agrupar por</label>
          <select name="order" defaultValue={current.order || 'cod_cliente'} className={`w-full rounded-xl border border-slate-200 bg-white px-3 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'}`}>
            <option value="cod_tp_comp">Comprobante</option>
            <option value="cod_cliente">Cliente</option>
            <option value="cod_vendedor">Vendedor</option>
          </select>
        </div>
        ) : null}

        {showReceivablesFields ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Calificacion</label>
              <select name="calificacion" defaultValue={current.calificacion} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
                <option value="">Todas</option>
                {calificaciones.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tipo Cliente</label>
              <select name="tipoCliente" defaultValue={current.tipoCliente} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
                <option value="">Todos</option>
                {tiposCliente.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cliente</label>
              <input name="cliente" defaultValue={current.cliente} placeholder="Codigo de cliente" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Movimiento</label>
              <select name="movimiento" defaultValue={current.movimiento} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
                <option value="">Todos</option>
                {movimientosCobrar.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Zona</label>
              <select name="zona" defaultValue={current.zona} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
                <option value="">Todas</option>
                {zonas.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cobrador</label>
              <select name="cobrador" defaultValue={current.cobrador} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
                <option value="">Todos</option>
                {cobradores.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </>
        ) : null}

        {showStatsFields ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Estadistica por</label>
            <select
              name="agrupacion"
              value={agrupacion}
              onChange={(event) => setAgrupacion(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]"
            >
              <option value="clientes">Clientes</option>
              <option value="articulos">Articulos</option>
              <option value="vendedores">Vendedores</option>
            </select>
          </div>
        ) : null}

        {showStatsFields ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tipo Cliente</label>
            <select name="tipo_cliente" defaultValue={current.tipo_cliente} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
              <option value="">Todos</option>
              {tiposCliente.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {showStatsFields && agrupacion === 'clientes' ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cliente</label>
            <input
              name="cliente"
              defaultValue={current.cliente}
              placeholder="Codigo de cliente"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]"
            />
          </div>
        ) : null}

        {showStatsFields && agrupacion === 'vendedores' ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Vendedor</label>
            <select name="vendedor" defaultValue={current.vendedor} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]">
              <option value="">Todos</option>
              {vendedores.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {showStatsFields && agrupacion === 'articulos' ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Articulo</label>
            <input
              name="articulo"
              defaultValue={current.articulo}
              placeholder="Codigo de articulo"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px]"
            />
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Desde</label>
          <input name="desde" type="date" defaultValue={current.desde} className={`w-full rounded-xl border border-slate-200 bg-white px-3 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'}`} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Hasta</label>
          <input name="hasta" type="date" defaultValue={current.hasta} className={`w-full rounded-xl border border-slate-200 bg-white px-3 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'}`} />
        </div>

        {showReceivablesFields ? (
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
            <input name="vencimiento" type="checkbox" defaultChecked={current.vencimiento === 'true'} className="size-4 rounded border-slate-300" />
            Filtrar por vencimiento
          </label>
        ) : null}

        <div className="flex items-end gap-2 lg:col-span-2 xl:col-span-8 xl:justify-end">
          <button disabled={isSubmitting || isPending} className={`rounded-xl bg-slate-900 px-4 ${showStatsFields || showReceivablesFields ? 'min-w-[120px] py-2 text-[13px]' : 'min-w-[140px] py-2 text-sm'} font-medium text-white disabled:cursor-wait disabled:opacity-80`}>
            {isSubmitting || isPending ? 'Aplicando...' : 'Aplicar'}
          </button>
          <Link href={showStatsFields ? '/ventas?agrupacion=clientes#estadisticas-ventas' : showReceivablesFields ? '/ventas?section=cuentas-cobrar#cuentas-cobrar' : '/ventas'} className={`rounded-xl border border-slate-200 px-4 ${showStatsFields || showReceivablesFields ? 'py-2 text-[13px]' : 'py-2 text-sm'} font-medium text-slate-700`}>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Procesando informe</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">Consultando datos comerciales y armando el resultado...</p>
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

                <div className="card grid gap-3 p-3 lg:grid-cols-4 xl:grid-cols-8">
                  {Array.from({ length: 10 }).map((_, index) => (
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
