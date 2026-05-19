'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, CheckCircle2, CircleSlash2, FileText, Minus, Plus, Printer, Save, Search, ShieldCheck, UserRound, X } from 'lucide-react';
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

type DetailColumn = 'codplancta' | 'codplanaux' | 'concepto' | 'debito' | 'credito' | 'proyecto' | 'rubro';

type InitPayload = {
  moneda_local?: { codmoneda?: string; descrip?: string };
  moneda_extranjera?: { codmoneda?: string; descrip?: string };
};

type PrintRow = Record<string, unknown>;

type LoadedEntryMeta = {
  nrotransac: number;
  nroasiento: string;
  cargadopor: string;
  fechacarga: string;
  autorizado: 'S' | 'N';
  autorizadopor: string;
  fechaautoriz: string;
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
  const raw = String(value || '').trim();
  if (!raw) return 0;
  if (!raw.includes(',') && raw.includes('.')) {
    const parts = raw.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      const decimal = Number(raw);
      return Number.isFinite(decimal) ? decimal : 0;
    }
  }
  const normalized = raw.replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function parseExchangeRate(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return 0;
  if (raw.includes(',')) return parseAmount(raw);
  const number = Number(raw);
  return Number.isFinite(number) ? number : parseAmount(raw);
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

function readableError(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.message;
  if (typeof value === 'object') {
    const data = value as Record<string, unknown>;
    return readableError(data.message) || readableError(data.error) || readableError(data.data) || JSON.stringify(value);
  }
  return String(value);
}

function rowText(row: PrintRow | null | undefined, ...keys: string[]) {
  if (!row) return '';
  for (const key of keys) {
    const value = row[key] ?? row[key.toUpperCase()] ?? row[key.toLowerCase()];
    if (value !== null && typeof value !== 'undefined') return String(value).trim();
  }
  return '';
}

function rowNumber(row: PrintRow | null | undefined, ...keys: string[]) {
  const raw = rowText(row, ...keys);
  if (!raw) return 0;
  if (raw.includes(',')) return parseAmount(raw);
  const value = Number(raw);
  return Number.isFinite(value) ? value : parseAmount(raw);
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatReportDate(value: unknown, withTime = false) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/.exec(raw);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] || 0), Number(match[5] || 0))
    : new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

