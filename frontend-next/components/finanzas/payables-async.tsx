'use client';

import { useEffect, useMemo, useState } from 'react';
import { PayablesTable } from '@/components/finanzas/payables-table';
import { KpiCard } from '@/components/ui/kpi-card';
import type { CuentaPagarRow } from '@/types/finanzas';

const payablesCache = new Map<string, CuentaPagarRow[]>();
const payablesPending = new Map<string, Promise<CuentaPagarRow[]>>();

function buildUrl(params: {
  empresa: string;
  periodo: string;
  comprasStart: string;
  comprasEnd: string;
}) {
  const search = new URLSearchParams({
    empresa: params.empresa,
    periodo: params.periodo,
    compras_start: params.comprasStart,
    compras_end: params.comprasEnd,
  });

  return `/api/finanzas/payables?${search.toString()}`;
}

function toNumber(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? '').trim();
  if (!raw) {
    return 0;
  }

  const normalized = raw
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(/,(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');

  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function formatKpiAmount(value: number) {
  const abs = Math.abs(value);
  const integerDigits = Math.trunc(abs).toString().length;
  const shouldRound = integerDigits > 6;
  const normalized = shouldRound ? Math.round(value) : Number(value.toFixed(2));

  return normalized.toLocaleString('es-PY', {
    minimumFractionDigits: shouldRound ? 0 : Number.isInteger(normalized) ? 0 : 2,
    maximumFractionDigits: shouldRound ? 0 : 2,
  });
}

async function loadPayables(url: string) {
  if (payablesCache.has(url)) {
    return payablesCache.get(url) || [];
  }

  if (payablesPending.has(url)) {
    return payablesPending.get(url) || Promise.resolve([]);
  }

  const request = fetch(url, {
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = (await response.json()) as { data?: CuentaPagarRow[] };
      const rows = Array.isArray(payload.data) ? payload.data : [];
      payablesCache.set(url, rows);
      payablesPending.delete(url);
      return rows;
    })
    .catch((error: unknown) => {
      payablesPending.delete(url);
      throw error;
    });

  payablesPending.set(url, request);
  return request;
}

function getPayablesLoadState(url: string) {
  if (payablesCache.has(url)) return 'ready' as const;
  if (payablesPending.has(url)) return 'loading' as const;
  return 'idle' as const;
}

export function PayablesKpiAsync({
  empresa,
  periodo,
  comprasStart,
  comprasEnd,
}: {
  empresa: string;
  periodo: string;
  comprasStart: string;
  comprasEnd: string;
}) {
  const [rows, setRows] = useState<CuentaPagarRow[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const url = useMemo(() => buildUrl({ empresa, periodo, comprasStart, comprasEnd }), [empresa, periodo, comprasStart, comprasEnd]);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    loadPayables(url)
      .then((nextRows) => {
        if (cancelled) return;
        setRows(nextRows);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Payables KPI async error:', error);
        setRows([]);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (status !== 'error') return;

    const timer = window.setInterval(() => {
      if (payablesCache.has(url)) {
        setRows(payablesCache.get(url) || []);
        setStatus('ready');
      }
    }, 300);

    return () => window.clearInterval(timer);
  }, [status, url]);

  const total = useMemo(
    () => rows.reduce((acc, row) => acc + toNumber(row.Saldo || row.saldo), 0),
    [rows],
  );

  if (status === 'loading') {
    return <KpiCard item={{ title: 'Cuentas por pagar', value: '...', change: 'Cargando', trend: 'neutral' }} />;
  }

  if (status === 'error') {
    return <KpiCard item={{ title: 'Cuentas por pagar', value: '0', change: 'Sin datos', trend: 'neutral' }} />;
  }

  return (
    <KpiCard
      item={{
        title: 'Cuentas por pagar',
        value: formatKpiAmount(total),
        change: rows.length ? `${rows.length} proveedores` : 'Sin saldos',
        trend: total > 0 ? 'neutral' : 'up',
      }}
    />
  );
}

export function PayablesTableAsync({
  empresa,
  periodo,
  comprasStart,
  comprasEnd,
  autoload = true,
}: {
  empresa: string;
  periodo: string;
  comprasStart: string;
  comprasEnd: string;
  autoload?: boolean;
}) {
  const [rows, setRows] = useState<CuentaPagarRow[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(autoload ? 'loading' : 'idle');
  const url = useMemo(() => buildUrl({ empresa, periodo, comprasStart, comprasEnd }), [empresa, periodo, comprasStart, comprasEnd]);
  const [enabled, setEnabled] = useState(autoload);
  const [preloadState, setPreloadState] = useState<'idle' | 'loading' | 'ready'>(() => getPayablesLoadState(url));

  useEffect(() => {
    setPreloadState(getPayablesLoadState(url));

    if (autoload) return;

    const timer = window.setInterval(() => {
      setPreloadState((current) => {
        const next = getPayablesLoadState(url);
        return current === next ? current : next;
      });
    }, 300);

    return () => window.clearInterval(timer);
  }, [autoload, url]);

  useEffect(() => {
    setEnabled(autoload);
    setStatus(autoload ? 'loading' : 'idle');
  }, [autoload, url]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setStatus('loading');

    loadPayables(url)
      .then((nextRows) => {
        if (cancelled) return;
        setRows(nextRows);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Payables table async error:', error);
        setRows([]);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, url]);

  if (status === 'idle') {
    return (
      <div className="card p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Cuentas por pagar</h2>
            <p className="mt-1 text-sm text-slate-500">
              {preloadState === 'loading'
                ? 'Preparando proveedores en segundo plano para que la apertura sea mas rapida.'
                : 'Este bloque queda bajo demanda para acelerar el dashboard de finanzas.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(true)}
            className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
          >
            {preloadState === 'ready' ? 'Ver proveedores' : preloadState === 'loading' ? 'Abrir al finalizar carga' : 'Cargar proveedores'}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900">Cuentas por pagar</h2>
        <p className="mt-1 text-sm text-slate-500">Preparando saldos de proveedores para el periodo seleccionado.</p>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900">Cuentas por pagar</h2>
        <p className="mt-1 text-sm text-slate-500">No se pudo cargar este bloque con el filtro actual.</p>
      </div>
    );
  }

  return <PayablesTable rows={rows} />;
}
