'use client';

import { useEffect, useMemo, useState } from 'react';
import { CashflowSummary } from '@/components/finanzas/cashflow-summary';

type FlowSection = Array<Record<string, Array<Record<string, unknown>>>>;

const flowcashCache = new Map<string, FlowSection>();
const flowcashPending = new Map<string, Promise<FlowSection>>();

function buildFlowcashUrl(params: { empresa: string; periodo: string; mes: string }) {
  return `/proxy/flowcash/${params.periodo}/${params.empresa}/${params.mes}`;
}

function extractSections(data: FlowSection | undefined | null) {
  const sections = data || [];

  return {
    saldos: sections.find((item) => 'saldos' in item)?.saldos || [],
    movimientos: sections.find((item) => 'movimientos' in item)?.movimientos || [],
    descuentos: sections.find((item) => 'descuentos' in item)?.descuentos || [],
    bancos: sections.find((item) => 'bancos' in item)?.bancos || [],
  };
}

async function loadFlowcash(url: string, signal?: AbortSignal) {
  if (flowcashCache.has(url)) {
    return flowcashCache.get(url) || [];
  }

  if (flowcashPending.has(url)) {
    return flowcashPending.get(url) || Promise.resolve([]);
  }

  const request = fetch(url, {
    cache: 'no-store',
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = (await response.json()) as { data?: FlowSection };
      const rows = payload.data || [];
      flowcashCache.set(url, rows);
      flowcashPending.delete(url);
      return rows;
    })
    .catch((error: unknown) => {
      flowcashPending.delete(url);
      throw error;
    });

  flowcashPending.set(url, request);
  return request;
}

export function CashflowSummaryAsync({
  empresa,
  periodo,
  mes,
  autoload = true,
}: {
  empresa: string;
  periodo: string;
  mes: string;
  autoload?: boolean;
}) {
  const [data, setData] = useState<FlowSection | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(empresa && autoload ? 'loading' : 'idle');
  const [enabled, setEnabled] = useState(autoload);
  const url = useMemo(() => buildFlowcashUrl({ empresa, periodo, mes }), [empresa, periodo, mes]);

  useEffect(() => {
    if (!empresa) {
      setData(null);
      setStatus('idle');
      return;
    }
    setEnabled(autoload);
    setStatus(autoload ? 'loading' : 'idle');
  }, [empresa, autoload, url]);

  useEffect(() => {
    if (!empresa || !enabled) {
      if (!empresa) {
        setData(null);
      }
      return;
    }

    const controller = new AbortController();
    setStatus('loading');

    loadFlowcash(url, controller.signal)
      .then((payload) => {
        setData(payload || []);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Flowcash async error:', error);
        setData([]);
        setStatus('error');
      });

    return () => controller.abort();
  }, [empresa, enabled, url]);

  if (status === 'idle') {
    return (
      <div className="card p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Flujo de caja mensual</h2>
            <p className="mt-1 text-sm text-slate-500">Este bloque queda bajo demanda para acelerar el dashboard de finanzas.</p>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(true)}
            className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
          >
            Cargar flujo
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900">Flujo de caja mensual</h2>
        <p className="mt-1 text-sm text-slate-500">Preparando resumen financiero del periodo seleccionado.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 p-4">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900">Flujo de caja mensual</h2>
        <p className="mt-1 text-sm text-slate-500">No se pudo cargar el resumen de flowcash para este filtro.</p>
      </div>
    );
  }

  const sections = extractSections(data);
  return (
    <CashflowSummary
      saldos={sections.saldos}
      movimientos={sections.movimientos}
      descuentos={sections.descuentos}
      bancos={sections.bancos}
    />
  );
}
