import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';
import { ReportContextCard } from '@/components/ui/report-context-card';
import { BalanceComprobadoTable } from '@/components/finanzas/balance-comprobado-table';
import { DiarioComprobadoPanel } from '@/components/finanzas/diario-comprobado-panel';
import { BalanceIntegralPanel } from '@/components/finanzas/balance-integral-panel';
import { MayorCuentaPanel } from '@/components/finanzas/mayor-cuenta-panel';
import { MayorCuentaAuxPanel } from '@/components/finanzas/mayor-cuenta-aux-panel';
import { BalanceTable } from '@/components/finanzas/balance-table';
import { CashflowSummaryAsync } from '@/components/finanzas/cashflow-summary-async';
import { FinanceFilters } from '@/components/finanzas/finance-filters';
import { PayablesKpiAsync, PayablesTableAsync } from '@/components/finanzas/payables-async';
import { getBalanceComprobado, getBalanceGeneral, getBalanceGeneralPuc, getBalanceIntegralAuxiliares, getCuentaAuxSelect, getCuentaPlancta, getDiarioComprobado, getEmpresaMeta, getMayorCuentaAuxCab, getMayorCuentaCab, getTipoAsientoOptions } from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';
import { getSessionUser } from '@/lib/auth-server';
import { loadBrandingConfig } from '@/lib/admin-config';
import { AccountPlanOption, AuxiliarOption, BalanceAuxRow, BalanceRow, DiarioRow, SelectOption } from '@/types/finanzas';

function currentYear() {
  return String(new Date().getFullYear());
}

function currentMonth() {
  return String(new Date().getMonth() + 1).padStart(2, '0');
}

function startOfMonth(periodo: string, mes: string) {
  return `${periodo}-${mes}-01`;
}

function endOfMonth(periodo: string, mes: string) {
  const date = new Date(Number(periodo), Number(mes), 0);
  return `${periodo}-${mes}-${String(date.getDate()).padStart(2, '0')}`;
}

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
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

function normalizeOption(item: Record<string, string>): SelectOption {
  const value = item.cod_empresa || item.Cod_Empresa || item.codigo || item.Codigo || item.value || '';
  const label = item.des_empresa || item.Des_Empresa || item.descripcion || item.Descripcion || item.label || value;
  return { value, label: value && label && value !== label ? `${value} · ${label}` : label || value };
}

function sanitizeOptions(items: Array<Record<string, string>> | undefined | null): SelectOption[] {
  const seen = new Set<string>();
  const result: SelectOption[] = [];

  for (const item of items || []) {
    const option = normalizeOption(item);
    const value = String(option.value || '').trim();
    const label = String(option.label || '').trim();

    if (!value || !label) continue;
    if (seen.has(value)) continue;

    seen.add(value);
    result.push({ value, label });
  }

  return result;
}

function getEmpresaCodigoEntidad(meta: Record<string, string>) {
  return String(
    meta.codigo_entidad ||
    meta.Codigo_Entidad ||
    meta.codigo_identidad ||
    meta.Codigo_Identidad ||
    meta.cod_identidad ||
    meta.Cod_Identidad ||
    meta.cod_ident ||
    meta.Cod_Ident ||
    '',
  ).trim();
}

function getCode(row: BalanceRow) {
  return String(row.CodPlanCta || row.codplancta || '');
}

function getName(row: BalanceRow) {
  return String(row.Nombre || row.nombre || '').toLowerCase();
}

function getSaldo(row: BalanceRow) {
  return toNumber(row.SALDO || row.saldo);
}

function getSaldoLocal(row: BalanceRow) {
  return toNumber(row.SALDO_LOCAL || row.saldo_local || row.SALDO || row.saldo);
}

function getSaldoME(row: BalanceRow) {
  return toNumber(row.SALDO_ME || row.saldo_me);
}

function monthLabel(value: string) {
  const labels: Record<string, string> = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre',
  };
  return labels[value] || value;
}

function getRowKey(row: BalanceRow) {
  const code = getCode(row);
  if (code) return code;
  return getName(row);
}

function mergeBalanceRows(localRows: BalanceRow[], foreignRows: BalanceRow[]) {
  const merged = new Map<string, BalanceRow>();
  const order: string[] = [];

  const ensureRow = (row: BalanceRow) => {
    const key = getRowKey(row);
    if (!key) return null;

    if (!merged.has(key)) {
      merged.set(key, {
        ...row,
        SALDO_LOCAL: 0,
        SALDO_ME: 0,
        TOTAL_DEBITOME: 0,
        TOTAL_CREDITOME: 0,
      });
      order.push(key);
    }

    return merged.get(key) || null;
  };

  for (const row of localRows) {
    const target = ensureRow(row);
    if (!target) continue;
    target.SALDO_LOCAL = row.SALDO || row.saldo || 0;
    target.TOTAL_DEBITO = row.TOTAL_DEBITO || row.total_debito || 0;
    target.TOTAL_CREDITO = row.TOTAL_CREDITO || row.total_credito || 0;
    target.SALDO = row.SALDO || row.saldo || 0;
  }

  for (const row of foreignRows) {
    const target = ensureRow(row);
    if (!target) continue;
    target.SALDO_ME = row.SALDO || row.saldo || 0;
    target.TOTAL_DEBITOME = row.TOTAL_DEBITO || row.total_debito || 0;
    target.TOTAL_CREDITOME = row.TOTAL_CREDITO || row.total_credito || 0;
  }

  return order.map((key) => merged.get(key)).filter(Boolean) as BalanceRow[];
}

