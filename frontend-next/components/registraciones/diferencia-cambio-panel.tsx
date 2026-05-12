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
  moneda_local?: { codmoneda?: string; descrip?: string; cantdecimal?: number };
  moneda_extranjera?: { codmoneda?: string; descrip?: string; cantdecimal?: number };
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

function roundTo(value: number, decimals: number) {
  const factor = 10 ** Math.max(0, decimals);
  return Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
}

function debitCredit(row: PreviewRow) {
  return {
    debeMl: row.dbcr === 'D' ? row.importe : 0,
    haberMl: row.dbcr === 'C' ? row.importe : 0,
    debeMe: row.dbcr === 'D' ? row.importeme : 0,
    haberMe: row.dbcr === 'C' ? row.importeme : 0,
  };
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
  const [monedaLocalCode, setMonedaLocalCode] = useState('');
  const [monedaExtranjeraCode, setMonedaExtranjeraCode] = useState('');
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
  const [diffAccountPickerOpen, setDiffAccountPickerOpen] = useState(false);
  const [diffAccountPickerSearch, setDiffAccountPickerSearch] = useState('');
  const [diffAuxPickerOpen, setDiffAuxPickerOpen] = useState(false);
  const [diffAuxPickerSearch, setDiffAuxPickerSearch] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTransac, setPreviewTransac] = useState<number | null>(null);
  const [sheetRows, setSheetRows] = useState<PreviewRow[]>([]);
  const [savingEntry, setSavingEntry] = useState(false);

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

  const filteredDiffAccounts = useMemo(() => {
    const term = diffAccountPickerSearch.trim().toLowerCase();
    if (!term) return localAccountOptions;
    return localAccountOptions.filter((option) =>
      option.value.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.moneda.toLowerCase().includes(term),
    );
  }, [localAccountOptions, diffAccountPickerSearch]);

  const filteredDiffAuxOptions = useMemo(() => {
    const accountCode = cuentaDif.trim();
    const term = diffAuxPickerSearch.trim().toLowerCase();
    const scoped = localAuxOptions.filter((option) => !accountCode || option.accountCode === accountCode);
    if (!term) return scoped;
    return scoped.filter((option) =>
      option.auxCode.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term),
    );
  }, [localAuxOptions, diffAuxPickerSearch, cuentaDif]);

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

  function openDiffAccountPicker() {
    setDiffAccountPickerSearch('');
    setDiffAccountPickerOpen(true);
  }

  function selectDiffAccount(option: AccountPlanOption) {
    setCuentaDif(option.value);
    setAuxiliarDif('');
    setDiffAccountPickerOpen(false);
  }

  function openDiffAuxPicker() {
    if (!cuentaDif.trim()) {
      setMessage('Debe cargar primeramente la Cuenta Contable de diferencia.');
      return;
    }
    setDiffAuxPickerSearch('');
    setDiffAuxPickerOpen(true);
  }

  function selectDiffAux(option: AuxiliarOption) {
    setAuxiliarDif(option.auxCode);
    setDiffAuxPickerOpen(false);
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
      setMonedaLocalCode(String(local.codmoneda || ''));
      setMonedaExtranjeraCode(String(extranjera.codmoneda || ''));
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
      rows.map((row) => {
        const base = String(row.monedabase || '').trim().toUpperCase();
        const localCode = monedaLocalCode.trim().toUpperCase();
        const foreignCode = monedaExtranjeraCode.trim().toUpperCase();
        const processMl = localCode ? base === localCode : false;
        const processMe = foreignCode ? base === foreignCode : !processMl;
        const diferencia = processMl
          ? roundTo(roundTo(row.saldogs / factor, monedaExtranjeraDecimals) - row.saldome, monedaExtranjeraDecimals)
          : roundTo(roundTo(row.saldome * factor, monedaLocalDecimals) - row.saldogs, monedaLocalDecimals);

        return {
          ...row,
          id: `${row.codplancta}|${row.codplanaux || ''}`,
          processMode: processMe ? 'ME' : 'ML',
          diferencia,
        };
      }),
    [rows, factor, monedaExtranjeraCode, monedaExtranjeraDecimals, monedaLocalCode, monedaLocalDecimals],
  );

  const selectedRows = rowsWithDifference.filter((row) => selected.has(row.id) && row.diferencia !== 0);

  const generatedRows = useMemo<PreviewRow[]>(() => {
    if (!cuentaDif.trim()) return [];

    const detail: PreviewRow[] = [];

    for (const row of selectedRows) {
      const amount = Math.abs(row.diferencia);
      const dbcrContable = row.diferencia > 0 ? 'D' as const : 'C' as const;
      const dbcrDif = row.diferencia > 0 ? 'C' as const : 'D' as const;
      const importe = row.processMode === 'ME' ? amount : 0;
      const importeme = row.processMode === 'ML' ? amount : 0;

      detail.push({
        linea: detail.length + 1,
        codplancta: row.codplancta,
        codplanaux: row.codplanaux || '',
        dbcr: dbcrContable,
        importe,
        importeme,
        concepto: concepto || 'Diferencia de cambio',
      });

      detail.push({
        linea: detail.length + 1,
        codplancta: cuentaDif,
        codplanaux: auxiliarDif,
        dbcr: dbcrDif,
        importe,
        importeme,
        concepto: concepto || 'Diferencia de cambio',
      });
    }

    return detail;
  }, [selectedRows, cuentaDif, auxiliarDif, concepto]);

  useEffect(() => {
    setSheetRows([]);
    setPreviewOpen(false);
    setPreviewTransac(null);
  }, [selected, rows, cuentaDif, auxiliarDif, concepto, factorCambio, monedaLocalCode, monedaExtranjeraCode]);

  const totalDiferencias = rowsWithDifference
    .filter((row) => selected.has(row.id))
    .reduce((sum, row) => sum + row.diferencia, 0);

  const sheetTotals = sheetRows.reduce(
    (totals, row) => {
      const values = debitCredit(row);
      return {
        debeMl: totals.debeMl + values.debeMl,
        haberMl: totals.haberMl + values.haberMl,
        debeMe: totals.debeMe + values.debeMe,
        haberMe: totals.haberMe + values.haberMe,
      };
    },
    { debeMl: 0, haberMl: 0, debeMe: 0, haberMe: 0 },
  );

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

  function generarAsiento() {
    setMessage(null);
    setSheetRows([]);
    setPreviewOpen(false);
    setPreviewTransac(null);

    if (selectedRows.length <= 0) {
      setMessage('No existen datos para procesar. Verifique.');
      return;
    }

    if (!cuentaDif.trim()) {
      setMessage('Debe indicar la cuenta de diferencia de cambio.');
      return;
    }

    if (!Number.isFinite(factor) || factor <= 0) {
      setMessage('Debe indicar un factor de cambio valido y mayor a cero.');
      return;
    }

    if (!generatedRows.length) {
      setMessage('No existen diferencias para generar asiento.');
      return;
    }

    setSheetRows(generatedRows);
    setMessage(`Se generaron ${generatedRows.length} linea(s) para previsualizar el asiento.`);
  }

  async function previsualizarAsiento() {
    setMessage(null);

    if (!fechaAsiento || fechaAsiento <= '1900-01-01') {
      setMessage('La Fecha del Asiento no es valida. Verifique.');
      return;
    }

    if (!tipoAsiento.trim()) {
      setMessage('El Tipo de Asiento no es valido. Verifique.');
      return;
    }

    if (!sheetRows.length) {
      setMessage('No existen datos para procesar. Verifique.');
      return;
    }

    const params = new URLSearchParams({ empresa });
    const response = await fetch(`/api/registraciones/diferencia-cambio/next-transac?${params.toString()}`, {
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: { nrotransac?: number };
      message?: string;
    };

    if (!response.ok || !payload.ok) {
      setMessage(payload.message || 'No se pudo obtener el numero de transaccion.');
      return;
    }

    setPreviewTransac(Number(payload.data?.nrotransac || 1));
    setPreviewOpen(true);
  }

  async function aceptarAsiento() {
    setMessage(null);

    if (!fechaAsiento || fechaAsiento <= '1900-01-01') {
      setMessage('La Fecha del Asiento no es valida. Verifique.');
      return;
    }

    if (!tipoAsiento.trim()) {
      setMessage('El Tipo de Asiento no es valido. Verifique.');
      return;
    }

    if (!sheetRows.length) {
      setMessage('No existen datos para procesar. Verifique.');
      return;
    }

    setSavingEntry(true);
    const response = await fetch('/api/registraciones/diferencia-cambio/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        empresa,
        periodo,
        tipoasiento: tipoAsiento,
        fecha: fechaAsiento,
        concepto: concepto || 'Diferencia de cambio',
        moneda_local: monedaLocalCode,
        rows: sheetRows,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: { nrotransac?: number };
      message?: string;
    };
    setSavingEntry(false);

    if (!response.ok || !payload.ok) {
      setMessage(payload.message || 'Se produjo un error al intentar grabar los datos.');
      return;
    }

    const nrotransac = Number(payload.data?.nrotransac || 0);
    setRows([]);
    setSelected(new Set());
    setSheetRows([]);
    setPreviewOpen(false);
    setPreviewTransac(null);
    setMessage(`El proceso ha finalizado con exito. El Nro. de Transaccion es ${nrotransac}`);
  }

  return (
    <section id="diferencia-cambio" className="space-y-1.5 scroll-mt-16 text-xs">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-900">Diferencias de cambio - Generacion de asientos contables</h2>
      </div>

      <div className="grid gap-1.5 xl:grid-cols-[minmax(320px,0.95fr)_minmax(320px,1.05fr)]">
        <div className="rounded-lg border border-slate-300 bg-white p-2 shadow-sm">
          <div className="mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1 text-xs font-semibold text-blue-800">
            <Search className="h-3.5 w-3.5" />
            1. Parametros de busqueda
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs lg:col-span-2">
              <span className="mb-0.5 block font-medium text-slate-700">Empresa</span>
              <select value={empresa} onChange={(event) => setEmpresa(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
                {empresas.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Periodo</span>
              <input value={periodo} onChange={(event) => setPeriodo(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Codigo de cuentas</span>
              <div className="flex gap-1.5">
                <input value={cuenta} onChange={(event) => setCuenta(event.target.value)} placeholder="Ej: 112201" className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs" />
                <button type="button" onClick={openAccountPicker} className="inline-flex h-8 items-center justify-center rounded-md border border-cyan-200 bg-white px-2 text-cyan-800 transition hover:bg-cyan-50" title="Buscar cuenta contable">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Auxiliar</span>
              <div className="flex gap-1.5">
                <input value={auxiliar} onChange={(event) => setAuxiliar(event.target.value)} placeholder="Ej: 0002" className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs" />
                <button type="button" onClick={openAuxPicker} className="inline-flex h-8 items-center justify-center rounded-md border border-cyan-200 bg-white px-2 text-cyan-800 transition hover:bg-cyan-50" title="Buscar auxiliar">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Desde</span>
              <input type="date" value={fechaDesde} onChange={(event) => setFechaDesde(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Hasta</span>
              <input type="date" value={fechaHasta} onChange={(event) => setFechaHasta(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Tipo de cambio</span>
              <select value={tipoCambio} onChange={(event) => setTipoCambio(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
                <option value="">Seleccione...</option>
                <option value="COMPRA">Compra</option>
                <option value="VENTA">Venta</option>
                <option value="CIERRE">Cierre</option>
              </select>
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Factor de cambio</span>
              <input value={factorCambio} onChange={(event) => setFactorCambio(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 px-2 py-1 text-right text-xs" />
            </label>
          </div>
          <label className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-700">
            <input type="checkbox" checked={recalcular} onChange={(event) => setRecalcular(event.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300" />
            Recalcular importes antes de consultar
          </label>
        </div>

        <div className="rounded-lg border border-slate-300 bg-white p-2 shadow-sm">
          <div className="mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1 text-xs font-semibold text-blue-800">
            <Calculator className="h-3.5 w-3.5" />
            2. Configuracion de diferencia de cambio
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs lg:col-span-2">
              <span className="mb-0.5 block font-medium text-slate-700">Cuenta diferencia de cambio</span>
              <div className="flex gap-1.5">
                <input value={cuentaDif} onChange={(event) => setCuentaDif(event.target.value)} placeholder="Ej: 552001" className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs" />
                <button type="button" onClick={openDiffAccountPicker} className="inline-flex h-8 items-center justify-center rounded-md border border-cyan-200 bg-white px-2 text-cyan-800 transition hover:bg-cyan-50" title="Buscar cuenta diferencia de cambio">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </label>
            <label className="text-xs lg:col-span-2">
              <span className="mb-0.5 block font-medium text-slate-700">Auxiliar</span>
              <div className="flex gap-1.5">
                <input value={auxiliarDif} onChange={(event) => setAuxiliarDif(event.target.value)} className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs" />
                <button type="button" onClick={openDiffAuxPicker} className="inline-flex h-8 items-center justify-center rounded-md border border-cyan-200 bg-white px-2 text-cyan-800 transition hover:bg-cyan-50" title="Buscar auxiliar de diferencia">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </label>
            <label className="text-xs sm:col-span-2">
              <span className="mb-0.5 block font-medium text-slate-700">Concepto</span>
              <input value={concepto} onChange={(event) => setConcepto(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Tipo de asiento</span>
              <select value={tipoAsiento} onChange={(event) => setTipoAsiento(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
                <option value="">Seleccione...</option>
                {tipoAsientoOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              <span className="mb-0.5 block font-medium text-slate-700">Fecha</span>
              <input type="date" value={fechaAsiento} onChange={(event) => setFechaAsiento(event.target.value)} className="h-8 w-full rounded-md border border-slate-200 px-2 py-1 text-xs" />
            </label>
          </div>
          <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[11px] text-blue-700">
            <Info className="h-3.5 w-3.5" />
            Campos obligatorios
          </div>
        </div>
      </div>

      {message ? (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs text-cyan-900">{message}</div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-300 bg-slate-50 px-2.5 py-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
            <FileText className="h-3.5 w-3.5" />
            3. Cuentas con diferencia a generar
          </div>
          <span className="text-[11px] font-medium text-slate-500">Resultados encontrados: {rows.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800">
              <tr>
                <th className="border border-slate-300 px-1.5 py-1 text-center">Sel.</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Codigo</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Auxiliar</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Nombre</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Moneda base</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Saldo GS</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Saldo ME</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {rowsWithDifference.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-1.5 py-1 text-center">
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="h-3.5 w-3.5 rounded border-slate-300" />
                  </td>
                  <td className="border border-slate-200 px-1.5 py-1 font-medium text-slate-900">{row.codplancta}</td>
                  <td className="border border-slate-200 px-1.5 py-1">{row.codplanaux || '-'}</td>
                  <td className="border border-slate-200 px-1.5 py-1">{row.nombre}</td>
                  <td className="border border-slate-200 px-1.5 py-1">{row.monedabase || '-'}</td>
                  <td className="border border-slate-200 px-1.5 py-1 text-right">{formatNumber(row.saldogs, monedaLocalDecimals)}</td>
                  <td className="border border-slate-200 px-1.5 py-1 text-right">{formatNumber(row.saldome, monedaExtranjeraDecimals)}</td>
                  <td className="border border-slate-200 px-1.5 py-1 text-right font-semibold">{formatNumber(row.diferencia, row.processMode === 'ML' ? monedaExtranjeraDecimals : monedaLocalDecimals)}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={8} className="px-2 py-3 text-center text-slate-500">Consulta saldos para ver las cuentas con diferencia.</td>
                </tr>
              ) : null}
            </tbody>
            {rows.length ? (
              <tfoot className="bg-slate-100 font-semibold text-slate-900">
                <tr>
                  <td colSpan={7} className="border border-slate-300 px-1.5 py-1 text-right">Total diferencias</td>
                  <td className="border border-slate-300 px-1.5 py-1 text-right">{formatNumber(totalDiferencias)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-blue-800">
          <FileText className="h-3.5 w-3.5" />
          4. Vista previa del asiento contable
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800">
              <tr>
                <th className="border border-slate-300 px-1.5 py-1 text-center">Linea</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Cuenta</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Auxiliar</th>
                <th className="border border-slate-300 px-1.5 py-1 text-left">Concepto</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Debe ML</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Haber ML</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Debe ME</th>
                <th className="border border-slate-300 px-1.5 py-1 text-right">Haber ME</th>
              </tr>
            </thead>
            <tbody>
              {sheetRows.map((row) => {
                const values = debitCredit(row);
                return (
                  <tr key={row.linea}>
                    <td className="border border-slate-200 px-1.5 py-1 text-center">{row.linea}</td>
                    <td className="border border-slate-200 px-1.5 py-1 font-medium text-slate-900">{row.codplancta}</td>
                    <td className="border border-slate-200 px-1.5 py-1">{row.codplanaux || '-'}</td>
                    <td className="border border-slate-200 px-1.5 py-1">{row.concepto}</td>
                    <td className="border border-slate-200 px-1.5 py-1 text-right">{formatNumber(values.debeMl, monedaLocalDecimals)}</td>
                    <td className="border border-slate-200 px-1.5 py-1 text-right">{formatNumber(values.haberMl, monedaLocalDecimals)}</td>
                    <td className="border border-slate-200 px-1.5 py-1 text-right">{formatNumber(values.debeMe, monedaExtranjeraDecimals)}</td>
                    <td className="border border-slate-200 px-1.5 py-1 text-right">{formatNumber(values.haberMe, monedaExtranjeraDecimals)}</td>
                  </tr>
                );
              })}
              {!sheetRows.length ? (
                <tr>
                  <td colSpan={8} className="px-2 py-3 text-center text-slate-500">Selecciona cuentas y presiona Generar asiento para armar las lineas.</td>
                </tr>
              ) : null}
            </tbody>
            {sheetRows.length ? (
              <tfoot className="bg-slate-100 font-semibold text-slate-900">
                <tr>
                  <td colSpan={4} className="border border-slate-300 px-1.5 py-1 text-right">Totales</td>
                  <td className="border border-slate-300 px-1.5 py-1 text-right">{formatNumber(sheetTotals.debeMl, monedaLocalDecimals)}</td>
                  <td className="border border-slate-300 px-1.5 py-1 text-right">{formatNumber(sheetTotals.haberMl, monedaLocalDecimals)}</td>
                  <td className="border border-slate-300 px-1.5 py-1 text-right">{formatNumber(sheetTotals.debeMe, monedaExtranjeraDecimals)}</td>
                  <td className="border border-slate-300 px-1.5 py-1 text-right">{formatNumber(sheetTotals.haberMe, monedaExtranjeraDecimals)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-1.5 border-t border-slate-200 bg-slate-50/95 px-2.5 py-1.5 backdrop-blur">
        <button type="button" onClick={() => void consultar()} disabled={loading || !empresa || !periodo || !fechaDesde || !fechaHasta} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60">
          <Search className="h-3.5 w-3.5" />
          {loading ? 'Consultando...' : 'Consultar saldos'}
        </button>
        <button type="button" onClick={generarAsiento} disabled={!selectedRows.length} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm disabled:opacity-50">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Generar asiento
        </button>
        <button type="button" onClick={() => void previsualizarAsiento()} disabled={!sheetRows.length} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-800 shadow-sm disabled:opacity-50">
          <FileText className="h-3.5 w-3.5" />
          Previsualizar asiento
        </button>
        <button type="button" onClick={() => void aceptarAsiento()} disabled={savingEntry || !sheetRows.length} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm disabled:opacity-50">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {savingEntry ? 'Grabando...' : 'Aceptar'}
        </button>
        <a href="/registraciones" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          <X className="h-3.5 w-3.5" />
          Cancelar
        </a>
        <div className="ml-auto hidden items-center gap-2 text-xs text-slate-500 md:flex">
          <CalendarDays className="h-3.5 w-3.5" />
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

      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-3">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Pre-visualizacion de Asientos</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {empresa} - Transaccion {previewTransac ?? '-'}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Periodo {periodo} · Tipo {tipoAsiento} · Fecha {fechaAsiento}
                </p>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-auto px-4 py-3">
              <table className="min-w-full text-[13px]">
                <thead className="sticky top-0 bg-slate-50 text-slate-700">
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-2 text-left">Cod Empresa</th>
                    <th className="px-2 py-2 text-left">Periodo</th>
                    <th className="px-2 py-2 text-right">NroTransac</th>
                    <th className="px-2 py-2 text-right">Linea</th>
                    <th className="px-2 py-2 text-left">CodPlanCta</th>
                    <th className="px-2 py-2 text-left">CodPlanAux</th>
                    <th className="px-2 py-2 text-left">Concepto</th>
                    <th className="px-2 py-2 text-center">DBCR</th>
                    <th className="px-2 py-2 text-right">Importe</th>
                    <th className="px-2 py-2 text-right">Importe ME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sheetRows.map((row) => (
                    <tr key={row.linea}>
                      <td className="px-2 py-1.5">{empresa}</td>
                      <td className="px-2 py-1.5">{periodo}</td>
                      <td className="px-2 py-1.5 text-right">{previewTransac ?? '-'}</td>
                      <td className="px-2 py-1.5 text-right">{row.linea}</td>
                      <td className="px-2 py-1.5 font-medium text-slate-900">{row.codplancta}</td>
                      <td className="px-2 py-1.5">{row.codplanaux || '-'}</td>
                      <td className="px-2 py-1.5">{row.concepto}</td>
                      <td className="px-2 py-1.5 text-center font-semibold">{row.dbcr}</td>
                      <td className="px-2 py-1.5 text-right">{formatNumber(row.importe, monedaLocalDecimals)}</td>
                      <td className="px-2 py-1.5 text-right">{formatNumber(row.importeme, monedaExtranjeraDecimals)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-4 py-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void aceptarAsiento()}
                disabled={savingEntry || !sheetRows.length}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50"
              >
                {savingEntry ? 'Grabando...' : 'Aceptar'}
              </button>
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

      {diffAccountPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Elegir cuenta diferencia de cambio</h3>
                <p className="mt-1 text-sm text-slate-500">Busca por codigo o nombre de la cuenta.</p>
              </div>
              <button type="button" onClick={() => setDiffAccountPickerOpen(false)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                Cerrar
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <input
                autoFocus
                value={diffAccountPickerSearch}
                onChange={(event) => setDiffAccountPickerSearch(event.target.value)}
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
                    {filteredDiffAccounts.length ? filteredDiffAccounts.map((option) => (
                      <tr
                        key={option.value}
                        className="cursor-pointer border-b border-slate-100 hover:bg-cyan-50"
                        onClick={() => selectDiffAccount(option)}
                        onDoubleClick={() => selectDiffAccount(option)}
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

      {diffAuxPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Elegir auxiliar de diferencia</h3>
                <p className="mt-1 text-sm text-slate-500">Auxiliares disponibles para la cuenta {cuentaDif}.</p>
              </div>
              <button type="button" onClick={() => setDiffAuxPickerOpen(false)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                Cerrar
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <input
                autoFocus
                value={diffAuxPickerSearch}
                onChange={(event) => setDiffAuxPickerSearch(event.target.value)}
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
                    {filteredDiffAuxOptions.length ? filteredDiffAuxOptions.map((option) => (
                      <tr
                        key={`${option.auxCode}:${option.accountCode}`}
                        className="cursor-pointer border-b border-slate-100 hover:bg-cyan-50"
                        onClick={() => selectDiffAux(option)}
                        onDoubleClick={() => selectDiffAux(option)}
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
