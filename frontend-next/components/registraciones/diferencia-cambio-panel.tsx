'use client';

import { useMemo, useState } from 'react';
import { Calculator, CalendarDays, CheckCircle2, FileText, Info, Search, X } from 'lucide-react';
import type { SelectOption } from '@/types/finanzas';

type DifferenceRow = {
  codplancta: string;
  codplanaux?: string;
  nombre: string;
  monedabase: string;
  saldogs: number;
  saldome: number;
};

type PreviewRow = {
  line: number;
  cuenta: string;
  auxiliar: string;
  concepto: string;
  debeMl: number;
  haberMl: number;
  debeMe: number;
  haberMe: number;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function startOfMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function formatNumber(value: number, decimals = 0) {
  return Number(value || 0).toLocaleString('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function toNumber(value: string) {
  const normalized = String(value || '').replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

export function DiferenciaCambioPanel({
  empresas,
  tipoAsientos,
  defaultEmpresa,
  defaultPeriodo,
}: {
  empresas: SelectOption[];
  tipoAsientos: SelectOption[];
  defaultEmpresa: string;
  defaultPeriodo: string;
}) {
  const [empresa, setEmpresa] = useState(defaultEmpresa);
  const [periodo, setPeriodo] = useState(defaultPeriodo);
  const [cuenta, setCuenta] = useState('');
  const [auxiliar, setAuxiliar] = useState('');
  const [fechaDesde, setFechaDesde] = useState(startOfMonth());
  const [fechaHasta, setFechaHasta] = useState(today());
  const [tipoCambio, setTipoCambio] = useState('');
  const [factorCambio, setFactorCambio] = useState('1,0000');
  const [recalcular, setRecalcular] = useState(false);
  const [cuentaDif, setCuentaDif] = useState('');
  const [auxiliarDif, setAuxiliarDif] = useState('');
  const [concepto, setConcepto] = useState('Diferencia de cambio');
  const [tipoAsiento, setTipoAsiento] = useState('');
  const [fechaAsiento, setFechaAsiento] = useState(today());
  const [rows, setRows] = useState<DifferenceRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const factor = toNumber(factorCambio) || 1;

  const rowsWithDifference = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        id: `${row.codplancta}|${row.codplanaux || ''}`,
        diferencia: Math.round(row.saldome * factor - row.saldogs),
      })),
    [rows, factor],
  );

  const selectedRows = rowsWithDifference.filter((row) => selected.has(row.id) && row.diferencia !== 0);
  const totalDifference = selectedRows.reduce((sum, row) => sum + row.diferencia, 0);

  const previewRows = useMemo<PreviewRow[]>(() => {
    const detail = selectedRows.map((row, index) => {
      const amount = Math.abs(row.diferencia);
      return {
        line: index + 1,
        cuenta: row.codplancta,
        auxiliar: row.codplanaux || '',
        concepto: `${concepto || 'Diferencia de cambio'} - ${row.nombre}`,
        debeMl: row.diferencia > 0 ? amount : 0,
        haberMl: row.diferencia < 0 ? amount : 0,
        debeMe: 0,
        haberMe: 0,
      };
    });

    if (totalDifference !== 0 && cuentaDif) {
      detail.push({
        line: detail.length + 1,
        cuenta: cuentaDif,
        auxiliar: auxiliarDif,
        concepto: `${concepto || 'Diferencia de cambio'} - Resultado por diferencia`,
        debeMl: totalDifference < 0 ? Math.abs(totalDifference) : 0,
        haberMl: totalDifference > 0 ? totalDifference : 0,
        debeMe: 0,
        haberMe: 0,
      });
    }

    return detail;
  }, [selectedRows, totalDifference, cuentaDif, auxiliarDif, concepto]);

  async function consultar() {
    setLoading(true);
    setMessage(null);

    const params = new URLSearchParams({
      empresa,
      periodo,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      recalcular: recalcular ? 'SI' : 'NO',
    });
    if (cuenta.trim()) params.set('cuenta', cuenta.trim());
    if (auxiliar.trim()) params.set('auxiliar', auxiliar.trim());

    const response = await fetch(`/api/registraciones/diferencia-cambio/consultar?${params.toString()}`, {
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: { rows?: DifferenceRow[] };
      message?: string;
    };

    if (!response.ok || !payload.ok) {
      setRows([]);
      setSelected(new Set());
      setMessage(payload.message || 'No se pudo consultar diferencia de cambio.');
      setLoading(false);
      return;
    }

    const nextRows = payload.data?.rows || [];
    setRows(nextRows);
    setSelected(new Set(nextRows.map((row) => `${row.codplancta}|${row.codplanaux || ''}`)));
    setMessage(nextRows.length ? `Se encontraron ${nextRows.length} cuenta(s) con saldo.` : 'No se encontraron cuentas con saldo para generar diferencia de cambio.');
    setLoading(false);
  }

  function toggleRow(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="diferencia-cambio" className="space-y-4 scroll-mt-28">
      <div className="grid gap-4 xl:grid-cols-[minmax(320px,1fr)_minmax(320px,1.1fr)]">
        <div className="card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-800">
            <Search className="h-4 w-4" />
            1. Parametros de busqueda
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Empresa</span>
              <select value={empresa} onChange={(event) => setEmpresa(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
                {empresas.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Periodo</span>
              <input value={periodo} onChange={(event) => setPeriodo(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Codigo de cuentas</span>
              <input value={cuenta} onChange={(event) => setCuenta(event.target.value)} placeholder="Ej: 112201" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Auxiliar</span>
              <input value={auxiliar} onChange={(event) => setAuxiliar(event.target.value)} placeholder="Ej: 0002" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Desde</span>
              <input type="date" value={fechaDesde} onChange={(event) => setFechaDesde(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Hasta</span>
              <input type="date" value={fechaHasta} onChange={(event) => setFechaHasta(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Tipo de cambio</span>
              <select value={tipoCambio} onChange={(event) => setTipoCambio(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
                <option value="">Seleccione...</option>
                <option value="COMPRA">Compra</option>
                <option value="VENTA">Venta</option>
                <option value="CIERRE">Cierre</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Factor de cambio</span>
              <input value={factorCambio} onChange={(event) => setFactorCambio(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-right" />
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={recalcular} onChange={(event) => setRecalcular(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Recalcular importes antes de consultar
          </label>
        </div>

        <div className="card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-800">
            <Calculator className="h-4 w-4" />
            2. Configuracion de diferencia de cambio
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Cuenta diferencia de cambio</span>
              <input value={cuentaDif} onChange={(event) => setCuentaDif(event.target.value)} placeholder="Ej: 552001" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Auxiliar</span>
              <input value={auxiliarDif} onChange={(event) => setAuxiliarDif(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Concepto</span>
              <input value={concepto} onChange={(event) => setConcepto(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Tipo de asiento</span>
              <select value={tipoAsiento} onChange={(event) => setTipoAsiento(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
                <option value="">Seleccione...</option>
                {tipoAsientos.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Fecha</span>
              <input type="date" value={fechaAsiento} onChange={(event) => setFechaAsiento(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-blue-700">
            <Info className="h-4 w-4" />
            Campos obligatorios
          </div>
        </div>
      </div>

      {message ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</div>
      ) : null}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
            <FileText className="h-4 w-4" />
            3. Cuentas con diferencia a generar
          </div>
          <span className="text-xs font-medium text-slate-500">Resultados encontrados: {rows.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-center">Generar</th>
                <th className="px-3 py-2 text-left">Codigo</th>
                <th className="px-3 py-2 text-left">Cod. Auxiliar</th>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Base</th>
                <th className="px-3 py-2 text-right">Moneda Local</th>
                <th className="px-3 py-2 text-right">Moneda Extranjera</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rowsWithDifference.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="h-4 w-4 rounded border-slate-300" />
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-900">{row.codplancta}</td>
                  <td className="px-3 py-2">{row.codplanaux || '-'}</td>
                  <td className="px-3 py-2">{row.nombre}</td>
                  <td className="px-3 py-2">{row.monedabase || '-'}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.saldogs)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.saldome, 2)}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Consulta saldos para ver las cuentas con diferencia.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-blue-800">
          <FileText className="h-4 w-4" />
          4. Vista previa del asiento contable
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Linea</th>
                <th className="px-3 py-2 text-left">Cuenta</th>
                <th className="px-3 py-2 text-left">Auxiliar</th>
                <th className="px-3 py-2 text-left">Concepto</th>
                <th className="px-3 py-2 text-right">Debe ML</th>
                <th className="px-3 py-2 text-right">Haber ML</th>
                <th className="px-3 py-2 text-right">Debe ME</th>
                <th className="px-3 py-2 text-right">Haber ME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewRows.map((row) => (
                <tr key={row.line}>
                  <td className="px-3 py-2">{row.line}</td>
                  <td className="px-3 py-2 font-medium text-slate-900">{row.cuenta}</td>
                  <td className="px-3 py-2">{row.auxiliar || '-'}</td>
                  <td className="px-3 py-2">{row.concepto}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.debeMl)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.haberMl)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.debeMe, 2)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.haberMe, 2)}</td>
                </tr>
              ))}
              {!previewRows.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">Selecciona cuentas y completa la cuenta de diferencia para previsualizar el asiento.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <button type="button" onClick={() => void consultar()} disabled={loading || !empresa || !periodo || !fechaDesde || !fechaHasta} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60">
          <Search className="h-4 w-4" />
          {loading ? 'Consultando...' : 'Consultar saldos'}
        </button>
        <button type="button" disabled={!previewRows.length} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-800 shadow-sm disabled:opacity-50">
          <FileText className="h-4 w-4" />
          Previsualizar asiento
        </button>
        <button type="button" disabled={!previewRows.length || !tipoAsiento || !fechaAsiento} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-50">
          <CheckCircle2 className="h-4 w-4" />
          Generar asiento
        </button>
        <a href="/registraciones" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          <X className="h-4 w-4" />
          Cancelar
        </a>
        <div className="ml-auto hidden items-center gap-2 text-xs text-slate-500 md:flex">
          <CalendarDays className="h-4 w-4" />
          {fechaAsiento}
        </div>
      </div>
    </section>
  );
}
