'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { getEmpresaMeta } from '@/lib/api';
import { AccountPlanOption, AuxiliarOption, SelectOption } from '@/types/finanzas';

const monthOptions = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

function toInputDate(value: string) {
  const normalized = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  if (/^\d{8}$/.test(normalized)) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 6)}-${normalized.slice(6, 8)}`;
  }
  return '';
}

function endOfMonthDate(periodo: string, mes: string) {
  const year = Number(periodo);
  const month = Number(mes);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return '';
  }
  const date = new Date(year, month, 0);
  return `${periodo}-${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function FinanceFilters({
  empresas,
  current,
  tipoAsientos = [],
  accountOptions = [],
  auxOptions = [],
}: {
  empresas: SelectOption[];
  current: Record<string, string>;
  tipoAsientos?: SelectOption[];
  accountOptions?: AccountPlanOption[];
  auxOptions?: AuxiliarOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedEmpresa, setSelectedEmpresa] = useState(current.empresa || '');
  const [selectedPeriodo, setSelectedPeriodo] = useState(current.periodo || '');
  const [selectedMesd, setSelectedMesd] = useState(current.mesd || '01');
  const [selectedMesh, setSelectedMesh] = useState(current.mesh || current.mesd || '01');
  const [codigoEntidadValue, setCodigoEntidadValue] = useState(current.codigo_entidad || '');
  const [practicadoAlValue, setPracticadoAlValue] = useState(
    toInputDate(current.practicado_al || '') || endOfMonthDate(current.periodo || '', current.mesh || current.mesd || '01'),
  );
  const [manualPracticadoAl, setManualPracticadoAl] = useState(Boolean(toInputDate(current.practicado_al || '')));
  const [selectedFrom, setSelectedFrom] = useState(current.cuentad || '');
  const [selectedTo, setSelectedTo] = useState(current.cuentah || '');
  const [selectedAuxFrom, setSelectedAuxFrom] = useState(current.cuentaad || '');
  const [selectedAuxTo, setSelectedAuxTo] = useState(current.cuentaah || '');
  const [selectedTipoAsiento, setSelectedTipoAsiento] = useState(current.tipoAsiento || 'NINGUNO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressValue, setProgressValue] = useState(18);
  const [pickerTarget, setPickerTarget] = useState<'cuentad' | 'cuentah' | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [auxPickerTarget, setAuxPickerTarget] = useState<'cuentaad' | 'cuentaah' | null>(null);
  const [auxPickerSearch, setAuxPickerSearch] = useState('');
  const [tipoAsientoOpen, setTipoAsientoOpen] = useState(false);
  const [tipoAsientoSearch, setTipoAsientoSearch] = useState('');
  const showBalanceAdvanced = current.section === 'balance-general';
  const showPucAdvanced = current.section === 'balance-general-puc';
  const showComprobadoAdvanced = current.section === 'balance-general-comprobado';
  const showDiarioAdvanced = current.section === 'libro-diario';
  const showMayorCuentaAdvanced = current.section === 'mayor-cuenta';
  const showMayorCuentaAuxAdvanced = current.section === 'mayor-cuenta-aux';
  const showAccountRange = showBalanceAdvanced || showPucAdvanced;
  const showMonthRange = !showComprobadoAdvanced && !showDiarioAdvanced && !showMayorCuentaAdvanced && !showMayorCuentaAuxAdvanced;
  const showSingleMonth = showComprobadoAdvanced;

  const filteredAccounts = useMemo(() => {
    const term = pickerSearch.trim().toLowerCase();
    if (!term) return accountOptions;
    return accountOptions
      .filter((option) =>
        option.value.toLowerCase().includes(term) ||
        option.label.toLowerCase().includes(term) ||
        option.name.toLowerCase().includes(term) ||
        option.moneda.toLowerCase().includes(term) ||
        option.nivel.toLowerCase().includes(term),
      );
  }, [accountOptions, pickerSearch]);

  const filteredTipoAsientos = useMemo(() => {
    const term = tipoAsientoSearch.trim().toLowerCase();
    if (!term) return tipoAsientos;
    return tipoAsientos.filter((option) => option.value.toLowerCase().includes(term) || option.label.toLowerCase().includes(term));
  }, [tipoAsientos, tipoAsientoSearch]);

  const filteredAuxOptions = useMemo(() => {
    const fromAccount = selectedFrom.trim();
    const toAccount = selectedTo.trim();
    const term = auxPickerSearch.trim().toLowerCase();
    const scoped = auxOptions.filter((option) => {
      if (!fromAccount && !toAccount) return true;
      if (fromAccount && option.accountCode < fromAccount) return false;
      if (toAccount && option.accountCode > toAccount) return false;
      return true;
    });
    if (!term) return scoped;
    return scoped.filter((option) =>
      option.auxCode.toLowerCase().includes(term) ||
      option.accountCode.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term),
    );
  }, [auxOptions, auxPickerSearch, selectedFrom, selectedTo]);

  function accountLabel(value: string) {
    return accountOptions.find((option) => option.value === value)?.label || value;
  }

  function accountDisplayName(option: AccountPlanOption) {
    const fallback = option.name || option.label || option.value;
    return option.label.replace(new RegExp(`^${option.value}\\s*[Â·-]?\\s*`), '') || fallback;
  }

  function tipoAsientoLabel(value: string) {
    if (!value || value === 'NINGUNO') return 'Todos';
    return tipoAsientos.find((option) => option.value === value)?.label || value;
  }

  function auxLabel(value: string) {
    return auxOptions.find((option) => option.value === value)?.label || value;
  }

  function openAccountPicker(target: 'cuentad' | 'cuentah') {
    setPickerTarget(target);
    setPickerSearch('');
  }

  function selectAccount(value: string) {
    if (pickerTarget === 'cuentad') setSelectedFrom(value);
    if (pickerTarget === 'cuentah') setSelectedTo(value);
    setPickerTarget(null);
  }

  function openAuxPicker(target: 'cuentaad' | 'cuentaah') {
    setAuxPickerTarget(target);
    setAuxPickerSearch('');
  }

  function selectAux(value: string) {
    if (auxPickerTarget === 'cuentaad') setSelectedAuxFrom(value);
    if (auxPickerTarget === 'cuentaah') setSelectedAuxTo(value);
    setAuxPickerTarget(null);
  }

  function selectTipoAsiento(value: string) {
    setSelectedTipoAsiento(value);
    setTipoAsientoOpen(false);
    setTipoAsientoSearch('');
  }

  useEffect(() => {
    let ignore = false;

    async function loadEmpresaMeta() {
      if (!showPucAdvanced || !selectedEmpresa) return;
      const response = await getEmpresaMeta(selectedEmpresa);
      if (ignore) return;
      const codigo = String(
        response?.data?.codigo_entidad ||
        response?.data?.Codigo_Entidad ||
        response?.data?.codigo_identidad ||
        response?.data?.Codigo_Identidad ||
        response?.data?.cod_identidad ||
        response?.data?.Cod_Identidad ||
        response?.data?.cod_ident ||
        response?.data?.Cod_Ident ||
        '',
      ).trim();
      setCodigoEntidadValue(codigo);
    }

    void loadEmpresaMeta();
    return () => {
      ignore = true;
    };
  }, [selectedEmpresa, showPucAdvanced]);

  useEffect(() => {
    if (!showPucAdvanced || manualPracticadoAl) return;
    const suggestedDate = endOfMonthDate(selectedPeriodo, selectedMesh);
    if (suggestedDate) {
      setPracticadoAlValue(suggestedDate);
    }
  }, [manualPracticadoAl, selectedMesh, selectedPeriodo, showPucAdvanced]);

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
        className="card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
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
        {current.section ? <input type="hidden" name="section" value={current.section} /> : null}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Empresa</label>
          <select
            name="empresa"
            value={selectedEmpresa}
            onChange={(event) => setSelectedEmpresa(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {empresas.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Periodo</label>
          <input
            name="periodo"
            value={selectedPeriodo}
            onChange={(event) => setSelectedPeriodo(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        {showMonthRange ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Desde</label>
              <select name="mesd" value={selectedMesd} onChange={(event) => setSelectedMesd(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hasta</label>
              <select name="mesh" value={selectedMesh} onChange={(event) => setSelectedMesh(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </>
        ) : showSingleMonth ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mes</label>
              <select name="mesd" defaultValue={current.mesd} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <input type="hidden" name="mesh" value={current.mesd} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nivel</label>
              <input
                name="nivel"
                defaultValue={current.nivel || '0'}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          </>
        ) : null}
        {!showDiarioAdvanced ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Moneda</label>
            <select name="moneda" defaultValue={current.moneda} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="local">Local</option>
              <option value="extranjera">Extranjera</option>
              {!showComprobadoAdvanced ? <option value="ambas">Ambas</option> : null}
            </select>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Moneda</label>
            <select name="moneda" defaultValue={current.moneda || 'ambas'} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="local">Local</option>
              <option value="extranjera">Extranjera</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            disabled={isSubmitting || isPending}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-80"
          >
            {isSubmitting || isPending ? 'Aplicando...' : 'Aplicar'}
          </button>
          <Link href={'/finanzas' as Route} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Limpiar
          </Link>
        </div>

        {showAccountRange ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cuenta desde</label>
              <input
                name="cuentad"
                defaultValue={current.cuentad || '1'}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cuenta hasta</label>
              <input
                name="cuentah"
                defaultValue={current.cuentah || '9'}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nivel</label>
              <input
                name="nivel"
                defaultValue={current.nivel || (showPucAdvanced ? '0' : '9')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            {showBalanceAdvanced ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Auxiliar</label>
                  <select
                    name="aux"
                    defaultValue={current.aux || 'NO'}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="NO">No</option>
                    <option value="SI">Si</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Solo saldo</label>
                  <select
                    name="saldo"
                    defaultValue={current.saldo || 'NO'}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="NO">No</option>
                    <option value="SI">Si</option>
                  </select>
                </div>
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                  Filtros avanzados del balance habilitados para acercar esta vista al formulario anterior.
                </div>
              </>
            ) : null}

            {showPucAdvanced ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Practicado al</label>
                  <input
                    type="date"
                    name="practicado_al"
                    value={practicadoAlValue}
                    onChange={(event) => {
                      setManualPracticadoAl(true);
                      setPracticadoAlValue(event.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Recalcular saldos</label>
                  <select
                    name="recalcular_saldos"
                    defaultValue={current.recalcular_saldos || 'N'}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="N">No</option>
                    <option value="S">Si</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Codigo entidad</label>
                  <input
                    name="codigo_entidad"
                    value={codigoEntidadValue}
                    onChange={(event) => setCodigoEntidadValue(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <input type="checkbox" name="balance_cuentas_puc" value="SI" defaultChecked={current.balance_cuentas_puc === 'SI'} />
                  Balance cuentas del PUC
                </label>
                <input type="hidden" name="aux" value={current.aux || 'NO'} />
                <input type="hidden" name="saldo" value={current.saldo || 'NO'} />
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                  Vista PUC con filtros heredados. Si la base no soporta la estructura PUC completa, se mostrara el respaldo clasico.
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {showComprobadoAdvanced ? (
          <>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" name="incluir" value="SI" defaultChecked={current.incluir === 'SI'} />
              Cuentas con saldo cero
            </label>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 xl:col-span-2">
              Vista comprobada con saldo anterior, debito del mes, credito del mes y saldo actual, siguiendo el reporte anterior.
            </div>
          </>
        ) : null}

        {showDiarioAdvanced ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tipo asiento</label>
              <input type="hidden" name="tipoAsiento" value={selectedTipoAsiento} />
              <button
                type="button"
                onClick={() => setTipoAsientoOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
              >
                <span className="truncate">{tipoAsientoLabel(selectedTipoAsiento)}</span>
                <span className="text-cyan-700">Buscar</span>
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Fecha desde</label>
              <input
                type="date"
                name="fechad"
                defaultValue={current.fechad || ''}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Fecha hasta</label>
              <input
                type="date"
                name="fechah"
                defaultValue={current.fechah || ''}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Asientos autorizados</label>
              <select name="autorizado" defaultValue={current.autorizado || 'TO'} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="TO">Todos</option>
                <option value="SI">No</option>
                <option value="NO">Si</option>
              </select>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 xl:col-span-2">
              Libro diario con rango de fechas, tipo de asiento y agrupacion por transaccion, siguiendo el reporte anterior.
            </div>
          </>
        ) : null}

        {showMayorCuentaAdvanced || showMayorCuentaAuxAdvanced ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cuenta desde</label>
              <input type="hidden" name="cuentad" value={selectedFrom} />
              <button
                type="button"
                onClick={() => openAccountPicker('cuentad')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
              >
                <span className="truncate">{selectedFrom ? accountLabel(selectedFrom) : 'Elegir cuenta desde'}</span>
                <span className="text-cyan-700">Buscar</span>
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cuenta hasta</label>
              <input type="hidden" name="cuentah" value={selectedTo} />
              <button
                type="button"
                onClick={() => openAccountPicker('cuentah')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
              >
                <span className="truncate">{selectedTo ? accountLabel(selectedTo) : 'Elegir cuenta hasta'}</span>
                <span className="text-cyan-700">Buscar</span>
              </button>
            </div>
            {showMayorCuentaAuxAdvanced ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Auxiliar desde</label>
                  <input type="hidden" name="cuentaad" value={selectedAuxFrom} />
                  <button
                    type="button"
                    onClick={() => openAuxPicker('cuentaad')}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
                  >
                    <span className="truncate">{selectedAuxFrom ? auxLabel(selectedAuxFrom) : 'Elegir auxiliar desde'}</span>
                    <span className="text-cyan-700">Buscar</span>
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Auxiliar hasta</label>
                  <input type="hidden" name="cuentaah" value={selectedAuxTo} />
                  <button
                    type="button"
                    onClick={() => openAuxPicker('cuentaah')}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
                  >
                    <span className="truncate">{selectedAuxTo ? auxLabel(selectedAuxTo) : 'Elegir auxiliar hasta'}</span>
                    <span className="text-cyan-700">Buscar</span>
                  </button>
                </div>
              </>
            ) : null}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tipo asiento</label>
              <input type="hidden" name="tipoAsiento" value={selectedTipoAsiento} />
              <button
                type="button"
                onClick={() => setTipoAsientoOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
              >
                <span className="truncate">{tipoAsientoLabel(selectedTipoAsiento)}</span>
                <span className="text-cyan-700">Buscar</span>
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Fecha desde</label>
              <input
                type="date"
                name="fechad"
                defaultValue={current.fechad || ''}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Fecha hasta</label>
              <input
                type="date"
                name="fechah"
                defaultValue={current.fechah || ''}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" name="incluir" value="SI" defaultChecked={current.incluir === 'SI'} />
              Cuentas sin movimiento
            </label>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 xl:col-span-2">
              {showMayorCuentaAuxAdvanced
                ? 'La lista de auxiliares carga por cuenta y el detalle se consulta solo al abrir cada auxiliar.'
                : 'La lista de cuentas carga rapido y el detalle se consulta solo al abrir cada cuenta.'}
            </div>
          </>
        ) : null}
      </form>

      {isSubmitting || isPending ? (
        <div className="pointer-events-none fixed right-6 top-24 z-40 w-full max-w-sm">
          <div className="rounded-2xl border border-cyan-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Procesando informe</p>
                <p className="mt-1 text-sm font-medium text-slate-900">Consultando datos y armando el resultado...</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">{progressValue}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 transition-all duration-200"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {isSubmitting || isPending ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 top-[88px] z-30 overflow-hidden px-7 pb-8">
          <div className="h-full overflow-hidden rounded-[28px] bg-slate-50/94 backdrop-blur-[2px]">
            <div className="space-y-6 p-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-10 w-56 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full max-w-3xl animate-pulse rounded bg-slate-200" />
              </div>

              <div className="card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="card p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      ) : null}

      {tipoAsientoOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Elegir tipo de asiento</h3>
                <p className="mt-1 text-sm text-slate-500">Busca por codigo o descripcion del tipo de asiento.</p>
              </div>
              <button
                type="button"
                onClick={() => setTipoAsientoOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <input
                autoFocus
                value={tipoAsientoSearch}
                onChange={(event) => setTipoAsientoSearch(event.target.value)}
                placeholder="Buscar tipo de asiento..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <div className="max-h-[24rem] overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-slate-700">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left">Codigo</th>
                      <th className="px-4 py-3 text-left">Descripcion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className="cursor-pointer border-b border-slate-100 hover:bg-cyan-50"
                      onClick={() => selectTipoAsiento('NINGUNO')}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">TODOS</td>
                      <td className="px-4 py-3 text-slate-700">Todos los tipos de asiento</td>
                    </tr>
                    {filteredTipoAsientos.map((option) => (
                      <tr
                        key={option.value}
                        className="cursor-pointer border-b border-slate-100 hover:bg-cyan-50"
                        onClick={() => selectTipoAsiento(option.value)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{option.value}</td>
                        <td className="px-4 py-3 text-slate-700">{option.label}</td>
                      </tr>
                    ))}
                    {!filteredTipoAsientos.length ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-slate-500">Sin tipos de asiento para mostrar.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {pickerTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {pickerTarget === 'cuentad' ? 'Elegir cuenta desde' : 'Elegir cuenta hasta'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">Busca por codigo o nombre de la cuenta.</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerTarget(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <input
                autoFocus
                value={pickerSearch}
                onChange={(event) => setPickerSearch(event.target.value)}
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
                        onClick={() => selectAccount(option.value)}
                        onDoubleClick={() => selectAccount(option.value)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{option.value}</td>
                        <td className="px-4 py-3 text-slate-700">{option.label.replace(new RegExp(`^${option.value}\\s*[Â·-]?\\s*`), '')}</td>
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

      {auxPickerTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {auxPickerTarget === 'cuentaad' ? 'Elegir auxiliar desde' : 'Elegir auxiliar hasta'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">Busca por codigo de auxiliar, cuenta o nombre.</p>
              </div>
              <button
                type="button"
                onClick={() => setAuxPickerTarget(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600"
              >
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
                        onClick={() => selectAux(option.value)}
                        onDoubleClick={() => selectAux(option.value)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{option.auxCode}</td>
                        <td className="px-4 py-3 text-slate-700">{option.name}</td>
                        <td className="px-4 py-3 text-slate-700">{option.accountCode}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Sin auxiliares para mostrar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

