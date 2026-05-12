'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator, CalendarDays, CheckCircle2, FileText, Info, Search, X } from 'lucide-react';
import type { AccountPlanOption, AuxiliarOption, SelectOption } from '@/types/finanzas';

type DifferenceRow = {
  codplancta: string;
  codplanaux?: string;
  nombre: string;
  monedabase: string;
  saldogs: number;
  saldome: number;
};

type PreviewRow = {
  linea: number;
  codplancta: string;
  codplanaux: string;
  dbcr: 'D' | 'C';
  importe: number;
  importeme: number;
  concepto: string;
};

type InitPayload = {
  moneda_local?: { descrip?: string; cantdecimal?: number };
  moneda_extranjera?: { descrip?: string; cantdecimal?: number };
  tipo_asientos?: Array<{ tipoasiento?: string; descrip?: string }>;
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

function normalizeAccountOption(item: Record<string, string>): AccountPlanOption {
  const value = String(item.CodPlanCta || item.codplancta || item.codigo || item.value || '').trim();
  const nivel = String(item.nivel || item.Nivel || '').trim();
  const name = String(item.Nombre || item.nombre || item.descripcion || '').trim() || value;
  return {
    value,
    label: value && name ? `${value} - ${name}` : value,
    name,
    imputable: String(item.imputable || item.Imputable || '').trim(),
    auxiliar: String(item.auxiliar || item.Auxiliar || '').trim(),
    moneda: String(item.codmoneda || item.CodMoneda || '').trim(),
    nivel,
  };
}

function normalizeAuxOption(item: Record<string, string>): AuxiliarOption {
  const rawValue = item.CodPlanAux || item.codplanaux || item.codigo || item.value || '';
  const accountCode = String(rawValue).includes('-') ? String(rawValue).split('-').slice(1).join('-').trim() : String(item.CodPlanCta || item.codplancta || '');
  const auxCode = String(rawValue).includes('-') ? String(rawValue).split('-')[0].trim() : String(rawValue || '').trim();
  const rawLabel = item.Nombre || item.nombre || item.descripcion || item.label || auxCode;
  const cleaned = String(rawLabel || '').replace(/^.+?\s*-\s*/, '').trim();
  return {
    value: auxCode,
    label: cleaned ? `${auxCode} - ${cleaned}` : auxCode,
    auxCode,
    accountCode,
    name: cleaned || auxCode,
  };
}

export function DiferenciaCambioPanel({
  empresas,
  tipoAsientos,
  accountOptions,
  auxOptions,
  defaultEmpresa,
  defaultPeriodo,
}: {
  empresas: SelectOption[];
  tipoAsientos: SelectOption[];
  accountOptions: AccountPlanOption[];
  auxOptions: AuxiliarOption[];
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
  const [monedaLocalLabel, setMonedaLocalLabel] = useState('Moneda Local');
  const [monedaExtranjeraLabel, setMonedaExtranjeraLabel] = useState('Moneda Extranjera');
  const [monedaLocalDecimals, setMonedaLocalDecimals] = useState(0);
  const [monedaExtranjeraDecimals, setMonedaExtranjeraDecimals] = useState(2);
  const [tipoAsientoOptions, setTipoAsientoOptions] = useState<SelectOption[]>(tipoAsientos);
  const [rows, setRows] = useState<DifferenceRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [localAccountOptions, setLocalAccountOptions] = useState<AccountPlanOption[]>(accountOptions);
  const [localAuxOptions, setLocalAuxOptions] = useState<AuxiliarOption[]>(auxOptions);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const [accountPickerSearch, setAccountPickerSearch] = useState('');
  const [auxPickerOpen, setAuxPickerOpen] = useState(false);
  const [auxPickerSearch, setAuxPickerSearch] = useState('');

  const factor = toNumber(factorCambio) || 1;

  const filteredAccounts = useMemo(() => {
    const term = accountPickerSearch.trim().toLowerCase();
    if (!term) return localAccountOptions;
    return localAccountOptions.filter((option) =>
      option.value.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.moneda.toLowerCase().includes(term),
    );
  }, [localAccountOptions, accountPickerSearch]);

  const filteredAuxOptions = useMemo(() => {
    const accountCode = cuenta.trim();
    const term = auxPickerSearch.trim().toLowerCase();
    const scoped = localAuxOptions.filter((option) => !accountCode || option.accountCode === accountCode);
    if (!term) return scoped;
    return scoped.filter((option) =>
      option.auxCode.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term),
    );
  }, [localAuxOptions, auxPickerSearch, cuenta]);

  function openAccountPicker() {
    setAccountPickerSearch('');
    setAccountPickerOpen(true);
  }

  function selectAccount(option: AccountPlanOption) {
    setCuenta(option.value);
    setAuxiliar('');
    setAccountPickerOpen(false);
  }

  function openAuxPicker() {
    if (!cuenta.trim()) {
      setMessage('Debe cargar primeramente la Cuenta Contable.');
      return;
    }
    setAuxPickerSearch('');
    setAuxPickerOpen(true);
  }

  function selectAux(option: AuxiliarOption) {
    setAuxiliar(option.auxCode);
    setAuxPickerOpen(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInit() {
      if (!empresa || !periodo) return;

      const params = new URLSearchParams({ empresa, periodo });
      const response = await fetch(`/api/registraciones/diferencia-cambio/init?${params.toString()}`, {
        cache: 'no-store',
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: InitPayload };

      if (cancelled || !response.ok || !payload.ok) return;

      const local = payload.data?.moneda_local || {};
      const extranjera = payload.data?.moneda_extranjera || {};
      const nextTipos = (payload.data?.tipo_asientos || [])
        .map((item) => {
          const value = String(item.tipoasiento || '').trim();
          const label = String(item.descrip || value).trim();
          return { value, label: value && label && value !== label ? `${value} - ${label}` : label || value };
        });

      setMonedaLocalLabel(String(local.descrip || 'Moneda Local'));
      setMonedaExtranjeraLabel(String(extranjera.descrip || 'Moneda Extranjera'));
      setMonedaLocalDecimals(Number(local.cantdecimal ?? 0));
      setMonedaExtranjeraDecimals(Number(extranjera.cantdecimal ?? 2));
      setTipoAsientoOptions(nextTipos.length ? nextTipos : tipoAsientos);
    }

    void loadInit();

    return () => {
      cancelled = true;
    };
  }, [empresa, periodo, tipoAsientos]);

  useEffect(() => {
    let cancelled = false;

    async function loadPickers() {
      if (!empresa || !periodo) return;

      const [accountsPayload, auxPayload] = await Promise.all([
        fetch(`/proxy/cuenta/plancta/${encodeURIComponent(empresa)}/${encodeURIComponent(periodo)}`, { cache: 'no-store' }).then((response) => response.json()).catch(() => ({ data: [] })),
        fetch(`/proxy/cuentaauxi/select/${encodeURIComponent(empresa)}/${encodeURIComponent(periodo)}`, { cache: 'no-store' }).then((response) => response.json()).catch(() => ({ data: [] })),
      ]);

      if (cancelled) return;

      const accountRows = Array.isArray(accountsPayload?.data) ? accountsPayload.data as Array<Record<string, string>> : [];
      const auxRows = Array.isArray(auxPayload?.data) ? auxPayload.data as Array<Record<string, string>> : [];
      const seenAccounts = new Set<string>();
      const seenAux = new Set<string>();

      setLocalAccountOptions(accountRows.map(normalizeAccountOption).filter((option) => {
        if (!option.value || seenAccounts.has(option.value)) return false;
        seenAccounts.add(option.value);
        return true;
      }));

      setLocalAuxOptions(auxRows.map(normalizeAuxOption).filter((option) => {
        const key = `${option.auxCode}:${option.accountCode}`;
        if (!option.value || seenAux.has(key)) return false;
        seenAux.add(key);
        return true;
      }));
    }

    void loadPickers();

    return () => {
      cancelled = true;
    };
  }, [empresa, periodo]);

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
        linea: index + 1,
        codplancta: row.codplancta,
        codplanaux: row.codplanaux || '',
        dbcr: row.diferencia > 0 ? 'D' as const : 'C' as const,
        importe: amount,
        importeme: 0,
        concepto: `${concepto || 'Diferencia de cambio'} - ${row.nombre}`,
      };
    });

    if (totalDifference !== 0 && cuentaDif) {
      detail.push({
        linea: detail.length + 1,
        codplancta: cuentaDif,
        codplanaux: auxiliarDif,
        dbcr: totalDifference > 0 ? 'C' : 'D',
        importe: Math.abs(totalDifference),
        importeme: 0,
        concepto: `${concepto || 'Diferencia de cambio'} - Resultado por diferencia`,
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
              <div className="flex gap-2">
                <input value={cuenta} onChange={(event) => setCuenta(event.target.value)} placeholder="Ej: 112201" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2" />
                <button type="button" onClick={openAccountPicker} className="inline-flex items-center justify-center rounded-lg border border-cyan-200 bg-white px-3 text-cyan-800 transition hover:bg-cyan-50" title="Buscar cuenta contable">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Auxiliar</span>
              <div className="flex gap-2">
                <input value={auxiliar} onChange={(event) => setAuxiliar(event.target.value)} placeholder="Ej: 0002" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2" />
                <button type="button" onClick={openAuxPicker} className="inline-flex items-center justify-center rounded-lg border border-cyan-200 bg-white px-3 text-cyan-800 transition hover:bg-cyan-50" title="Buscar auxiliar">
                  <Search className="h-4 w-4" />
                </button>
              </div>
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
                {tipoAsientoOptions.map((item) => (
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
                <th className="px-3 py-2 text-right">{monedaLocalLabel}</th>
                <th className="px-3 py-2 text-right">{monedaExtranjeraLabel}</th>
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
                  <td className="px-3 py-2 text-right">{formatNumber(row.saldogs, monedaLocalDecimals)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.saldome, monedaExtranjeraDecimals)}</td>
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
                <th className="px-3 py-2 text-left">CodPlanCta</th>
                <th className="px-3 py-2 text-left">CodPlanAux</th>
                <th className="px-3 py-2 text-center">DBCR</th>
                <th className="px-3 py-2 text-right">Importe</th>
                <th className="px-3 py-2 text-right">Importe ME</th>
                <th className="px-3 py-2 text-left">Concepto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewRows.map((row) => (
                <tr key={row.linea}>
                  <td className="px-3 py-2">{row.linea}</td>
                  <td className="px-3 py-2 font-medium text-slate-900">{row.codplancta}</td>
                  <td className="px-3 py-2">{row.codplanaux || '-'}</td>
                  <td className="px-3 py-2 text-center font-semibold">{row.dbcr}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.importe)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(row.importeme, monedaExtranjeraDecimals)}</td>
                  <td className="px-3 py-2">{row.concepto}</td>
                </tr>
              ))}
              {!previewRows.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Selecciona cuentas y completa la cuenta de diferencia para previsualizar el asiento.</td>
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

      {accountPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Elegir cuenta contable</h3>
                <p className="mt-1 text-sm text-slate-500">Busca por codigo o nombre de la cuenta.</p>
              </div>
              <button type="button" onClick={() => setAccountPickerOpen(false)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                Cerrar
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <input
                autoFocus
                value={accountPickerSearch}
                onChange={(event) => setAccountPickerSearch(event.target.value)}
                placeholder="Buscar por codigo o nombre..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <div className="max-h-[26rem] overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-slate-700">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left">Codigo</th>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-center">Imp</th>
                      <th className="px-4 py-3 text-center">Aux</th>
                      <th className="px-4 py-3 text-center">Mon</th>
                      <th className="px-4 py-3 text-center">Nivel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.length ? filteredAccounts.map((option) => (
                      <tr
                        key={option.value}
                        className="cursor-pointer border-b border-slate-100 hover:bg-cyan-50"
                        onClick={() => selectAccount(option)}
                        onDoubleClick={() => selectAccount(option)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{option.value}</td>
                        <td className="px-4 py-3 text-slate-700">{option.name}</td>
                        <td className="px-4 py-3 text-center text-slate-700">{option.imputable || '-'}</td>
                        <td className="px-4 py-3 text-center text-slate-700">{option.auxiliar || '-'}</td>
                        <td className="px-4 py-3 text-center text-slate-700">{option.moneda || '-'}</td>
                        <td className="px-4 py-3 text-center text-slate-700">{option.nivel || '-'}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Sin cuentas para mostrar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {auxPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Elegir auxiliar</h3>
                <p className="mt-1 text-sm text-slate-500">Auxiliares disponibles para la cuenta {cuenta}.</p>
              </div>
              <button type="button" onClick={() => setAuxPickerOpen(false)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                Cerrar
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <input
                autoFocus
                value={auxPickerSearch}
                onChange={(event) => setAuxPickerSearch(event.target.value)}
                placeholder="Buscar por codigo o nombre..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <div className="max-h-[26rem] overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-slate-700">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left">Auxiliar</th>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-left">Cuenta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuxOptions.length ? filteredAuxOptions.map((option) => (
                      <tr
                        key={`${option.auxCode}:${option.accountCode}`}
                        className="cursor-pointer border-b border-slate-100 hover:bg-cyan-50"
                        onClick={() => selectAux(option)}
                        onDoubleClick={() => selectAux(option)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{option.auxCode}</td>
                        <td className="px-4 py-3 text-slate-700">{option.name}</td>
                        <td className="px-4 py-3 text-slate-700">{option.accountCode}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Sin auxiliares para esta cuenta.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