type BalanceResponseLike = {
  data: BalanceRow[];
  resultado?: { local?: number; extranjera?: number };
  warning?: string;
} | null;

function monthRange(mesd: string, mesh: string) {
  const from = Number(mesd);
  const to = Number(mesh);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from <= 0 || to <= 0 || from > 12 || to > 12 || from > to) {
    return [mesd];
  }
  const result: string[] = [];
  for (let month = from; month <= to; month += 1) {
    result.push(String(month).padStart(2, '0'));
  }
  return result;
}

function previousPeriod(periodo: string, mes: string) {
  const year = Number(periodo);
  const month = Number(mes);
  if (month <= 1) {
    return {
      periodoant: String(year - 1),
      mesant: '12',
    };
  }
  return {
    periodoant: String(year),
    mesant: String(month - 1).padStart(2, '0'),
  };
}

function normalizeTipoAsientoOption(item: Record<string, string>): SelectOption {
  const value = item.TipoAsiento || item.tipoasiento || item.value || '';
  const label = item.Descrip || item.descrip || item.label || value;
  return { value, label };
}

function sanitizeTipoAsientos(items: Array<Record<string, string>> | undefined | null): SelectOption[] {
  const seen = new Set<string>();
  const result: SelectOption[] = [];
  for (const item of items || []) {
    const option = normalizeTipoAsientoOption(item);
    const value = String(option.value || '').trim();
    const label = String(option.label || '').trim();
    if (!value || !label || seen.has(value)) continue;
    seen.add(value);
    result.push({ value, label });
  }
  return result;
}

function normalizeCuentaOption(item: Record<string, string>): SelectOption {
  const value = item.CodPlanCta || item.codplancta || item.codigo || item.value || '';
  const rawLabel = item.Nombre || item.nombre || item.descripcion || item.label || value;
  const normalizedLabel = String(rawLabel || '').replace(new RegExp(`^${String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[·-]?\\s*`), '').trim();
  return { value, label: normalizedLabel ? `${value} · ${normalizedLabel}` : value };
}

function sanitizeCuentaOptions(items: Array<Record<string, string>> | undefined | null): SelectOption[] {
  const seen = new Set<string>();
  const result: SelectOption[] = [];
  for (const item of items || []) {
    const option = normalizeCuentaOption(item);
    const value = String(option.value || '').trim();
    const label = String(option.label || '').trim();
    if (!value || !label || seen.has(value)) continue;
    seen.add(value);
    result.push({ value, label });
  }
  return result;
}

function normalizeCuentaPlanOption(item: Record<string, string>): AccountPlanOption {
  const base = normalizeCuentaOption(item);
  const nivel = String(item.nivel || item.Nivel || '').trim();
  const levelNumber = Number(nivel || 0);
  const indent = Number.isFinite(levelNumber) && levelNumber > 1 ? '\u00A0\u00A0'.repeat(Math.min(levelNumber - 1, 8)) : '';
  const name = String(item.Nombre || item.nombre || item.descripcion || '').trim() || base.value;
  return {
    value: base.value,
    label: `${base.value} · ${indent}${name}`,
    name,
    imputable: String(item.imputable || item.Imputable || '').trim(),
    auxiliar: String(item.auxiliar || item.Auxiliar || '').trim(),
    moneda: String(item.codmoneda || item.CodMoneda || '').trim(),
    nivel,
  };
}

function sanitizeCuentaPlanOptions(items: Array<Record<string, string>> | undefined | null): AccountPlanOption[] {
  const seen = new Set<string>();
  const result: AccountPlanOption[] = [];
  for (const item of items || []) {
    const option = normalizeCuentaPlanOption(item);
    const value = String(option.value || '').trim();
    const label = String(option.label || '').trim();
    if (!value || !label || seen.has(value)) continue;
    seen.add(value);
    result.push(option);
  }
  return result;
}

function normalizeAuxiliarOption(item: Record<string, string>): AuxiliarOption {
  const rawValue = item.CodPlanAux || item.codplanaux || item.codigo || item.value || '';
  const accountCode = String(rawValue).includes('-') ? String(rawValue).split('-').slice(1).join('-').trim() : '';
  const auxCode = String(rawValue).includes('-') ? String(rawValue).split('-')[0].trim() : String(rawValue || '').trim();
  const rawLabel = item.Nombre || item.nombre || item.descripcion || item.label || rawValue;
  const cleaned = String(rawLabel || '').replace(/^.+?\s*-\s*/, '').trim();
  return {
    value: auxCode || String(rawValue || '').trim(),
    label: cleaned ? `${auxCode} · ${cleaned}` : auxCode,
    auxCode,
    accountCode,
    name: cleaned || auxCode,
  };
}