function formatInputDate(value: unknown) {
  const raw = String(value ?? '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return today();
  return date.toISOString().slice(0, 10);
}

function makeLine(concepto = ''): EntryLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    codplancta: '',
    codplanaux: '',
    concepto,
    debito: '0',
    credito: '0',
    debitome: '0.00',
    creditome: '0.00',
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
  const [loadingFactor, setLoadingFactor] = useState(false);
  const [dif, setDif] = useState(false);
  const [autorizado, setAutorizado] = useState<'S' | 'N'>('N');
  const [activeTab, setActiveTab] = useState<'local' | 'extranjera'>('local');
  const [showFullConcept, setShowFullConcept] = useState(false);
  const [conceptoLargo, setConceptoLargo] = useState(false);
  const [lines, setLines] = useState<EntryLine[]>([makeLine()]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [createdAt] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [lastSavedTransac, setLastSavedTransac] = useState<number | null>(null);
  const [loadedEntryMeta, setLoadedEntryMeta] = useState<LoadedEntryMeta | null>(null);
  const [printPromptTransac, setPrintPromptTransac] = useState<number | null>(null);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error' | 'info'; text: string } | null>(null);
  const [picker, setPicker] = useState<{ type: 'account' | 'aux'; lineId: string } | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  function inputKey(lineId: string, column: DetailColumn) {
    return `${lineId}:${column}`;
  }

  function focusCell(lineId: string, column: DetailColumn) {
    window.setTimeout(() => inputRefs.current[inputKey(lineId, column)]?.focus(), 0);
  }

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

  useEffect(() => {
    if (factorCambio !== 'Manual' && fecha) void loadDailyExchangeRate(factorCambio, fecha, true);
  }, [empresa]);

  const selectedLine = useMemo(
    () => lines.find((line) => line.id === selectedLineId) || lines[0] || null,
    [lines, selectedLineId],
  );

  const filteredAuxOptions = useMemo(() => {
    const accountCode = selectedLine?.codplancta || '';
    return auxOptions.filter((option) => !accountCode || option.accountCode === accountCode);
  }, [auxOptions, selectedLine?.codplancta]);

  const pickerLine = useMemo(
    () => lines.find((line) => line.id === picker?.lineId) || null,
    [lines, picker?.lineId],
  );

  const filteredPickerAccounts = useMemo(() => {
    const term = pickerSearch.trim().toLowerCase();
    if (!term) return accountOptions.slice(0, 80);
    return accountOptions.filter((option) =>
      option.value.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term),
    ).slice(0, 120);
  }, [accountOptions, pickerSearch]);

  const filteredPickerAux = useMemo(() => {
    const accountCode = pickerLine?.codplancta || '';
    const term = pickerSearch.trim().toLowerCase();
    const scoped = auxOptions.filter((option) => !accountCode || option.accountCode === accountCode);
    if (!term) return scoped.slice(0, 80);
    return scoped.filter((option) =>
      option.auxCode.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term),
    ).slice(0, 120);
  }, [auxOptions, pickerLine?.codplancta, pickerSearch]);

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

  function openPicker(type: 'account' | 'aux', lineId: string) {
    const line = lines.find((item) => item.id === lineId);
    if (type === 'aux' && !line?.codplancta.trim()) {
      setMessage({ tone: 'error', text: 'Debe seleccionar primeramente la cuenta contable.' });
      return;
    }
    setSelectedLineId(lineId);
    setPicker({ type, lineId });
    setPickerSearch('');
  }

  function closePicker() {
    setPicker(null);
    setPickerSearch('');
  }

  function selectAccount(option: AccountPlanOption) {
    if (!picker) return;
    updateLine(picker.lineId, { codplancta: option.value, codplanaux: '' });
    closePicker();
  }

  function selectAux(option: AuxiliarOption) {
    if (!picker) return;
    updateLine(picker.lineId, { codplanaux: option.auxCode });
    closePicker();
  }

  function accountForLine(line: EntryLine) {
    return accountOptions.find((option) => option.value === line.codplancta.trim()) || null;
  }

  function handleDetailEnter(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, line: EntryLine, index: number, column: DetailColumn) {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    if (column === 'codplancta') {
      const previous = index > 0 ? lines[index - 1] : null;
      const nextCode = line.codplancta.trim() || previous?.codplancta || '';
      if (!nextCode) return;
      updateLine(line.id, { codplancta: nextCode, codplanaux: line.codplancta.trim() ? line.codplanaux : previous?.codplanaux || '' });
      focusCell(line.id, 'codplanaux');
      return;
    }

    if (column === 'codplanaux') {
      const previous = index > 0 ? lines[index - 1] : null;
      const nextAux = line.codplanaux.trim() || previous?.codplanaux || '';
      if (nextAux && !line.codplanaux.trim()) {
        updateLine(line.id, { codplanaux: nextAux });
      }
      focusCell(line.id, 'concepto');
      return;
    }

    if (column === 'debito') {
      focusCell(line.id, 'credito');
      return;
    }

    if (column === 'credito') {
      const account = accountForLine(line);
      const requiresAux = accountRequiresAux(account);
      const debit = parseAmount(activeTab === 'local' ? line.debito : line.debitome);
      const credit = parseAmount(activeTab === 'local' ? line.credito : line.creditome);
      if (!line.codplancta.trim()) {
        focusCell(line.id, 'codplancta');
        return;
      }
      if (requiresAux && !line.codplanaux.trim()) {
        focusCell(line.id, 'codplanaux');
        return;
      }
      if ((debit > 0 || credit > 0) && index === lines.length - 1) {
        const next = makeLine(line.concepto);
        setLines((current) => [...current, next]);
        setSelectedLineId(next.id);
        focusCell(next.id, 'codplancta');
        return;
      }
      focusCell(line.id, 'codplancta');
      return;
    }

    const order: DetailColumn[] = ['codplancta', 'codplanaux', 'concepto', 'debito', 'credito', 'proyecto', 'rubro'];
    const nextColumn = order[order.indexOf(column) + 1] || 'codplancta';
    focusCell(line.id, nextColumn);
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
    setAutorizado('N');
    setActiveTab('local');
    setShowFullConcept(false);
    setConceptoLargo(false);
    setLines([makeLine()]);
    setSelectedLineId(null);
    setLastSavedTransac(null);
    setLoadedEntryMeta(null);
    setPrintPromptTransac(null);
    setMessage(null);
  }

  async function loadDailyExchangeRate(nextTipo = factorCambio, nextFecha = fecha, silent = false) {
    if (!nextFecha || nextTipo === 'Manual') return 0;

    setLoadingFactor(true);
    try {
      const params = new URLSearchParams({
        empresa,
        periodo: nextFecha.slice(0, 4) || periodo,
        fecha: nextFecha,
        tipo: nextTipo,
      });
      const response = await fetch(`/api/registraciones/cargar-asiento/factor-cambio?${params.toString()}`, { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false || payload?.data?.ok === false) {
        throw new Error(readableError(payload?.message) || readableError(payload?.error) || readableError(payload?.data?.message) || readableError(payload?.data?.error) || readableError(payload?.data) || 'No se encontro la cotizacion del dia.');
      }

      const value = Number(payload?.data?.factcambio || 0);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error('No se encontro una cotizacion valida para la fecha seleccionada.');
      }

      setFactorCambioValor(inputAmount(value, 4));
      setFactorAplicado(false);
      if (!silent) {
        setMessage({ tone: 'ok', text: `Cotizacion ${nextTipo} del ${formatReportDate(nextFecha)}: ${inputAmount(value, 4)}.` });
      }
      return value;
    } catch (error) {
      if (!silent) setMessage({ tone: 'error', text: readableError(error) || 'No se pudo consultar la cotizacion del dia.' });
      return 0;
    } finally {
      setLoadingFactor(false);
    }
  }

  async function applyExchangeRate() {
    let cambio = parseExchangeRate(factorCambioValor);
    if ((!Number.isFinite(cambio) || cambio <= 0) && factorCambio !== 'Manual') {
      cambio = await loadDailyExchangeRate(factorCambio, fecha, true);
    }

    if (!Number.isFinite(cambio) || cambio <= 0) {
      setMessage({ tone: 'error', text: 'Debe indicar un factor de cambio valido.' });
      return false;
    }

    const localHasValues = lines.some((line) => parseAmount(line.debito) > 0 || parseAmount(line.credito) > 0);
    const foreignHasValues = lines.some((line) => parseAmount(line.debitome) > 0 || parseAmount(line.creditome) > 0);
    const sourceTab = activeTab === 'local'
      ? (localHasValues || !foreignHasValues ? 'local' : 'extranjera')
      : (foreignHasValues || !localHasValues ? 'extranjera' : 'local');

    setFactorCambioValor(inputAmount(cambio, 4));
    setLines((currentLines) => currentLines.map((line) => {
      const next = { ...line };

      if (sourceTab === 'local') {
        const credito = roundTo(parseAmount(line.credito), 0);
        const debito = roundTo(parseAmount(line.debito), 0);

        if (credito > 0) {
          next.credito = inputAmount(credito, 0);
          next.creditome = inputAmount(credito / cambio, 2);
          next.debitome = '0.00';
        } else if (debito > 0) {
          next.debito = inputAmount(debito, 0);
          next.debitome = inputAmount(debito / cambio, 2);
          next.creditome = '0.00';
        }
      } else {
        const creditome = roundTo(parseAmount(line.creditome), 2);
        const debitome = roundTo(parseAmount(line.debitome), 2);

        if (creditome > 0) {
          next.creditome = inputAmount(creditome, 2);
          next.credito = inputAmount(creditome * cambio, 0);
          next.debito = '0';
        } else if (debitome > 0) {
          next.debitome = inputAmount(debitome, 2);
          next.debito = inputAmount(debitome * cambio, 0);
          next.credito = '0';
        }
      }

      return next;
    }));
    setActiveTab(sourceTab === 'local' ? 'extranjera' : 'local');
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

  function applyEntryRows(rows: PrintRow[]) {
    const first = rows[0];
    const nrotransac = rowNumber(first, 'nrotransac', 'NroTransac');
    const autorizadoValue = rowText(first, 'autorizado', 'Autorizado').toUpperCase() === 'S' ? 'S' : 'N';
    const factCambio = rowText(first, 'factcambio', 'FactCambio');

    setLastSavedTransac(nrotransac || null);
    setLoadedEntryMeta({
      nrotransac,
      nroasiento: rowText(first, 'nroasiento', 'NroAsiento'),
      cargadopor: rowText(first, 'cargadopor', 'CargadoPor'),
      fechacarga: rowText(first, 'fechacarga', 'FechaCarga'),
      autorizado: autorizadoValue,
      autorizadopor: rowText(first, 'autorizadopor', 'AutorizadoPor'),
      fechaautoriz: rowText(first, 'fechaautoriz', 'FechaAutoriz'),
    });
    setFecha(formatInputDate(rowText(first, 'fecha', 'Fecha')));
    setTipoAsiento(rowText(first, 'tipoasiento', 'TipoAsiento'));
    setNroComprobante(rowText(first, 'nrocompr', 'NroCompr'));
    setMoneda(rowText(first, 'codmoneda', 'CodMoneda') || monedaOptions[0]?.value || 'GS');
    setAutorizado(autorizadoValue);
    if (factCambio) {
      setFactorCambioValor(factCambio);
      setFactorAplicado(true);
    }

    const loadedLines = rows.map((row) => ({
      id: `${rowText(row, 'linea', 'Linea') || Date.now()}-${Math.random().toString(36).slice(2)}`,
      codplancta: rowText(row, 'codplancta', 'CodPlanCta'),
      codplanaux: rowText(row, 'codplanaux', 'CodPlanAux'),
      concepto: rowText(row, 'concepto', 'Concepto'),
      debito: inputAmount(rowNumber(row, 'debito', 'DEBITO'), 0),
      credito: inputAmount(rowNumber(row, 'credito', 'CREDITO'), 0),
      debitome: inputAmount(rowNumber(row, 'debito_me', 'DEBITO_ME'), 2),
      creditome: inputAmount(rowNumber(row, 'credito_me', 'CREDITO_ME'), 2),
      proyecto: '',
      rubro: '',
    }));

    setLines(loadedLines.length ? loadedLines : [makeLine()]);
    setSelectedLineId(loadedLines[0]?.id || null);
  }

  async function fetchEntryRows(nrotransac: number) {
    const params = new URLSearchParams({
      empresa,
      periodo,
      nrotransac: String(nrotransac),
    });
    const response = await fetch(`/api/registraciones/cargar-asiento/imprimir?${params.toString()}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.ok === false || payload?.data?.ok === false) {
      throw new Error(readableError(payload?.message) || readableError(payload?.error) || readableError(payload?.data?.message) || readableError(payload?.data?.error) || readableError(payload?.data) || 'No se pudo recuperar el asiento.');
    }

    const rows = (payload?.data?.rows || []) as PrintRow[];
    if (!rows.length) throw new Error('No se encontraron datos para el asiento.');
    return rows;
  }

  async function saveEntry() {
    if (!factorAplicado) {
      const shouldApply = window.confirm('Aun no aplico el Factor de Cambio. Desea hacerlo ahora?');
      if (shouldApply && !(await applyExchangeRate())) return;
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
          factcambio: parseExchangeRate(factorCambioValor),
          nrotransac: lastSavedTransac || undefined,
          autorizado,
          usuario: currentUser,
          rows: cleanLines,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false || payload?.data?.ok === false) {
        throw new Error(readableError(payload?.message) || readableError(payload?.error) || readableError(payload?.data?.message) || readableError(payload?.data?.error) || readableError(payload?.data) || 'No se pudo grabar el asiento.');
      }

      const nrotransac = Number(payload?.data?.nrotransac || 0);
      const updated = Boolean(payload?.data?.updated);
      setLastSavedTransac(nrotransac || null);
      if (nrotransac) {
        const savedRows = await fetchEntryRows(nrotransac);
        applyEntryRows(savedRows);
        setPrintPromptTransac(nrotransac);
      }
      setMessage({ tone: 'ok', text: updated ? `El asiento ${nrotransac || '-'} fue actualizado correctamente.` : `El proceso ha finalizado con exito. El Nro. de Transaccion es ${nrotransac || '-'}.` });
    } catch (error) {
      setMessage({ tone: 'error', text: readableError(error) || 'No se pudo grabar el asiento.' });
    } finally {
      setSaving(false);
    }
  }

  async function printEntry() {
    if (!lastSavedTransac) {
      setMessage({ tone: 'error', text: 'Primero debe guardar el asiento para imprimir.' });
      return;
    }

    setMessage({ tone: 'info', text: 'Preparando impresion del asiento...' });

    try {
      const rows = await fetchEntryRows(lastSavedTransac);

      const first = rows[0];
      const companyName = rowText(first, 'empresa_nombre', 'Des_Empresa') || empresaLabel;
      const tipo = rowText(first, 'tipoasiento', 'TipoAsiento');
      const tipoDesc = rowText(first, 'tipo_descrip', 'Descrip');
      const nroCompr = rowText(first, 'nrocompr', 'NroCompr');
      const fechaTransac = formatReportDate(rowText(first, 'fecha', 'Fecha'));
      const factCambio = rowText(first, 'factcambio', 'FactCambio');
      const cargadoPor = rowText(first, 'cargadopor', 'CargadoPor') || currentUser || '-';
      const fechaCarga = formatReportDate(rowText(first, 'fechacarga', 'FechaCarga'), true);
      const autorizado = rowText(first, 'autorizado', 'Autorizado').toUpperCase() === 'S';
      const autorizadoPor = rowText(first, 'autorizadopor', 'AutorizadoPor') || '-';
      const fechaAutoriz = formatReportDate(rowText(first, 'fechaautoriz', 'FechaAutoriz'), true);
      const printedAt = formatDateTime(new Date());

      const totalDebe = rows.reduce((acc, row) => acc + rowNumber(row, 'debito', 'DEBITO'), 0);
      const totalHaber = rows.reduce((acc, row) => acc + rowNumber(row, 'credito', 'CREDITO'), 0);
      const detailRows = rows.map((row, index) => {
        const linea = rowText(row, 'linea', 'Linea') || String(index + 1);
        return `
          <tr>
            <td>${escapeHtml(linea)}</td>
            <td>${escapeHtml(rowText(row, 'codplancta', 'CodPlanCta'))}</td>
            <td>${escapeHtml(rowText(row, 'codplanaux', 'CodPlanAux'))}</td>
            <td>${escapeHtml(rowText(row, 'concepto', 'Concepto'))}</td>
            <td class="num">${formatAmount(rowNumber(row, 'debito', 'DEBITO'), 0)}</td>
            <td class="num">${formatAmount(rowNumber(row, 'credito', 'CREDITO'), 0)}</td>
          </tr>
        `;
      }).join('');

      const html = `<!doctype html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Diario de Verificacion ${escapeHtml(lastSavedTransac)}</title>
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            body { font-family: "Times New Roman", serif; color: #000; background: #fff; font-size: 12px; }
            .sheet { border-top: 1px solid #0000cc; padding-top: 6px; }
            .top { display: grid; grid-template-columns: 1fr auto; align-items: start; }
            .company { font-size: 20px; font-weight: 700; }
            .printed { display: grid; grid-template-columns: auto auto; gap: 6px 28px; font-weight: 700; }
            h1 { margin: 2px 0 22px; text-align: center; font-size: 22px; }
            .filters, .meta { display: grid; grid-template-columns: 1.2fr 1.2fr 1.3fr 1fr; gap: 8px 26px; margin-bottom: 6px; }
            .label { font-weight: 700; }
            .bar { border-top: 2px solid #000; margin: 4px 0 8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 3px 6px; vertical-align: top; }
            thead th { border-bottom: 2px solid #000; text-align: left; }
            .currency { text-align: center; border-top: 2px solid #000; font-weight: 700; }
            .num { text-align: right; white-space: nowrap; }
            tfoot td { border-top: 2px solid #000; font-weight: 700; }
            .audit { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 14px 28px 8px; }
            .audit div { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; }
            .double-line { border-top: 2px solid #000; border-bottom: 2px solid #000; height: 6px; margin-top: 8px; }
            .total-general { display: grid; grid-template-columns: 1fr auto auto; gap: 36px; margin-top: 6px; font-weight: 700; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="top">
              <div class="company">${escapeHtml(companyName)}</div>
              <div class="printed"><span>Fecha :</span><span>${escapeHtml(printedAt)}</span></div>
            </div>
            <h1>Diario de Verificacion</h1>
            <div class="filters">
              <div><span class="label">Fecha :</span></div>
              <div><span class="label">Tipo de Comprobante :</span></div>
              <div><span class="label">Nro. de Transaccion :</span> ${escapeHtml(lastSavedTransac)}</div>
              <div><span class="label">Impreso Por :</span> ${escapeHtml(currentUser || '-')}</div>
              <div><span class="label">Autorizados :</span></div>
            </div>
            <div class="bar"></div>
            <div class="meta">
              <div><span class="label">Tipo de Cbte. :</span> ${escapeHtml(tipo)} &nbsp;&nbsp; ${escapeHtml(tipoDesc)}</div>
              <div><span class="label">Nro. de Transac. :</span> ${escapeHtml(lastSavedTransac)}</div>
              <div><span class="label">Factor de Cambio :</span> ${escapeHtml(factCambio)}</div>
              <div></div>
              <div><span class="label">Nro. de Cbte. :</span> ${escapeHtml(nroCompr)}</div>
              <div><span class="label">Fecha de Transac. :</span> ${escapeHtml(fechaTransac)}</div>
            </div>
            <table>
              <thead>
                <tr><th colspan="4"></th><th colspan="2" class="currency">Moneda Local</th></tr>
                <tr>
                  <th style="width: 36px;">Sec.</th>
                  <th style="width: 78px;">Cuenta</th>
                  <th style="width: 180px;">Auxiliar</th>
                  <th>Concepto</th>
                  <th class="num" style="width: 110px;">Debe</th>
                  <th class="num" style="width: 110px;">Haber</th>
                </tr>
              </thead>
              <tbody>${detailRows}</tbody>
              <tfoot>
                <tr>
                  <td colspan="4">Totales</td>
                  <td class="num">${formatAmount(totalDebe, 0)}</td>
                  <td class="num">${formatAmount(totalHaber, 0)}</td>
                </tr>
              </tfoot>
            </table>
            <div class="audit">
              <div><span class="label">Cargado Por :</span><span>${escapeHtml(cargadoPor)}</span><span class="label">Fecha :</span><span>${escapeHtml(fechaCarga)}</span></div>
              <div><span class="label">Estado :</span><span>${autorizado ? 'Autorizado' : 'No Autorizado'}</span></div>
              <div><span class="label">Autorizado Por :</span><span>${escapeHtml(autorizadoPor)}</span><span class="label">Fecha :</span><span>${escapeHtml(fechaAutoriz)}</span></div>
            </div>
            <div class="double-line"></div>
            <div class="total-general">
              <span>Total General</span>
              <span>${formatAmount(totalDebe, 0)}</span>
              <span>${formatAmount(totalHaber, 0)}</span>
            </div>
          </div>
          <script>
            window.addEventListener('load', function () {
              window.focus();
              setTimeout(function () { window.print(); }, 250);
            });
          </script>
        </body>
        </html>`;

      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      if (!printWindow) throw new Error('El navegador bloqueo la ventana de impresion.');
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      setMessage({ tone: 'ok', text: `Impresion preparada para el asiento ${lastSavedTransac}.` });
    } catch (error) {
      setMessage({ tone: 'error', text: readableError(error) || 'No se pudo preparar la impresion del asiento.' });
    }
  }

  async function recoverEntry() {
    const entered = window.prompt('Nro. de Transaccion', lastSavedTransac ? String(lastSavedTransac) : '');
    if (entered === null) return;

    const nrotransac = Number(String(entered).trim());
    if (!Number.isFinite(nrotransac) || nrotransac <= 0) {
      setMessage({ tone: 'error', text: 'Debe indicar un Nro. de Transaccion valido.' });
      return;
    }

    setMessage({ tone: 'info', text: `Recuperando asiento ${nrotransac}...` });
    try {
      const rows = await fetchEntryRows(nrotransac);
      applyEntryRows(rows);
      setMessage({ tone: 'ok', text: `Asiento ${nrotransac} recuperado correctamente.` });
    } catch (error) {
      setMessage({ tone: 'error', text: readableError(error) || 'No se pudo recuperar el asiento.' });
    }
  }

  async function confirmPrintPrompt() {
    setPrintPromptTransac(null);
    await printEntry();
  }

  const visibleDebitField = activeTab === 'local' ? 'debito' : 'debitome';
  const visibleCreditField = activeTab === 'local' ? 'credito' : 'creditome';
  const activeTotalDebit = activeTab === 'local' ? totals.debito : totals.debitome;
  const activeTotalCredit = activeTab === 'local' ? totals.credito : totals.creditome;
  const activeDecimals = activeTab === 'local' ? 0 : 2;
  const autorizadoLabel = autorizado === 'S' ? 'Autorizado' : 'Pendiente';
  const currentTransacLabel = lastSavedTransac ? String(lastSavedTransac) : 'Nuevo';
  const loadedAt = loadedEntryMeta?.fechacarga ? formatReportDate(loadedEntryMeta.fechacarga, true) : formatDateTime(createdAt);
  const loadedAuthorizedAt = loadedEntryMeta?.fechaautoriz ? formatReportDate(loadedEntryMeta.fechaautoriz, true) : '-';

  return (
    <div className="space-y-1.5 text-[12px]">
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-1.5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-700" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-teal-700">Asientos</p>
              <h1 className="text-base font-bold leading-tight text-slate-950">ASIENTO Nro. {currentTransacLabel}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveEntry}
              disabled={!canSave || saving}
              className="inline-flex h-8 items-center gap-2 rounded-md bg-blue-700 px-3 text-[12px] font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-blue-300"
              title={canSave ? 'Guardar asiento' : 'Complete fecha, tipo de asiento y balance del asiento'}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={printEntry}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700"
              title={lastSavedTransac ? `Imprimir asiento ${lastSavedTransac}` : 'Primero debe guardar el asiento'}
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={recoverEntry}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700"
              title="Recuperar asiento por Nro. de Transaccion"
            >
              <Search className="h-4 w-4" />
              Recuperar
            </button>
            <button
              type="button"
              onClick={() => setAutorizado((current) => (current === 'S' ? 'N' : 'S'))}
              className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 text-[12px] font-semibold ${
                autorizado === 'S'
                  ? 'border-rose-200 bg-white text-rose-600'
                  : 'border-emerald-200 bg-white text-emerald-700'
              }`}
            >
              <CircleSlash2 className="h-4 w-4" />
              {autorizado === 'S' ? 'Desautorizar' : 'Autorizar'}
            </button>
            <button type="button" onClick={clearForm} className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700">
              <X className="h-4 w-4" />
              Cerrar
            </button>
          </div>
        </div>

        <div className="grid gap-1.5 px-3 py-1.5 lg:grid-cols-[1.25fr_0.72fr_1.45fr_0.95fr_0.42fr_0.82fr_0.82fr_0.62fr]">
          <label className="font-semibold text-slate-700">
            Empresa
            <select value={empresa} onChange={(event) => setEmpresa(event.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px]">
              {empresas.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Fecha
            <input
              value={fecha}
              onChange={(event) => {
                const nextFecha = event.target.value;
                setFecha(nextFecha);
                const year = nextFecha.slice(0, 4);
                if (year) setPeriodo(year);
                void loadDailyExchangeRate(factorCambio, nextFecha);
              }}
              type="date"
              className="mt-0.5 h-8 w-full rounded-md border border-slate-200 px-2 text-[12px]"
            />
          </label>
          <label className="font-semibold text-slate-700">
            Tipo de Asiento
            <select value={tipoAsiento} onChange={(event) => setTipoAsiento(event.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px]">
              <option value="">Seleccione...</option>
              {tipoAsientos.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Nro. Comprobante
            <input value={nroComprobante} onChange={(event) => setNroComprobante(event.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-slate-200 px-2 text-[12px]" />
          </label>
          <label className="flex items-end gap-2 pb-2 font-semibold text-slate-700">
            <input checked={dif} onChange={(event) => setDif(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Dif.
          </label>
          <label className="font-semibold text-slate-700">
            Moneda
            <select value={moneda} onChange={(event) => setMoneda(event.target.value)} className="mt-0.5 h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px]">
              {monedaOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Factor de Cambio
            <select
              value={factorCambio}
              onChange={(event) => {
                const nextTipo = event.target.value;
                setFactorCambio(nextTipo);
                setFactorAplicado(false);
                if (nextTipo !== 'Manual') void loadDailyExchangeRate(nextTipo, fecha);
              }}
              className="mt-0.5 h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px]"
            >
              <option value="C. Comprador">C. Comprador</option>
              <option value="C. Vendedor">C. Vendedor</option>
              <option value="Manual">Manual</option>
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Factor del dia
            <input
              value={factorCambioValor}
              onChange={(event) => {
                setFactorCambioValor(event.target.value);
                setFactorAplicado(false);
              }}
              placeholder="Ej: 6500.0000"
              disabled={loadingFactor}
              className="mt-0.5 h-8 w-full rounded-md border border-slate-200 px-2 text-right text-[12px] disabled:bg-slate-50"
            />
          </label>
        </div>

        {message ? (
          <div className={`mx-3 mb-1.5 rounded-md border px-3 py-1 text-[12px] ${
            message.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : message.tone === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-cyan-200 bg-cyan-50 text-cyan-800'
          }`}>
            {message.text}
          </div>
        ) : null}

        <div className="grid gap-1.5 border-t border-slate-100 px-3 py-1.5 lg:grid-cols-3">
          <InfoCard icon={<UserRound className="h-4 w-4" />} title="Informacion de la Carga">
            <InfoLine label="Cargado por:" value={loadedEntryMeta?.cargadopor || currentUser || '-'} />
            <InfoLine label="Fecha:" value={loadedAt} />
            <InfoLine label="Origen:" value="Carga manual de asiento" />
          </InfoCard>
          <InfoCard icon={<ShieldCheck className="h-4 w-4" />} title="Informacion de la Autorizacion">
            <InfoLine label="Estado:" value={autorizadoLabel} valueClass={autorizado === 'S' ? 'text-emerald-700' : 'text-amber-700'} />
            <InfoLine label="Autorizado por:" value={autorizado === 'S' ? loadedEntryMeta?.autorizadopor || currentUser || '-' : '-'} />
            <InfoLine label="Fecha:" value={autorizado === 'S' ? loadedAuthorizedAt : '-'} />
          </InfoCard>
          <InfoCard icon={<CheckCircle2 className="h-4 w-4" />} title="Informacion de la Revision">
            <InfoLine label="Estado:" value="No" />
            <InfoLine label="Nro. Asiento:" value={loadedEntryMeta?.nroasiento || (lastSavedTransac ? String(lastSavedTransac) : '-')} />
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
          <div className="grid min-w-[360px] flex-1 gap-2 sm:grid-cols-3 lg:max-w-xl">
            <TotalCard title="Debito Total" value={formatAmount(activeTotalDebit, activeDecimals)} tone="blue" />
            <TotalCard title="Credito Total" value={formatAmount(activeTotalCredit, activeDecimals)} tone="green" />
            <TotalCard title="Diferencia" value={formatAmount(difference, activeDecimals)} tone={Math.abs(difference) === 0 ? 'purple' : 'rose'} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void applyExchangeRate()} disabled={loadingFactor} className="h-7 rounded-md border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-50">
              {loadingFactor ? 'Buscando cotizacion...' : 'Aplicar Factor de Cambio'}
            </button>
            <label className="flex items-center gap-2 font-semibold text-slate-700">
              Desplegar el Concepto Completo
              <input checked={showFullConcept} onChange={(event) => setShowFullConcept(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-[12px]">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="w-10 px-2 py-1.5 text-left">Nro.</th>
                <th className="w-36 px-2 py-1.5 text-left">Codigo</th>
                <th className="w-32 px-2 py-1.5 text-left">Cod. Auxiliar</th>
                <th className="px-2 py-1.5 text-center">Concepto</th>
                <th className="w-36 px-2 py-1.5 text-right">Debito</th>
                <th className="w-36 px-2 py-1.5 text-right">Credito</th>
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
                  <Fragment key={line.id}>
                  <tr
                    onClick={() => setSelectedLineId(line.id)}
                    className={`${selected ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <td rowSpan={2} className="border-b border-slate-200 px-2 py-1 align-top font-semibold text-slate-700">{index + 1}</td>
                    <td className="px-2 py-1 align-top">
                      <div className="flex gap-1">
                        <input
                          value={line.codplancta}
                          onChange={(event) => updateLine(line.id, { codplancta: event.target.value, codplanaux: '' })}
                          onKeyDown={(event) => handleDetailEnter(event, line, index, 'codplancta')}
                          ref={(element) => { inputRefs.current[inputKey(line.id, 'codplancta')] = element; }}
                          className="h-6 w-full rounded border border-slate-200 px-2 font-semibold"
                        />
                        <button type="button" onClick={() => openPicker('account', line.id)} className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-cyan-200 bg-cyan-50 text-cyan-700">
                          <Search className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-1 align-top">
                      <div className="flex gap-1">
                        <input
                          value={line.codplanaux}
                          onChange={(event) => updateLine(line.id, { codplanaux: event.target.value })}
                          onKeyDown={(event) => handleDetailEnter(event, line, index, 'codplanaux')}
                          ref={(element) => { inputRefs.current[inputKey(line.id, 'codplanaux')] = element; }}
                          className="h-6 w-full rounded border border-slate-200 px-2 text-right font-semibold"
                        />
                        <button type="button" onClick={() => openPicker('aux', line.id)} className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-cyan-200 bg-cyan-50 text-cyan-700">
                          <Search className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-1 align-top">
                      <textarea
                        value={line.concepto}
                        onChange={(event) => updateLine(line.id, { concepto: event.target.value })}
                        onKeyDown={(event) => handleDetailEnter(event, line, index, 'concepto')}
                        ref={(element) => { inputRefs.current[inputKey(line.id, 'concepto')] = element; }}
                        rows={showFullConcept ? 3 : 1}
                        className="min-h-6 w-full resize-none rounded border border-slate-200 px-2 py-0.5"
                      />
                    </td>
                    <td className="px-2 py-1 align-top">
                      <input
                        value={String(line[visibleDebitField as keyof EntryLine] || '')}
                        onChange={(event) => updateLine(line.id, { [visibleDebitField]: event.target.value } as Partial<EntryLine>)}
                        onKeyDown={(event) => handleDetailEnter(event, line, index, 'debito')}
                        ref={(element) => { inputRefs.current[inputKey(line.id, 'debito')] = element; }}
                        className="h-6 w-full rounded border border-slate-200 px-2 text-right"
                      />
                    </td>
                    <td className="px-2 py-1 align-top">
                      <input
                        value={String(line[visibleCreditField as keyof EntryLine] || '')}
                        onChange={(event) => updateLine(line.id, { [visibleCreditField]: event.target.value } as Partial<EntryLine>)}
                        onKeyDown={(event) => handleDetailEnter(event, line, index, 'credito')}
                        ref={(element) => { inputRefs.current[inputKey(line.id, 'credito')] = element; }}
                        className="h-6 w-full rounded border border-slate-200 px-2 text-right"
                      />
                    </td>
                    <td className="px-2 py-1 align-top">
                      <input
                        value={line.proyecto}
                        onChange={(event) => updateLine(line.id, { proyecto: event.target.value })}
                        onKeyDown={(event) => handleDetailEnter(event, line, index, 'proyecto')}
                        ref={(element) => { inputRefs.current[inputKey(line.id, 'proyecto')] = element; }}
                        className="h-6 w-full rounded border border-slate-200 px-2"
                      />
                    </td>
                    <td className="px-2 py-1 align-top">
                      <input
                        value={line.rubro}
                        onChange={(event) => updateLine(line.id, { rubro: event.target.value })}
                        onKeyDown={(event) => handleDetailEnter(event, line, index, 'rubro')}
                        ref={(element) => { inputRefs.current[inputKey(line.id, 'rubro')] = element; }}
                        className="h-6 w-full rounded border border-slate-200 px-2"
                      />
                    </td>
                    <td rowSpan={2} className="border-b border-slate-200 px-2 py-1 text-center align-top">
                      <button
                        type="button"
                        title="Borrar detalle"
                        aria-label="Borrar detalle"
                        onClick={(event) => { event.stopPropagation(); deleteLine(line.id); }}
                        className="inline-flex h-6 w-6 items-center justify-center rounded border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr
                    onClick={() => setSelectedLineId(line.id)}
                    className={`border-b border-slate-200 ${selected ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <td colSpan={7} className="px-3 py-0.5 text-[11px] font-semibold text-blue-700">
                      <span className="mr-2 font-bold text-blue-950">Cuenta:</span>
                      {lineAccountName || '-'}
                      <span className="ml-10 mr-2 font-bold text-blue-950">Auxiliar:</span>
                      {lineAuxName || '-'}
                    </td>
                  </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card px-3 py-1.5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="font-bold text-blue-900">Detalle de la linea seleccionada</h2>
          <label className="flex items-center gap-2 font-semibold text-slate-700">
            Concepto largo
            <input checked={conceptoLargo} onChange={(event) => setConceptoLargo(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
          </label>
        </div>
        <div className="grid gap-2 lg:grid-cols-[0.9fr_0.7fr_1.6fr]">
          <label className="font-semibold text-slate-700">
            Cuenta
            <input value={selectedLine ? accountName(accountOptions, selectedLine.codplancta) : ''} readOnly className="mt-0.5 h-7 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-[12px]" />
          </label>
          <label className="font-semibold text-slate-700">
            Auxiliar
            <input value={selectedLine ? auxName(filteredAuxOptions, selectedLine.codplancta, selectedLine.codplanaux) : ''} readOnly className="mt-0.5 h-7 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-[12px]" />
          </label>
          <label className="font-semibold text-slate-700">
            Observacion / Concepto Completo
            <textarea
              value={selectedLine?.concepto || ''}
              onChange={(event) => selectedLine && updateLine(selectedLine.id, { concepto: event.target.value })}
              rows={conceptoLargo ? 4 : 1}
              className="mt-0.5 w-full resize-none rounded-md border border-slate-200 px-2 py-0.5 text-[12px]"
            />
          </label>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 rounded-b-md bg-blue-900 px-3 py-1 text-[12px] font-semibold text-white">
        <span>Usuario: {currentUser || '-'}</span>
        <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Fecha del Sistema: {formatDateTime(new Date())}</span>
        <span>Empresa: {empresaLabel}</span>
      </footer>

      {printPromptTransac ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">Asiento grabado</p>
                <h3 className="mt-1 text-lg font-bold text-slate-950">Nro. de Transaccion {printPromptTransac}</h3>
                <p className="mt-2 text-sm text-slate-600">Desea imprimir el asiento generado?</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPrintPromptTransac(null)}
                className="h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => void confirmPrintPrompt()}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white"
              >
                <Printer className="h-4 w-4" />
                Si, imprimir
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {picker ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
                  {picker.type === 'account' ? 'Cuenta contable' : 'Auxiliar'}
                </p>
                <h3 className="text-lg font-bold text-slate-950">
                  {picker.type === 'account' ? 'Buscar cuenta' : `Buscar auxiliar${pickerLine?.codplancta ? ` de ${pickerLine.codplancta}` : ''}`}
                </h3>
              </div>
              <button type="button" onClick={closePicker} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="border-b border-slate-100 p-3">
              <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  autoFocus
                  value={pickerSearch}
                  onChange={(event) => setPickerSearch(event.target.value)}
                  placeholder="Buscar por codigo o descripcion"
                  className="h-10 w-full outline-none"
                />
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {picker.type === 'account' ? (
                filteredPickerAccounts.length ? filteredPickerAccounts.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectAccount(option)}
                    className="grid w-full grid-cols-[130px_1fr_80px] gap-3 rounded-md px-3 py-2 text-left hover:bg-cyan-50"
                  >
                    <span className="font-bold text-slate-950">{option.value}</span>
                    <span className="text-slate-700">{option.name}</span>
                    <span className="text-right text-xs font-semibold text-slate-500">{option.auxiliar === 'S' ? 'Auxiliar' : ''}</span>
                  </button>
                )) : <p className="px-3 py-6 text-center text-slate-500">No se encontraron cuentas.</p>
              ) : (
                filteredPickerAux.length ? filteredPickerAux.map((option) => (
                  <button
                    key={`${option.accountCode}-${option.auxCode}`}
                    type="button"
                    onClick={() => selectAux(option)}
                    className="grid w-full grid-cols-[130px_1fr_120px] gap-3 rounded-md px-3 py-2 text-left hover:bg-cyan-50"
                  >
                    <span className="font-bold text-slate-950">{option.auxCode}</span>
                    <span className="text-slate-700">{option.name}</span>
                    <span className="text-right text-xs font-semibold text-slate-500">{option.accountCode}</span>
                  </button>
                )) : <p className="px-3 py-6 text-center text-slate-500">No se encontraron auxiliares para la cuenta.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-1.5">
      <div className="mb-1 flex items-center gap-2 text-[12px] font-bold text-indigo-800">
        {icon}
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function InfoLine({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="grid grid-cols-[82px_1fr] gap-2 text-[12px] leading-5">
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
    <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-700">{title}</p>
      <p className={`text-base font-black leading-5 ${toneClass}`}>{value}</p>
    </div>
  );
}
