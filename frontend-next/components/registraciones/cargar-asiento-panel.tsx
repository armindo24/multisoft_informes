'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, CircleSlash2, FileText, Plus, Printer, Save, ShieldCheck, UserRound, X } from 'lucide-react';
import type { AccountPlanOption, AuxiliarOption, SelectOption } from '@/types/finanzas';

type EntryLine = {
  id: string;
  codplancta: string;
  codplanaux: string;
  concepto: string;
  debito: string;
  credito: string;
  debitome: string;
  creditome: string;
  proyecto: string;
  rubro: string;
};

type InitPayload = {
  moneda_local?: { codmoneda?: string; descrip?: string };
  moneda_extranjera?: { codmoneda?: string; descrip?: string };
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateTime(value: Date) {
  return value.toLocaleString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseAmount(value: string) {
  const normalized = String(value || '').replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function formatAmount(value: number, decimals = 0) {
  return Number(value || 0).toLocaleString('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function roundTo(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
}

function inputAmount(value: number, decimals = 0) {
  const rounded = roundTo(value, decimals);
  return decimals > 0 ? rounded.toFixed(decimals) : String(Math.round(rounded));
}

function makeLine(concepto = ''): EntryLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    codplancta: '',
    codplanaux: '',
    concepto,
    debito: '',
    credito: '',
    debitome: '',
    creditome: '',
    proyecto: '',
    rubro: '',
  };
}

function accountName(options: AccountPlanOption[], code: string) {
  return options.find((option) => option.value === code)?.name || '';
}

function auxName(options: AuxiliarOption[], accountCode: string, auxCode: string) {
  return options.find((option) => option.accountCode === accountCode && option.auxCode === auxCode)?.name || '';
}

function accountRequiresAux(option?: AccountPlanOption | null) {
  const auxiliary = String(option?.auxiliar || '').trim().toUpperCase();
  return auxiliary === 'S' || auxiliary === 'SI';
}

export function CargarAsientoPanel({
  empresas,
  tipoAsientos,
  accountOptions,
  auxOptions,
  defaultEmpresa,
  defaultPeriodo,
  currentUser,
}: {
  empresas: SelectOption[];
  tipoAsientos: SelectOption[];
  accountOptions: AccountPlanOption[];
  auxOptions: AuxiliarOption[];
  defaultEmpresa: string;
  defaultPeriodo: string;
  currentUser: string;
}) {
  const [empresa, setEmpresa] = useState(defaultEmpresa);
  const [periodo, setPeriodo] = useState(defaultPeriodo);
  const [fecha, setFecha] = useState(today());
  const [tipoAsiento, setTipoAsiento] = useState('');
  const [nroComprobante, setNroComprobante] = useState('');
  const [moneda, setMoneda] = useState('GS');
  const [monedaOptions, setMonedaOptions] = useState<SelectOption[]>([{ value: 'GS', label: 'GUARANIES' }]);
  const [factorCambio, setFactorCambio] = useState('C. Comprador');
  const [factorCambioValor, setFactorCambioValor] = useState('');
  const [factorAplicado, setFactorAplicado] = useState(false);
  const [dif, setDif] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'extranjera'>('local');
  const [showFullConcept, setShowFullConcept] = useState(false);
  const [conceptoLargo, setConceptoLargo] = useState(false);
  const [lines, setLines] = useState<EntryLine[]>([makeLine()]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [createdAt] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ empresa, periodo });
    fetch(`/api/registraciones/diferencia-cambio/init?${params.toString()}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { ok?: boolean; data?: InitPayload }) => {
        const data = payload?.data || {};
        const nextOptions: SelectOption[] = [];
        if (data.moneda_local?.codmoneda) {
          nextOptions.push({ value: data.moneda_local.codmoneda, label: data.moneda_local.descrip || data.moneda_local.codmoneda });
        }
        if (data.moneda_extranjera?.codmoneda && data.moneda_extranjera.codmoneda !== data.moneda_local?.codmoneda) {
          nextOptions.push({ value: data.moneda_extranjera.codmoneda, label: data.moneda_extranjera.descrip || data.moneda_extranjera.codmoneda });
        }
        if (nextOptions.length) {
          setMonedaOptions(nextOptions);
          setMoneda((current) => nextOptions.some((option) => option.value === current) ? current : nextOptions[0].value);
        }
      })
      .catch(() => undefined);
  }, [empresa, periodo]);

  const selectedLine = useMemo(
    () => lines.find((line) => line.id === selectedLineId) || lines[0] || null,
    [lines, selectedLineId],
  );

  const filteredAuxOptions = useMemo(() => {
    const accountCode = selectedLine?.codplancta || '';
    return auxOptions.filter((option) => !accountCode || option.accountCode === accountCode);
  }, [auxOptions, selectedLine?.codplancta]);

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        acc.debito += parseAmount(line.debito);
        acc.credito += parseAmount(line.credito);
        acc.debitome += parseAmount(line.debitome);
        acc.creditome += parseAmount(line.creditome);
        return acc;
      },
      { debito: 0, credito: 0, debitome: 0, creditome: 0 },
    );
  }, [lines]);

  const difference = activeTab === 'local'
    ? totals.debito - totals.credito
    : totals.debitome - totals.creditome;
  const canSave = lines.length > 0 && tipoAsiento && fecha && Math.abs(difference) === 0 && (totals.debito > 0 || totals.debitome > 0);
  const empresaLabel = empresas.find((option) => option.value === empresa)?.label || empresa;

  function updateLine(id: string, patch: Partial<EntryLine>) {
    if ('debito' in patch || 'credito' in patch || 'debitome' in patch || 'creditome' in patch) {
      setFactorAplicado(false);
    }
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function addLine() {
    const currentConcept = selectedLine?.concepto || '';
    const next = makeLine(currentConcept);
    setLines((current) => [...current, next]);
    setSelectedLineId(next.id);
  }

  function deleteLine(id: string) {
    if (lines.length <= 1) {
      setLines([makeLine()]);
      setSelectedLineId(null);
      return;
    }

    if (!window.confirm('Esta a punto de borrar el detalle. Esta seguro?')) return;
    setLines((current) => current.filter((line) => line.id !== id));
    setSelectedLineId((current) => (current === id ? null : current));
  }

  function clearForm() {
    if (!window.confirm('Desea cerrar y limpiar la carga actual?')) return;
    setTipoAsiento('');
    setNroComprobante('');
    setMoneda(monedaOptions[0]?.value || 'GS');
    setFactorCambio('C. Comprador');
    setFactorCambioValor('');
    setFactorAplicado(false);
    setDif(false);
    setActiveTab('local');
    setShowFullConcept(false);
    setConceptoLargo(false);
    setLines([makeLine()]);
    setSelectedLineId(null);
    setMessage(null);
  }

  function applyExchangeRate() {
    const current = factorCambioValor || '1';
    const entered = window.prompt('Factor de Cambio', current);
    if (entered === null) return false;

    const cambio = parseAmount(entered);
    if (!Number.isFinite(cambio) || cambio <= 0) {
      setMessage({ tone: 'error', text: 'Debe indicar un factor de cambio valido.' });
      return false;
    }

    setFactorCambioValor(inputAmount(cambio, 4));
    setLines((currentLines) => currentLines.map((line) => {
      const next = { ...line };

      if (activeTab === 'local') {
        const credito = roundTo(parseAmount(line.credito), 0);
        const debito = roundTo(parseAmount(line.debito), 0);

        if (credito > 0) {
          next.credito = inputAmount(credito, 0);
          next.creditome = inputAmount(credito / cambio, 2);
          next.debitome = '';
        } else if (debito > 0) {
          next.debito = inputAmount(debito, 0);
          next.debitome = inputAmount(debito / cambio, 2);
          next.creditome = '';
        }
      } else {
        const creditome = roundTo(parseAmount(line.creditome), 2);
        const debitome = roundTo(parseAmount(line.debitome), 2);

        if (creditome > 0) {
          next.creditome = inputAmount(creditome, 2);
          next.credito = inputAmount(creditome * cambio, 0);
          next.debito = '';
        } else if (debitome > 0) {
          next.debitome = inputAmount(debitome, 2);
          next.debito = inputAmount(debitome * cambio, 0);
          next.credito = '';
        }
      }

      return next;
    }));
    setFactorAplicado(true);
    setMessage({ tone: 'ok', text: `Factor de cambio aplicado: ${inputAmount(cambio, 4)}.` });
    return true;
  }

  function validateBeforeSave() {
    const cleanLines = lines.filter((line) => line.codplancta.trim());

    if (!fecha) return 'La fecha del asiento no es valida. Verifique.';
    if (!tipoAsiento) return 'El Tipo de Asiento no es valido. Verifique.';
    if (!moneda) return 'Debe completar la moneda.';
    if (!cleanLines.length) return 'El asiento no cuenta con detalles.';

    let totalDebito = 0;
    let totalCredito = 0;
    let totalDebitoME = 0;
    let totalCreditoME = 0;

    for (const [index, line] of cleanLines.entries()) {
      const account = accountOptions.find((option) => option.value === line.codplancta.trim());
      if (!account) return `Debe completar una Cuenta valida en la linea ${index + 1}.`;
      if (accountRequiresAux(account) && !line.codplanaux.trim()) return `Debe completar el Auxiliar en la linea ${index + 1}.`;
      if (!accountRequiresAux(account) && line.codplanaux.trim()) return `Esta cuenta no usa auxiliares en la linea ${index + 1}.`;

      const debito = parseAmount(line.debito);
      const credito = parseAmount(line.credito);
      const debitome = parseAmount(line.debitome);
      const creditome = parseAmount(line.creditome);
      if (debito <= 0 && credito <= 0 && debitome <= 0 && creditome <= 0) {
        return `Debe completar el Importe Credito o Debito en la linea ${index + 1}.`;
      }

      totalDebito += debito;
      totalCredito += credito;
      totalDebitoME += debitome;
      totalCreditoME += creditome;
    }

    if (Math.trunc(totalDebito * 100) !== Math.trunc(totalCredito * 100)) {
      return `El Asiento no Balancea. Debito: ${formatAmount(totalDebito, 2)} - Credito: ${formatAmount(totalCredito, 2)}.`;
    }
    if (Math.round(totalDebitoME * 100) !== Math.round(totalCreditoME * 100)) {
      return `El Asiento no Balancea en Moneda Extranjera. Debito: ${formatAmount(totalDebitoME, 2)} - Credito: ${formatAmount(totalCreditoME, 2)}.`;
    }

    return '';
  }

  async function saveEntry() {
    if (!factorAplicado) {
      const shouldApply = window.confirm('Aun no aplico el Factor de Cambio. Desea hacerlo ahora?');
      if (shouldApply && !applyExchangeRate()) return;
    }

    const validation = validateBeforeSave();
    if (validation) {
      setMessage({ tone: 'error', text: validation });
      return;
    }

    setSaving(true);
    setMessage({ tone: 'info', text: 'Grabando asiento...' });

    const cleanLines = lines
      .filter((line) => line.codplancta.trim())
      .map((line) => ({
        codplancta: line.codplancta.trim(),
        codplanaux: line.codplanaux.trim(),
        concepto: line.concepto.trim(),
        debito: parseAmount(line.debito),
        credito: parseAmount(line.credito),
        debitome: parseAmount(line.debitome),
        creditome: parseAmount(line.creditome),
        proyecto: line.proyecto.trim(),
        rubro: line.rubro.trim(),
      }));

    try {
      const response = await fetch('/api/registraciones/cargar-asiento/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa,
          periodo,
          fecha,
          tipoasiento: tipoAsiento,
          nrocompr: nroComprobante,
          codmoneda: moneda,
          usuario: currentUser,
          rows: cleanLines,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false || payload?.data?.ok === false) {
        throw new Error(payload?.message || payload?.data?.message || 'No se pudo grabar el asiento.');
      }

      const nrotransac = Number(payload?.data?.nrotransac || 0);
      setMessage({ tone: 'ok', text: `El proceso ha finalizado con exito. El Nro. de Transaccion es ${nrotransac || '-'}.` });
      setLines([makeLine()]);
      setSelectedLineId(null);
      setNroComprobante('');
    } catch (error) {
      setMessage({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo grabar el asiento.' });
    } finally {
      setSaving(false);
    }
  }

  const visibleDebitField = activeTab === 'local' ? 'debito' : 'debitome';
  const visibleCreditField = activeTab === 'local' ? 'credito' : 'creditome';
  const activeTotalDebit = activeTab === 'local' ? totals.debito : totals.debitome;
  const activeTotalCredit = activeTab === 'local' ? totals.credito : totals.creditome;
  const activeDecimals = activeTab === 'local' ? 0 : 2;

  return (
    <div className="space-y-2 text-[13px]">
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-700" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700">Asientos</p>
              <h1 className="text-lg font-bold leading-tight text-slate-950">ASIENTO N° Nuevo</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveEntry}
              disabled={!canSave || saving}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-700 px-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-blue-300"
              title={canSave ? 'Guardar asiento' : 'Complete fecha, tipo de asiento y balance del asiento'}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
            <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-600">
              <CircleSlash2 className="h-4 w-4" />
              Desautorizar
            </button>
            <button type="button" onClick={clearForm} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
              <X className="h-4 w-4" />
              Cerrar
            </button>
          </div>
        </div>

        <div className="grid gap-2 px-3 py-2 lg:grid-cols-[1.2fr_0.7fr_1.35fr_0.95fr_0.55fr] xl:grid-cols-[1.2fr_0.75fr_1.45fr_0.95fr_0.45fr_0.85fr_0.85fr_0.65fr]">
          <label className="font-semibold text-slate-700">
            Empresa
            <select value={empresa} onChange={(event) => setEmpresa(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px]">
              {empresas.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Fecha
            <input value={fecha} onChange={(event) => setFecha(event.target.value)} type="date" className="mt-1 h-9 w-full rounded-md border border-slate-200 px-2 text-[13px]" />
          </label>
          <label className="font-semibold text-slate-700">
            Tipo de Asiento
            <select value={tipoAsiento} onChange={(event) => setTipoAsiento(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px]">
              <option value="">Seleccione...</option>
              {tipoAsientos.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Nro. Comprobante
            <input value={nroComprobante} onChange={(event) => setNroComprobante(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-200 px-2 text-[13px]" />
          </label>
          <label className="flex items-end gap-2 pb-2 font-semibold text-slate-700">
            <input checked={dif} onChange={(event) => setDif(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Dif.
          </label>
          <label className="font-semibold text-slate-700">
            Moneda
            <select value={moneda} onChange={(event) => setMoneda(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px]">
              {monedaOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Factor de Cambio
            <select value={factorCambio} onChange={(event) => setFactorCambio(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px]">
              <option value="C. Comprador">C. Comprador</option>
              <option value="C. Vendedor">C. Vendedor</option>
              <option value="Manual">Manual</option>
            </select>
            {factorCambioValor ? <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">Aplicado: {factorCambioValor}</span> : null}
          </label>
          <label className="font-semibold text-slate-700">
            Periodo
            <input value={periodo} onChange={(event) => setPeriodo(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-200 px-2 text-[13px]" />
          </label>
        </div>

        {message ? (
          <div className={`mx-3 mb-2 rounded-md border px-3 py-1.5 text-[13px] ${
            message.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : message.tone === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-cyan-200 bg-cyan-50 text-cyan-800'
          }`}>
            {message.text}
          </div>
        ) : null}

        <div className="grid gap-2 border-t border-slate-100 px-3 py-2 lg:grid-cols-3">
          <InfoCard icon={<UserRound className="h-4 w-4" />} title="Informacion de la Carga">
            <InfoLine label="Cargado por:" value={currentUser || '-'} />
            <InfoLine label="Fecha:" value={formatDateTime(createdAt)} />
            <InfoLine label="Origen:" value="Carga manual de asiento" />
          </InfoCard>
          <InfoCard icon={<ShieldCheck className="h-4 w-4" />} title="Informacion de la Autorizacion">
            <InfoLine label="Estado:" value="Pendiente" valueClass="text-amber-700" />
            <InfoLine label="Autorizado por:" value="-" />
            <InfoLine label="Fecha:" value="-" />
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="h-4 w-4" />} title="Informacion de la Revision">
            <InfoLine label="Estado:" value="No" />
            <InfoLine label="Nro. Asiento:" value="-" />
            <InfoLine label="Fecha:" value="-" />
          </InfoCard>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('local')}
              className={`border-b-2 px-3 py-1.5 font-semibold ${activeTab === 'local' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-600'}`}
            >
              Moneda Local
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('extranjera')}
              className={`border-b-2 px-3 py-1.5 font-semibold ${activeTab === 'extranjera' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-600'}`}
            >
              Moneda Extranjera
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={applyExchangeRate} className="h-8 rounded-md border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700">
              Aplicar Factor de Cambio
            </button>
            <label className="flex items-center gap-2 font-semibold text-slate-700">
              Desplegar el Concepto Completo
              <input checked={showFullConcept} onChange={(event) => setShowFullConcept(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            </label>
          </div>
        </div>

        <div className="grid gap-2 border-b border-slate-100 px-3 py-2 md:grid-cols-3">
          <TotalCard title="Debito Total" value={formatAmount(activeTotalDebit, activeDecimals)} tone="blue" />
          <TotalCard title="Credito Total" value={formatAmount(activeTotalCredit, activeDecimals)} tone="green" />
          <TotalCard title="Diferencia" value={formatAmount(difference, activeDecimals)} tone={Math.abs(difference) === 0 ? 'purple' : 'rose'} />
        </div>

        <div className="overflow-x-auto">
          <datalist id="asiento-cuentas">
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </datalist>
          <datalist id="asiento-auxiliares">
            {auxOptions.map((option) => (
              <option key={`${option.accountCode}-${option.auxCode}`} value={option.auxCode}>{option.label}</option>
            ))}
          </datalist>

          <table className="min-w-[980px] w-full border-collapse text-[13px]">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="w-10 px-2 py-1.5 text-left">Nro.</th>
                <th className="w-32 px-2 py-1.5 text-left">Codigo</th>
                <th className="w-32 px-2 py-1.5 text-left">Cod. Auxiliar</th>
                <th className="px-2 py-1.5 text-left">Concepto</th>
                <th className="w-32 px-2 py-1.5 text-right">Debito</th>
                <th className="w-32 px-2 py-1.5 text-right">Credito</th>
                <th className="w-24 px-2 py-1.5 text-left">Proyecto</th>
                <th className="w-24 px-2 py-1.5 text-left">Rubro</th>
                <th className="w-10 px-2 py-1.5 text-center">
                  <button type="button" onClick={addLine} className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-800 text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const selected = selectedLine?.id === line.id;
                const lineAccountName = accountName(accountOptions, line.codplancta);
                const lineAuxName = auxName(auxOptions, line.codplancta, line.codplanaux);
                return (
                  <tr
                    key={line.id}
                    onClick={() => setSelectedLineId(line.id)}
                    className={`border-b border-slate-200 ${selected ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <td className="px-2 py-1.5 align-top font-semibold text-slate-700">{index + 1}</td>
                    <td className="px-2 py-1.5 align-top">
                      <input
                        list="asiento-cuentas"
                        value={line.codplancta}
                        onChange={(event) => updateLine(line.id, { codplancta: event.target.value })}
                        className="h-7 w-full rounded border border-slate-200 px-2"
                      />
                      {lineAccountName ? <p className="mt-0.5 text-[11px] font-semibold text-blue-700">Cuenta: {lineAccountName}</p> : null}
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <input
                        list="asiento-auxiliares"
                        value={line.codplanaux}
                        onChange={(event) => updateLine(line.id, { codplanaux: event.target.value })}
                        className="h-7 w-full rounded border border-slate-200 px-2"
                      />
                      {lineAuxName ? <p className="mt-0.5 text-[11px] font-semibold text-blue-700">Auxiliar: {lineAuxName}</p> : null}
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <textarea
                        value={line.concepto}
                        onChange={(event) => updateLine(line.id, { concepto: event.target.value })}
                        rows={showFullConcept ? 3 : 1}
                        className="min-h-7 w-full resize-none rounded border border-slate-200 px-2 py-1"
                      />
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <input
                        value={String(line[visibleDebitField as keyof EntryLine] || '')}
                        onChange={(event) => updateLine(line.id, { [visibleDebitField]: event.target.value } as Partial<EntryLine>)}
                        className="h-7 w-full rounded border border-slate-200 px-2 text-right"
                      />
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <input
                        value={String(line[visibleCreditField as keyof EntryLine] || '')}
                        onChange={(event) => updateLine(line.id, { [visibleCreditField]: event.target.value } as Partial<EntryLine>)}
                        className="h-7 w-full rounded border border-slate-200 px-2 text-right"
                      />
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <input value={line.proyecto} onChange={(event) => updateLine(line.id, { proyecto: event.target.value })} className="h-7 w-full rounded border border-slate-200 px-2" />
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <input value={line.rubro} onChange={(event) => updateLine(line.id, { rubro: event.target.value })} className="h-7 w-full rounded border border-slate-200 px-2" />
                    </td>
                    <td className="px-2 py-1.5 text-center align-top">
                      <button type="button" onClick={(event) => { event.stopPropagation(); deleteLine(line.id); }} className="rounded px-2 py-1 text-lg font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                        ...
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card px-3 py-2">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="font-bold text-blue-900">Detalle de la linea seleccionada</h2>
          <label className="flex items-center gap-2 font-semibold text-slate-700">
            Concepto largo
            <input checked={conceptoLargo} onChange={(event) => setConceptoLargo(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
          </label>
        </div>
        <div className="grid gap-2 lg:grid-cols-[0.9fr_0.7fr_1.6fr]">
          <label className="font-semibold text-slate-700">
            Cuenta
            <input value={selectedLine ? accountName(accountOptions, selectedLine.codplancta) : ''} readOnly className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-[13px]" />
          </label>
          <label className="font-semibold text-slate-700">
            Auxiliar
            <input value={selectedLine ? auxName(filteredAuxOptions, selectedLine.codplancta, selectedLine.codplanaux) : ''} readOnly className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-[13px]" />
          </label>
          <label className="font-semibold text-slate-700">
            Observacion / Concepto Completo
            <textarea
              value={selectedLine?.concepto || ''}
              onChange={(event) => selectedLine && updateLine(selectedLine.id, { concepto: event.target.value })}
              rows={conceptoLargo ? 4 : 1}
              className="mt-1 w-full resize-none rounded-md border border-slate-200 px-2 py-1 text-[13px]"
            />
          </label>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 rounded-b-md bg-blue-900 px-3 py-1.5 text-[13px] font-semibold text-white">
        <span>Usuario: {currentUser || '-'}</span>
        <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Fecha del Sistema: {formatDateTime(new Date())}</span>
        <span>Empresa: {empresaLabel}</span>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-2">
      <div className="mb-1.5 flex items-center gap-2 font-bold text-indigo-800">
        {icon}
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function InfoLine({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="grid grid-cols-[86px_1fr] gap-2 text-[13px]">
      <span className="font-semibold text-blue-900">{label}</span>
      <span className={`font-semibold text-slate-700 ${valueClass}`}>{value}</span>
    </div>
  );
}

function TotalCard({ title, value, tone }: { title: string; value: string; tone: 'blue' | 'green' | 'purple' | 'rose' }) {
  const toneClass = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    purple: 'text-purple-700',
    rose: 'text-rose-700',
  }[tone];

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">{title}</p>
      <p className={`mt-0.5 text-lg font-black ${toneClass}`}>{value}</p>
    </div>
  );
}