function sanitizeAuxiliarOptions(items: Array<Record<string, string>> | undefined | null): AuxiliarOption[] {
  const seen = new Set<string>();
  const result: AuxiliarOption[] = [];
  for (const item of items || []) {
    const option = normalizeAuxiliarOption(item);
    const key = `${option.auxCode}:${option.accountCode}`;
    if (!option.value || seen.has(key)) continue;
    seen.add(key);
    result.push(option);
  }
  return result;
}

export default async function FinanzasPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const sessionUser = await getSessionUser();
  const requestedEmpresa = String(params.empresa || '').trim();
  const section = String(params.section || '');
  const hasSubmittedFilters = ['empresa', 'periodo', 'mesd', 'mesh', 'moneda'].some((key) => {
    const value = params[key];
    return typeof value === 'string' && value.trim() !== '';
  });
  const periodo = String(params.periodo || currentYear());
  const mesd = String(params.mesd || '01').padStart(2, '0');
  const mesh = String(params.mesh || currentMonth()).padStart(2, '0');
  const moneda = String(params.moneda || 'local');
  const cuentad = String(params.cuentad || '1');
  const cuentah = String(params.cuentah || '9');
  const nivel = String(params.nivel || '9');
  const aux = String(params.aux || 'NO');
  const saldo = String(params.saldo || 'NO');
  const practicadoAl = String(params.practicado_al || '');
  const recalcularSaldos = String(params.recalcular_saldos || 'N');
  const codigoEntidad = String(params.codigo_entidad || '');
  const balanceCuentasPuc = String(params.balance_cuentas_puc || 'NO');
  const incluir = String(params.incluir || 'NO');
  const cuentaad = String(params.cuentaad || '');
  const cuentaah = String(params.cuentaah || '');
  const tipoAsiento = String(params.tipoAsiento || 'NINGUNO');
  const autorizado = String(params.autorizado || 'TO');
  const fechad = String(params.fechad || startOfMonth(periodo, mesd));
  const fechah = String(params.fechah || endOfMonth(periodo, mesh));
  const isFocusedSection = Boolean(section);
  const shouldLoadBalance = hasSubmittedFilters && (!section || section === 'balance-general' || section === 'resumen-financiero');
  const shouldUseFullBalance = section === 'balance-general';
  const shouldMergeClassicBoth = shouldUseFullBalance && moneda === 'ambas';
  const shouldLoadBalanceIntegral = hasSubmittedFilters && section === 'balance-integral';
  const shouldLoadBalancePuc = hasSubmittedFilters && section === 'balance-general-puc';
  const shouldLoadBalanceComprobado = hasSubmittedFilters && section === 'balance-general-comprobado';
  const shouldLoadLibroDiario = hasSubmittedFilters && section === 'libro-diario';
  const shouldLoadMayorCuenta = hasSubmittedFilters && section === 'mayor-cuenta';
  const shouldLoadMayorCuentaAux = hasSubmittedFilters && section === 'mayor-cuenta-aux';
  const shouldLoadPayables = hasSubmittedFilters && (!section || section === 'cuentas-pagar' || section === 'resumen-financiero');
  const shouldLoadFlowcash = hasSubmittedFilters && (!section || section === 'flujo-fondo' || section === 'resumen-financiero');
  const empresasPromise = getScopedEmpresas();
  const tipoAsientoPromise = shouldLoadLibroDiario || section === 'libro-diario' || section === 'mayor-cuenta' || section === 'mayor-cuenta-aux'
    ? getTipoAsientoOptions()
    : Promise.resolve(null);
  const cuentaOptionsPromise = (section === 'mayor-cuenta' || section === 'mayor-cuenta-aux') && requestedEmpresa
    ? getCuentaPlancta({
        empresa: requestedEmpresa,
        periodo,
      })
    : Promise.resolve(null);
  const auxiliarOptionsPromise = section === 'mayor-cuenta-aux' && requestedEmpresa
    ? getCuentaAuxSelect({
        empresa: requestedEmpresa,
        periodo,
      })
    : Promise.resolve(null);
  const requestedEmpresaMetaResponse = shouldLoadBalancePuc && requestedEmpresa
    ? await getEmpresaMeta(requestedEmpresa)
    : null;
  const requestedEmpresaCodigoEntidad = codigoEntidad || getEmpresaCodigoEntidad((requestedEmpresaMetaResponse?.data || {}) as Record<string, string>);
  const initialBalancePromise = requestedEmpresa && hasSubmittedFilters && shouldLoadBalance
    ? (shouldUseFullBalance ? getBalanceGeneralPuc({
        empresa: requestedEmpresa,
        periodo,
        mesd,
        mesh,
        moneda,
        cuentad,
        cuentah,
        nivel,
        aux,
        saldo,
        practicado_al: practicadoAl,
        recalcular_saldos: recalcularSaldos,
        codigo_entidad: requestedEmpresaCodigoEntidad,
        balance_cuentas_puc: balanceCuentasPuc,
      }) : getBalanceGeneral({
        empresa: requestedEmpresa,
        periodo,
        mesd,
        mesh,
        moneda,
        cuentad,
        cuentah,
        nivel,
        aux,
        saldo,
      }))
    : Promise.resolve(null);

  const empresasResponse = await empresasPromise;
  const tipoAsientoResponse = await tipoAsientoPromise;
  const cuentaOptionsResponse = await cuentaOptionsPromise;
  const auxiliarOptionsResponse = await auxiliarOptionsPromise;
  const empresas = sanitizeOptions((empresasResponse?.data || []) as Array<Record<string, string>>);
  const tipoAsientos = sanitizeTipoAsientos((tipoAsientoResponse?.data || []) as Array<Record<string, string>>);
  const empresa = String(requestedEmpresa || empresas[0]?.value || '');
  const cuentaOptionsRaw = (cuentaOptionsResponse?.data || []) as Array<Record<string, string>>;
  const cuentaOptions = requestedEmpresa
    ? sanitizeCuentaPlanOptions(cuentaOptionsRaw)
    : (section === 'mayor-cuenta' || section === 'mayor-cuenta-aux') && empresa
      ? sanitizeCuentaPlanOptions(((await getCuentaPlancta({ empresa, periodo }))?.data || []) as Array<Record<string, string>>)
      : [];
  const auxiliarOptionsRaw = (auxiliarOptionsResponse?.data || []) as Array<Record<string, string>>;
  const auxiliarOptions = requestedEmpresa
    ? sanitizeAuxiliarOptions(auxiliarOptionsRaw)
    : section === 'mayor-cuenta-aux' && empresa
      ? sanitizeAuxiliarOptions(((await getCuentaAuxSelect({ empresa, periodo }))?.data || []) as Array<Record<string, string>>)
      : [];
  const balanceResponse = requestedEmpresa
    ? await initialBalancePromise
    : empresa && hasSubmittedFilters && shouldLoadBalance
      ? await (shouldUseFullBalance
        ? getBalanceGeneralPuc({
            empresa,
            periodo,
            mesd,
            mesh,
            moneda,
            cuentad,
            cuentah,
            nivel,
            aux,
            saldo,
            practicado_al: practicadoAl,
            recalcular_saldos: recalcularSaldos,
            codigo_entidad: requestedEmpresaCodigoEntidad,
            balance_cuentas_puc: balanceCuentasPuc,
          })
        : getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda, cuentad, cuentah, nivel, aux, saldo }))
      : null;
  const balanceResponseWithResult = balanceResponse as BalanceResponseLike;

  const shouldFallbackToLegacyBalance = shouldUseFullBalance
    && empresa
    && hasSubmittedFilters
    && (
      !Array.isArray(balanceResponse?.data)
      || balanceResponse.data.length === 0
    );

  const legacyBalanceResponse = shouldFallbackToLegacyBalance
    ? await getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda, cuentad, cuentah, nivel, aux, saldo })
    : null;

  const mergedClassicBothResponses = shouldFallbackToLegacyBalance && shouldMergeClassicBoth
    ? await Promise.all([
        getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda: 'local', cuentad, cuentah, nivel, aux, saldo }),
        getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda: 'extranjera', cuentad, cuentah, nivel, aux, saldo }),
      ])
    : null;

  const mergedClassicRows = mergedClassicBothResponses
    ? mergeBalanceRows(
        (mergedClassicBothResponses[0]?.data || []) as BalanceRow[],
        (mergedClassicBothResponses[1]?.data || []) as BalanceRow[],
      )
    : [];

  const effectiveBalanceResponse: BalanceResponseLike = shouldFallbackToLegacyBalance
    ? shouldMergeClassicBoth
      ? {
          data: mergedClassicRows,
          resultado: {
            local: balanceResponseWithResult?.resultado?.local,
            extranjera: balanceResponseWithResult?.resultado?.extranjera,
          },
        }
      : legacyBalanceResponse?.data?.length
        ? legacyBalanceResponse
        : balanceResponse
    : balanceResponse;

  const balanceRows = ((effectiveBalanceResponse?.data || []) as BalanceRow[]);
  const comprasStart = startOfMonth(periodo, mesd);
  const comprasEnd = endOfMonth(periodo, mesh);

  const totalActivo = balanceRows.filter((row) => getCode(row).startsWith('1')).reduce((acc, row) => acc + getSaldo(row), 0);
  const totalPasivo = balanceRows.filter((row) => getCode(row).startsWith('2')).reduce((acc, row) => acc + getSaldo(row), 0);
  const patrimonio = balanceRows.filter((row) => getCode(row).startsWith('3')).reduce((acc, row) => acc + getSaldo(row), 0);
  const resultadoApi = effectiveBalanceResponse?.resultado || {};
  const resultado = typeof resultadoApi.local === 'number'
    ? resultadoApi.local
    : balanceRows
        .filter((row) => getCode(row).startsWith('4') || getCode(row).startsWith('5') || getName(row).includes('resultado'))
        .reduce((acc, row) => acc + getSaldo(row), 0);
  const resultadoME = typeof resultadoApi.extranjera === 'number'
    ? resultadoApi.extranjera
    : balanceRows
        .filter((row) => getCode(row).startsWith('4') || getCode(row).startsWith('5') || getName(row).includes('resultado'))
        .reduce((acc, row) => acc + getSaldoME(row), 0);

  const empresaLabel = empresas.find((item) => item.value === empresa)?.label || empresa;
  const mesLabel = `${mesd}/${periodo} - ${mesh}/${periodo}`;
  const monedaLabel = moneda === 'ambas' ? 'Ambas' : moneda === 'extranjera' ? 'Extranjera' : 'Local';
  const reportMeta = [
    { label: 'Empresa', value: empresaLabel },
    { label: 'Periodo', value: periodo },
    { label: 'Rango', value: mesLabel },
    { label: 'Moneda', value: monedaLabel },
    { label: 'Usuario', value: sessionUser?.displayName || sessionUser?.username || 'Usuario' },
  ];
  const empresaMetaResponse = shouldLoadBalancePuc && empresa
    ? requestedEmpresa && empresa === requestedEmpresa
      ? requestedEmpresaMetaResponse
      : await getEmpresaMeta(empresa)
    : null;
  const empresaMeta = (empresaMetaResponse?.data || {}) as Record<string, string>;
  const empresaCodigoEntidad = codigoEntidad || getEmpresaCodigoEntidad(empresaMeta);
  const brandingConfig = empresa ? await loadBrandingConfig(empresa) : null;
  const exportBranding = brandingConfig
    ? {
        clientName: brandingConfig.clientName || undefined,
        tagline: brandingConfig.tagline || undefined,
        logoUrl: brandingConfig.logoUrl || undefined,
        faviconUrl: brandingConfig.faviconUrl || undefined,
      }
    : undefined;

  const current = { empresa, periodo, mesd, mesh, moneda, cuentad, cuentah, nivel, aux, saldo, section };
  const currentWithSection = {
    empresa,
    periodo,
    mesd,
    mesh,
    moneda,
    cuentad,
    cuentah,
    nivel,
    aux,
    saldo,
    section,
    practicado_al: practicadoAl,
    recalcular_saldos: recalcularSaldos,
    codigo_entidad: empresaCodigoEntidad,
    balance_cuentas_puc: balanceCuentasPuc,
    incluir,
    tipoAsiento,
    autorizado,
    fechad,
    fechah,
    cuentaad,
    cuentaah,
  };
  const connectionWarning = !empresa
    ? 'No se encontraron empresas configuradas en el API.'
    : hasSubmittedFilters && shouldLoadBalance && !effectiveBalanceResponse
      ? 'No se pudo obtener informacion financiera para este filtro. Revisa la conexion o intenta nuevamente.'
      : '';
  const fallbackWarning = shouldFallbackToLegacyBalance && shouldMergeClassicBoth && mergedClassicRows.length
      ? 'Se combinaron los balances clasicos en local y extranjera para reconstruir la vista de ambas monedas.'
    : shouldFallbackToLegacyBalance && legacyBalanceResponse?.data?.length
      ? 'Se uso el balance clasico como respaldo porque la vista completa no pudo generarse con la estructura actual de la base.'
    : '';

  const integralLocalPromise = shouldLoadBalanceIntegral && empresa
    ? getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda: 'local', cuentad, cuentah, nivel: 9, aux: 'NO', saldo: 'SI' })
    : Promise.resolve(null);
  const integralForeignPromise = shouldLoadBalanceIntegral && empresa
    ? getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda: 'extranjera', cuentad, cuentah, nivel: 9, aux: 'NO', saldo: 'SI' })
    : Promise.resolve(null);
  const integralAuxPromise = shouldLoadBalanceIntegral && empresa
    ? getBalanceIntegralAuxiliares({
        empresa,
        periodo,
        mesd,
        mesh,
        moneda: moneda === 'extranjera' ? 'extranjera' : 'local',
        cuentad: '1',
        cuentah: '9',
        fechad: startOfMonth(periodo, mesd),
        fechah: endOfMonth(periodo, mesh),
        limit: 10,
      })
    : Promise.resolve(null);
  const monthlyMonths = shouldLoadBalanceIntegral ? monthRange(mesd, mesh) : [];
  const monthlyIntegralPromise = shouldLoadBalanceIntegral && empresa
    ? Promise.all(
        monthlyMonths.map(async (month) => {
          const response = await getBalanceGeneral({
            empresa,
            periodo,
            mesd: month,
            mesh: month,
            moneda: moneda === 'extranjera' ? 'extranjera' : 'local',
            cuentad: '1',
            cuentah: '9',
            nivel: 9,
            aux: 'NO',
            saldo: 'SI',
          });
          const rows = (response?.data || []) as BalanceRow[];
          const ingresos = rows
            .filter((row) => /^INGRESOS$/i.test(String(row.Nombre || row.nombre || '')))
            .reduce((acc, row) => acc + Math.abs(getSaldo(row)), 0);
          const egresos = rows
            .filter((row) => /^EGRESOS$/i.test(String(row.Nombre || row.nombre || '')))
            .reduce((acc, row) => acc + Math.abs(getSaldo(row)), 0);
          return { month, ingresos, egresos, resultado: ingresos - egresos };
        }),
      )
    : Promise.resolve([]);
  const [integralLocalResponse, integralForeignResponse, integralAuxResponse, integralMonthlyRows] = shouldLoadBalanceIntegral
    ? await Promise.all([integralLocalPromise, integralForeignPromise, integralAuxPromise, monthlyIntegralPromise])
    : [null, null, null, [] as Array<{ month: string; ingresos: number; egresos: number; resultado: number }>];
  const integralLocalRows = ((integralLocalResponse?.data || []) as BalanceRow[]);
  const integralForeignRows = ((integralForeignResponse?.data || []) as BalanceRow[]);
  const integralClientes = ((integralAuxResponse?.clientes || []) as BalanceAuxRow[]);
  const integralProveedores = ((integralAuxResponse?.proveedores || []) as BalanceAuxRow[]);
  const integralWarning = integralAuxResponse?.warning || '';
  const pucPrimaryResponse = shouldLoadBalancePuc && empresa
    ? await getBalanceGeneralPuc({
        empresa,
        periodo,
        mesd,
        mesh,
        moneda,
        cuentad,
        cuentah,
        nivel: nivel || '0',
        aux,
        saldo,
        practicado_al: practicadoAl,
        recalcular_saldos: recalcularSaldos,
        codigo_entidad: empresaCodigoEntidad,
        balance_cuentas_puc: balanceCuentasPuc,
      })
    : null;
  const shouldFallbackPuc = shouldLoadBalancePuc && (
    !Array.isArray(pucPrimaryResponse?.data) || pucPrimaryResponse.data.length === 0
  );
  const pucClassicLocal = shouldFallbackPuc
    ? await getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda: 'local', cuentad, cuentah, nivel: nivel || '0', aux, saldo })
    : null;
  const pucClassicForeign = shouldFallbackPuc && moneda === 'ambas'
    ? await getBalanceGeneral({ empresa, periodo, mesd, mesh, moneda: 'extranjera', cuentad, cuentah, nivel: nivel || '0', aux, saldo })
    : null;
  const pucRows = shouldFallbackPuc
    ? moneda === 'ambas'
      ? mergeBalanceRows(
          ((pucClassicLocal?.data || []) as BalanceRow[]),
          ((pucClassicForeign?.data || []) as BalanceRow[]),
        )
      : ((pucClassicLocal?.data || []) as BalanceRow[])
    : ((pucPrimaryResponse?.data || []) as BalanceRow[]);
  const pucWarning = shouldFallbackPuc
    ? (pucPrimaryResponse?.warning || 'La estructura PUC no pudo generarse con esta base. Se muestra el balance clasico como respaldo.')
    : (pucPrimaryResponse?.warning || '');
  const pucResult = shouldFallbackPuc
    ? (moneda === 'ambas' ? (pucPrimaryResponse?.resultado?.local ?? 0) : moneda === 'extranjera' ? 0 : resultado)
    : (pucPrimaryResponse?.resultado?.local ?? 0);
  const pucResultME = shouldFallbackPuc
    ? (moneda === 'ambas' ? (pucPrimaryResponse?.resultado?.extranjera ?? 0) : moneda === 'extranjera' ? resultado : 0)
    : (pucPrimaryResponse?.resultado?.extranjera ?? 0);
  const comprobadoPrev = previousPeriod(periodo, mesd);
  const comprobadoResponse = shouldLoadBalanceComprobado && empresa
    ? await getBalanceComprobado({
        empresa,
        periodo,
        periodoant: comprobadoPrev.periodoant,
        mes: mesd,
        mesant: comprobadoPrev.mesant,
        nivel,
        moneda,
      })
    : null;
  const comprobadoRows = ((comprobadoResponse?.data || []) as BalanceRow[]);
  const comprobadoWarning = comprobadoResponse?.warning || '';
  const diarioResponse = shouldLoadLibroDiario && empresa
    ? await getDiarioComprobado({
        empresa,
        tipoasiento: tipoAsiento,
        fechad,
        fechah,
        autorizado,
      })
    : null;
  const diarioRows = ((diarioResponse?.data || []) as DiarioRow[]);
  const mayorCabResponse = shouldLoadMayorCuenta && empresa
    ? await getMayorCuentaCab({
        empresa,
        periodo,
        fechad,
        fechah,
        tipoasiento: tipoAsiento,
        cuentad: cuentad || 'NINGUNA',
        cuentah: cuentah || 'NINGUNA',
        incluir,
      })
    : null;
  const mayorAuxCabResponse = shouldLoadMayorCuentaAux && empresa
    ? await getMayorCuentaAuxCab({
        empresa,
        periodo,
        fechad,
        fechah,
        tipoasiento: tipoAsiento,
        cuentad: cuentad || 'NINGUNA',
        cuentah: cuentah || 'NINGUNA',
        incluir,
        cuentaad: cuentaad || 'NINGUNA',
        cuentaah: cuentaah || 'NINGUNA',
      })
    : null;
  const mayorAccounts = Array.isArray(mayorCabResponse?.[0]?.data1) ? mayorCabResponse[0].data1 : [];
  const mayorParents = Array.isArray(mayorCabResponse?.[1]?.data2) ? mayorCabResponse[1].data2 : [];
  const mayorAccountMap = new Map<string, Array<{ code: string; name: string }>>();
  for (const account of mayorAccounts) {
    const parentCode = String(account.Codplanctapad || account.codplanctapad || '');
    if (!parentCode) continue;
    const bucket = mayorAccountMap.get(parentCode) || [];
    bucket.push({
      code: String(account.Codplancta || account.codplancta || ''),
      name: String(account.NOMBREPLANCTA || account.nombreplancta || ''),
    });
    mayorAccountMap.set(parentCode, bucket);
  }
  const mayorGroups = mayorParents.map((parent) => ({
    parentCode: String(parent.Codplanctapad || parent.codplanctapad || ''),
    parentName: String(parent.NOMBREPLANCTAPAD || parent.nombreplanctapad || ''),
    accounts: mayorAccountMap.get(String(parent.Codplanctapad || parent.codplanctapad || '')) || [],
  })).filter((group) => group.accounts.length > 0);
  const mayorAuxAccounts = Array.isArray(mayorAuxCabResponse?.[0]?.data1) ? mayorAuxCabResponse[0].data1 : [];
  const mayorAuxParents = Array.isArray(mayorAuxCabResponse?.[1]?.data2) ? mayorAuxCabResponse[1].data2 : [];
  const mayorAuxMap = new Map<string, Array<{ auxCode: string; auxName: string; accountCode: string; accountName: string }>>();
  for (const auxItem of mayorAuxAccounts) {
    const accountCode = String(auxItem.CodPlanCta || auxItem.codplancta || '');
    if (!accountCode) continue;
    const bucket = mayorAuxMap.get(accountCode) || [];
    bucket.push({
      auxCode: String(auxItem.CodPlanAux || auxItem.codplanaux || ''),
      auxName: String(auxItem.Auxiliar || auxItem.auxiliar || ''),
      accountCode,
      accountName: String(auxItem.Cuenta || auxItem.cuenta || ''),
    });
    mayorAuxMap.set(accountCode, bucket);
  }
  const mayorAuxGroups = mayorAuxParents.map((parent) => {
    const accountCode = String(parent.CodPlanCta || parent.codplancta || '');
    return {
      accountCode,
      accountName: String(parent.Cuenta || parent.cuenta || ''),
      auxiliares: mayorAuxMap.get(accountCode) || [],
    };
  }).filter((group) => group.auxiliares.length > 0);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Informes gerenciales"
        title="Finanzas"
        description="Consulta balances, flujo financiero, libros contables y saldos de proveedores con filtros ejecutivos y exportacion de resultados."
      />

      <FinanceFilters empresas={empresas} current={currentWithSection} tipoAsientos={tipoAsientos} accountOptions={cuentaOptions} auxOptions={auxiliarOptions} />

      {empresa ? (
        <>
          <ReportContextCard
            empresa={empresaLabel}
            periodo={periodo}
            rango={mesLabel}
            moneda={monedaLabel}
            usuario={sessionUser?.displayName || sessionUser?.username || 'Usuario'}
          />
        </>
      ) : null}

      {!hasSubmittedFilters && empresa ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          Selecciona los filtros y presiona Aplicar para consultar datos de finanzas. Asi la entrada al modulo es mas rapida.
        </div>
      ) : null}

      {connectionWarning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{connectionWarning}</div>
      ) : null}

      {fallbackWarning ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{fallbackWarning}</div>
      ) : null}

      {shouldLoadBalanceIntegral && integralWarning ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{integralWarning}</div>
      ) : null}

      {!isFocusedSection || section === 'resumen-financiero' ? (
        <section id="resumen-financiero" className="scroll-mt-28 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <KpiCard item={{ title: 'Activo visible', value: formatKpiAmount(totalActivo), change: periodo, trend: 'up' }} />
          <KpiCard item={{ title: 'Pasivo visible', value: formatKpiAmount(totalPasivo), change: 'Balance actual', trend: totalPasivo > 0 ? 'neutral' : 'up' }} />
          <KpiCard item={{ title: 'Patrimonio', value: formatKpiAmount(patrimonio), change: moneda, trend: 'up' }} />
          <KpiCard item={{ title: 'Resultado visible', value: formatKpiAmount(resultado), change: `Corte ${mesh}/${periodo}`, trend: resultado >= 0 ? 'up' : 'down' }} />
          {hasSubmittedFilters && shouldLoadPayables ? (
            <PayablesKpiAsync empresa={empresa} periodo={periodo} comprasStart={comprasStart} comprasEnd={comprasEnd} />
          ) : (
            <KpiCard item={{ title: 'Cuentas por pagar', value: '0', change: 'Sin consulta', trend: 'neutral' }} />
          )}
        </section>
      ) : null}

      {!isFocusedSection || section === 'flujo-fondo' || section === 'cuentas-pagar' ? (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          {!isFocusedSection || section === 'flujo-fondo' ? (
            <div id="flujo-fondo" className="scroll-mt-28">
              {hasSubmittedFilters && shouldLoadFlowcash ? (
                <CashflowSummaryAsync
                  empresa={empresa}
                  periodo={periodo}
                  mes={mesh}
                  autoload={section === 'flujo-fondo'}
                />
              ) : (
                <div className="card p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Flujo de caja mensual</h2>
                  <p className="mt-1 text-sm text-slate-500">Este bloque se consulta cuando aplicas los filtros del modulo.</p>
                </div>
              )}
            </div>
          ) : null}
          {!isFocusedSection || section === 'cuentas-pagar' ? (
            <div id="cuentas-pagar" className="scroll-mt-28">
              {hasSubmittedFilters && shouldLoadPayables ? (
                <PayablesTableAsync
                  empresa={empresa}
                  periodo={periodo}
                  comprasStart={comprasStart}
                  comprasEnd={comprasEnd}
                  autoload={section === 'cuentas-pagar'}
                />
              ) : (
                <div className="card p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Cuentas por pagar</h2>
                  <p className="mt-1 text-sm text-slate-500">Este bloque se consulta cuando aplicas los filtros del modulo.</p>
                </div>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {!isFocusedSection || section === 'balance-general' ? (
        <div id="balance-general" className="scroll-mt-28">
          <BalanceTable
            rows={balanceRows}
            result={resultado}
            resultME={resultadoME}
            moneda={moneda}
            exportMeta={reportMeta}
            exportBranding={exportBranding}
            scheduleConfig={{
              reportKey: 'finanzas.balance_general',
              reportModule: 'Finanzas',
              reportParams: {
                empresa,
                periodo,
                mesd,
                mesh,
                moneda,
                cuentad,
                cuentah,
                nivel,
                aux,
                saldo,
                section: 'balance-general',
              },
            }}
          />
        </div>
      ) : null}

      {shouldLoadBalancePuc ? (
        <div id="balance-general-puc" className="scroll-mt-28 space-y-3">
          {pucWarning ? (
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{pucWarning}</div>
          ) : null}
          <BalanceTable
            rows={pucRows}
            result={pucResult}
            resultME={pucResultME}
            moneda={moneda}
            title="Balance general PUC"
            description="Vista basada en el informe PUC anterior. Cuando la base no soporta la estructura completa, se usa el balance clasico como respaldo."
            showPucMapping={balanceCuentasPuc === 'SI'}
            exportMeta={reportMeta}
            exportBranding={exportBranding}
            pucExport={{
              codigoEntidad: empresaCodigoEntidad,
              periodo,
              mesh,
              esCasaDeBolsa: String(empresaMeta.es_casa_de_bolsa || '').trim().toUpperCase() === 'S',
              ruc: String(empresaMeta.ruc || empresaMeta.ruc_base || '').trim(),
            }}
          />
        </div>
      ) : null}

      {shouldLoadBalanceComprobado ? (
        <div className="space-y-3">
          {comprobadoWarning ? (
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{comprobadoWarning}</div>
          ) : null}
          <BalanceComprobadoTable rows={comprobadoRows} moneda={moneda} />
        </div>
      ) : null}

      {shouldLoadLibroDiario ? (
        <DiarioComprobadoPanel rows={diarioRows} moneda={moneda} />
      ) : null}

      {shouldLoadMayorCuenta ? (
        <MayorCuentaPanel
          groups={mayorGroups}
          empresa={empresa}
          periodo={periodo}
          fechad={fechad}
          fechah={fechah}
          tipoasiento={tipoAsiento}
          moneda={moneda}
        />
      ) : null}

      {shouldLoadMayorCuentaAux ? (
        <MayorCuentaAuxPanel
          groups={mayorAuxGroups}
          empresa={empresa}
          periodo={periodo}
          fechad={fechad}
          fechah={fechah}
          tipoasiento={tipoAsiento}
          moneda={moneda}
        />
      ) : null}

      {section === 'balance-integral' ? (
        <BalanceIntegralPanel
          moneda={moneda}
          empresaLabel={empresaLabel}
          periodo={periodo}
          desdeLabel={monthLabel(mesd)}
          hastaLabel={monthLabel(mesh)}
          localRows={integralLocalRows}
          foreignRows={integralForeignRows}
          clientes={integralClientes}
          proveedores={integralProveedores}
          monthlyResults={integralMonthlyRows}
        />
      ) : null}
    </div>
  );
}
