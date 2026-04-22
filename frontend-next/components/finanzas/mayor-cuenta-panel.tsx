'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

import { exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';

type MayorCabAccount = {
  code: string;
  name: string;
};

type MayorCabGroup = {
  parentCode: string;
  parentName: string;
  accounts: MayorCabAccount[];
};

type MayorDetailRow = {
  Fecha?: string;
  fecha?: string;
  Tipoasiento?: string;
  tipoasiento?: string;
  NroCompr?: string | number;
  nrocompr?: string | number;
  Autorizado?: string;
  autorizado?: string;
  NroTransac?: string | number;
  nrotransac?: string | number;
  Linea?: string | number;
  linea?: string | number;
  CodPlanAux?: string;
  codplanaux?: string;
  Concepto?: string;
  concepto?: string;
  Debito?: string | number;
  debito?: string | number;
  Credito?: string | number;
  credito?: string | number;
  DebitoME?: string | number;
  debitome?: string | number;
  CreditoME?: string | number;
  creditome?: string | number;
};

type MayorSaldoRow = {
  TipoSaldo?: string;
  tiposaldo?: string;
  Debito?: string | number;
  debito?: string | number;
  Credito?: string | number;
  credito?: string | number;
  DebitoME?: string | number;
  debitome?: string | number;
  CreditoME?: string | number;
  creditome?: string | number;
};

type DetailState = {
  loading: boolean;
  loaded: boolean;
  rows: MayorDetailRow[];
  saldoAnterior: MayorSaldoRow | null;
  error: string | null;
};

type DetailTotals = {
  debito: number;
  credito: number;
  debitoMe: number;
  creditoMe: number;
};

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function txt(value: unknown) {
  return String(value ?? '');
}

function formatGs(value: number) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUs(value: number) {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calcSaldo(tipoSaldo: string, debito: number, credito: number) {
  return (tipoSaldo || '').toUpperCase() === 'D' ? debito - credito : credito - debito;
}

function valueByCurrency(moneda: string, local: number, foreign: number) {
  if (moneda === 'extranjera') return formatUs(foreign);
  return formatGs(local);
}

function emptyDetailTotals(): DetailTotals {
  return { debito: 0, credito: 0, debitoMe: 0, creditoMe: 0 };
}

function buildExportData(params: {
  groups: MayorCabGroup[];
  states: Record<string, DetailState>;
  moneda: string;
}) {
  const headers =
    params.moneda === 'ambas'
      ? ['Grupo', 'Cuenta', 'Nombre cuenta', 'Fecha', 'Tipo', 'Nro. Comp.', 'Aut.', 'Nro.', 'Linea', 'Cod. Auxiliar', 'Concepto', 'Debe M.L.', 'Haber M.L.', 'Saldo M.L.', 'Debe M.E.', 'Haber M.E.', 'Saldo M.E.']
      : ['Grupo', 'Cuenta', 'Nombre cuenta', 'Fecha', 'Tipo', 'Nro. Comp.', 'Aut.', 'Nro.', 'Linea', 'Cod. Auxiliar', 'Concepto', 'Debe', 'Haber', 'Saldo'];

  const rows: Array<Array<unknown>> = [];

  for (const group of params.groups) {
    for (const account of group.accounts) {
      const state = params.states[account.code];
      if (!state?.loaded || !state.rows.length) continue;

      const saldoRow = state.saldoAnterior;
      const saldoPrevLocal = saldoRow ? calcSaldo(txt(saldoRow.TipoSaldo || saldoRow.tiposaldo), num(saldoRow.Debito || saldoRow.debito), num(saldoRow.Credito || saldoRow.credito)) : 0;
      const saldoPrevForeign = saldoRow ? calcSaldo(txt(saldoRow.TipoSaldo || saldoRow.tiposaldo), num(saldoRow.DebitoME || saldoRow.debitome), num(saldoRow.CreditoME || saldoRow.creditome)) : 0;
      const detailTotals = state.rows.reduce<DetailTotals>((acc, row) => ({
        debito: acc.debito + num(row.Debito || row.debito),
        credito: acc.credito + num(row.Credito || row.credito),
        debitoMe: acc.debitoMe + num(row.DebitoME || row.debitome),
        creditoMe: acc.creditoMe + num(row.CreditoME || row.creditome),
      }), emptyDetailTotals());

      if (params.moneda === 'ambas') {
        rows.push([group.parentCode, account.code, account.name, 'Saldo anterior', '', '', '', '', '', '', '', formatGs(num(saldoRow?.Debito || saldoRow?.debito)), formatGs(num(saldoRow?.Credito || saldoRow?.credito)), formatGs(saldoPrevLocal), formatUs(num(saldoRow?.DebitoME || saldoRow?.debitome)), formatUs(num(saldoRow?.CreditoME || saldoRow?.creditome)), formatUs(saldoPrevForeign)]);
      } else {
        rows.push([group.parentCode, account.code, account.name, 'Saldo anterior', '', '', '', '', '', '', '', valueByCurrency(params.moneda, num(saldoRow?.Debito || saldoRow?.debito), num(saldoRow?.DebitoME || saldoRow?.debitome)), valueByCurrency(params.moneda, num(saldoRow?.Credito || saldoRow?.credito), num(saldoRow?.CreditoME || saldoRow?.creditome)), valueByCurrency(params.moneda, saldoPrevLocal, saldoPrevForeign)]);
      }

      for (const row of state.rows) {
        const saldoLocal = calcSaldo('D', num(row.Debito || row.debito), num(row.Credito || row.credito));
        const saldoForeign = calcSaldo('D', num(row.DebitoME || row.debitome), num(row.CreditoME || row.creditome));
        const baseRow = [
          group.parentCode,
          account.code,
          account.name,
          txt(row.Fecha || row.fecha),
          txt(row.Tipoasiento || row.tipoasiento),
          txt(row.NroCompr || row.nrocompr),
          txt((row as MayorDetailRow & { Autorizado?: unknown; autorizado?: unknown }).Autorizado || (row as MayorDetailRow & { autorizado?: unknown }).autorizado),
          txt(row.NroTransac || row.nrotransac),
          txt(row.Linea || row.linea),
          txt(row.CodPlanAux || row.codplanaux),
          txt(row.Concepto || row.concepto),
        ];

        if (params.moneda === 'ambas') {
          rows.push([
            ...baseRow,
            formatGs(num(row.Debito || row.debito)),
            formatGs(num(row.Credito || row.credito)),
            formatGs(saldoLocal),
            formatUs(num(row.DebitoME || row.debitome)),
            formatUs(num(row.CreditoME || row.creditome)),
            formatUs(saldoForeign),
          ]);
        } else {
          rows.push([
            ...baseRow,
            valueByCurrency(params.moneda, num(row.Debito || row.debito), num(row.DebitoME || row.debitome)),
            valueByCurrency(params.moneda, num(row.Credito || row.credito), num(row.CreditoME || row.creditome)),
            valueByCurrency(params.moneda, saldoLocal, saldoForeign),
          ]);
        }
      }

      if (params.moneda === 'ambas') {
        rows.push(['', '', '', '', '', '', '', '', '', '', 'Totales del periodo', formatGs(detailTotals.debito), formatGs(detailTotals.credito), formatGs(calcSaldo('D', detailTotals.debito, detailTotals.credito)), formatUs(detailTotals.debitoMe), formatUs(detailTotals.creditoMe), formatUs(calcSaldo('D', detailTotals.debitoMe, detailTotals.creditoMe))]);
      } else {
        rows.push(['', '', '', '', '', '', '', '', '', '', 'Totales del periodo', valueByCurrency(params.moneda, detailTotals.debito, detailTotals.debitoMe), valueByCurrency(params.moneda, detailTotals.credito, detailTotals.creditoMe), valueByCurrency(params.moneda, calcSaldo('D', detailTotals.debito, detailTotals.credito), calcSaldo('D', detailTotals.debitoMe, detailTotals.creditoMe))]);
      }

      rows.push([]);
    }
  }

  return { headers, rows };
}

export function MayorCuentaPanel({
  groups,
  empresa,
  periodo,
  fechad,
  fechah,
  tipoasiento,
  moneda,
}: {
  groups: MayorCabGroup[];
  empresa: string;
  periodo: string;
  fechad: string;
  fechah: string;
  tipoasiento: string;
  moneda: string;
}) {
  const [states, setStates] = useState<Record<string, DetailState>>({});
  const [openAccount, setOpenAccount] = useState<string | null>(null);
  const exportData = buildExportData({ groups, states, moneda });
  const hasExportRows = exportData.rows.length > 0;

  async function loadAccountDetail(account: MayorCabAccount) {
    const key = account.code;
    const existing = states[key];
    if (existing?.loaded || existing?.loading) return true;

    setStates((current) => ({
      ...current,
      [key]: { loading: true, loaded: false, rows: [], saldoAnterior: null, error: null },
    }));

    try {
      const url = new URL('/api/finanzas/mayor-cuenta-det', window.location.origin);
      url.searchParams.set('empresa', empresa);
      url.searchParams.set('periodo', periodo);
      url.searchParams.set('fechad', fechad);
      url.searchParams.set('fechah', fechah);
      url.searchParams.set('tipoasiento', tipoasiento || 'NINGUNO');
      url.searchParams.set('cuenta', key);

      const response = await fetch(url.toString(), { cache: 'force-cache' });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || 'No se pudo cargar el detalle.');
      }

      const raw = Array.isArray(payload.data) ? payload.data : [];
      const rows = Array.isArray(raw[0]?.dato1) ? raw[0].dato1 : [];
      const saldoAnterior = Array.isArray(raw[1]?.dato2) && raw[1].dato2.length ? raw[1].dato2[0] : null;

      setStates((current) => ({
        ...current,
        [key]: { loading: false, loaded: true, rows, saldoAnterior, error: null },
      }));
      return true;
    } catch (error) {
      setStates((current) => ({
        ...current,
        [key]: {
          loading: false,
          loaded: false,
          rows: [],
          saldoAnterior: null,
          error: error instanceof Error ? error.message : 'No se pudo cargar el detalle.',
        },
      }));
      return false;
    }
  }

  async function toggleAccount(account: MayorCabAccount) {
    const key = account.code;
    const isOpen = openAccount === key;
    setOpenAccount(isOpen ? null : key);
    if (isOpen) return;
    await loadAccountDetail(account);
  }

  function prefetchAccount(account: MayorCabAccount) {
    void loadAccountDetail(account);
  }

  function exportExcel() {
    exportRowsToExcel({
      title: 'Libro mayor de cuenta',
      subtitle: 'Incluye las cuentas ya abiertas en pantalla.',
      filename: 'libro-mayor-cuenta',
      headers: exportData.headers,
      rows: exportData.rows,
    });
  }

  function exportPdf() {
    exportRowsToPdf({
      title: 'Libro mayor de cuenta',
      subtitle: 'Incluye las cuentas ya abiertas en pantalla.',
      headers: exportData.headers,
      rows: exportData.rows,
    });
  }

  return (
    <section id="mayor-cuenta" className="scroll-mt-28 space-y-4">
      <div className="card flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Libro mayor de cuenta</h2>
          <p className="mt-1 text-sm text-slate-500">Lista cuentas del rango y carga el detalle solo al abrir cada cuenta, para mantener la consulta mas liviana.</p>
        </div>
        {hasExportRows ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
            <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
              <FileDown className="h-4 w-4" />
              PDF
            </button>
          </div>
        ) : null}
      </div>

      {!groups.length ? (
        <div className="card px-5 py-10 text-sm text-slate-500">No hay cuentas disponibles para este mayor.</div>
      ) : (
        groups.map((group) => (
          <div key={group.parentCode} className="card overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="text-base font-semibold text-slate-900">{group.parentCode} {group.parentName}</h3>
            </div>
            <div className="space-y-3 px-4 py-4">
              {group.accounts.map((account) => {
                const state = states[account.code];
                const isOpen = openAccount === account.code;
                const saldoRow = state?.saldoAnterior;
                const saldoPrevLocal = isOpen && saldoRow ? calcSaldo(txt(saldoRow.TipoSaldo || saldoRow.tiposaldo), num(saldoRow.Debito || saldoRow.debito), num(saldoRow.Credito || saldoRow.credito)) : 0;
                const saldoPrevForeign = isOpen && saldoRow ? calcSaldo(txt(saldoRow.TipoSaldo || saldoRow.tiposaldo), num(saldoRow.DebitoME || saldoRow.debitome), num(saldoRow.CreditoME || saldoRow.creditome)) : 0;
                const detailTotals = isOpen
                  ? (state?.rows || []).reduce<DetailTotals>((acc, row) => ({
                      debito: acc.debito + num(row.Debito || row.debito),
                      credito: acc.credito + num(row.Credito || row.credito),
                      debitoMe: acc.debitoMe + num(row.DebitoME || row.debitome),
                      creditoMe: acc.creditoMe + num(row.CreditoME || row.creditome),
                    }), emptyDetailTotals())
                  : emptyDetailTotals();

                return (
                  <div key={account.code} className="rounded-2xl border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => void toggleAccount(account)}
                      onMouseEnter={() => prefetchAccount(account)}
                      onFocus={() => prefetchAccount(account)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="font-medium text-slate-900">{account.code} {account.name}</span>
                      <span className="text-sm text-cyan-700">{isOpen ? 'Ocultar' : 'Ver detalle'}</span>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-slate-200 px-4 py-4">
                        {state?.loading ? (
                          <div className="text-sm text-slate-500">Cargando detalle...</div>
                        ) : state?.error ? (
                          <div className="text-sm text-amber-700">{state.error}</div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-slate-50 text-slate-700">
                                <tr className="border-b border-slate-200">
                                  <th className="px-3 py-3 text-left">Fecha</th>
                                  <th className="px-3 py-3 text-left">Tipo</th>
                                  <th className="px-3 py-3 text-left">Nro. Comp.</th>
                                  <th className="px-3 py-3 text-left">Aut.</th>
                                  <th className="px-3 py-3 text-left">Nro.</th>
                                  <th className="px-3 py-3 text-left">Linea</th>
                                  <th className="px-3 py-3 text-left">Cod. Auxiliar</th>
                                  <th className="px-3 py-3 text-left">Concepto</th>
                                  <th className="px-3 py-3 text-right">Debe</th>
                                  <th className="px-3 py-3 text-right">Haber</th>
                                  <th className="px-3 py-3 text-right">Saldo</th>
                                  {moneda === 'ambas' ? (
                                    <>
                                      <th className="px-3 py-3 text-right">Debe M.E.</th>
                                      <th className="px-3 py-3 text-right">Haber M.E.</th>
                                      <th className="px-3 py-3 text-right">Saldo M.E.</th>
                                    </>
                                  ) : null}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                  <td colSpan={8} className="px-3 py-2 text-right font-semibold">Saldo anterior</td>
                                  <td className="px-3 py-2 text-right">{valueByCurrency(moneda, num(saldoRow?.Debito || saldoRow?.debito), num(saldoRow?.DebitoME || saldoRow?.debitome))}</td>
                                  <td className="px-3 py-2 text-right">{valueByCurrency(moneda, num(saldoRow?.Credito || saldoRow?.credito), num(saldoRow?.CreditoME || saldoRow?.creditome))}</td>
                                  <td className="px-3 py-2 text-right font-semibold">{valueByCurrency(moneda, saldoPrevLocal, saldoPrevForeign)}</td>
                                  {moneda === 'ambas' ? (
                                    <>
                                      <td className="px-3 py-2 text-right">{formatUs(num(saldoRow?.DebitoME || saldoRow?.debitome))}</td>
                                      <td className="px-3 py-2 text-right">{formatUs(num(saldoRow?.CreditoME || saldoRow?.creditome))}</td>
                                      <td className="px-3 py-2 text-right font-semibold">{formatUs(saldoPrevForeign)}</td>
                                    </>
                                  ) : null}
                                </tr>
                                {(state?.rows || []).map((row, index) => {
                                  const saldoLocal = calcSaldo('D', num(row.Debito || row.debito), num(row.Credito || row.credito));
                                  const saldoForeign = calcSaldo('D', num(row.DebitoME || row.debitome), num(row.CreditoME || row.creditome));
                                  return (
                                    <tr key={`${account.code}-${index}`} className="border-b border-slate-100">
                                      <td className="px-3 py-2">{txt(row.Fecha || row.fecha)}</td>
                                      <td className="px-3 py-2">{txt(row.Tipoasiento || row.tipoasiento)}</td>
                                      <td className="px-3 py-2">{txt(row.NroCompr || row.nrocompr)}</td>
                                      <td className="px-3 py-2">{txt((row as MayorDetailRow & { Autorizado?: unknown; autorizado?: unknown }).Autorizado || (row as MayorDetailRow & { autorizado?: unknown }).autorizado)}</td>
                                      <td className="px-3 py-2">{txt(row.NroTransac || row.nrotransac)}</td>
                                      <td className="px-3 py-2">{txt(row.Linea || row.linea)}</td>
                                      <td className="px-3 py-2">{txt(row.CodPlanAux || row.codplanaux)}</td>
                                      <td className="px-3 py-2">{txt(row.Concepto || row.concepto)}</td>
                                      <td className="px-3 py-2 text-right">{valueByCurrency(moneda, num(row.Debito || row.debito), num(row.DebitoME || row.debitome))}</td>
                                      <td className="px-3 py-2 text-right">{valueByCurrency(moneda, num(row.Credito || row.credito), num(row.CreditoME || row.creditome))}</td>
                                      <td className="px-3 py-2 text-right">{valueByCurrency(moneda, saldoLocal, saldoForeign)}</td>
                                      {moneda === 'ambas' ? (
                                        <>
                                          <td className="px-3 py-2 text-right">{formatUs(num(row.DebitoME || row.debitome))}</td>
                                          <td className="px-3 py-2 text-right">{formatUs(num(row.CreditoME || row.creditome))}</td>
                                          <td className="px-3 py-2 text-right">{formatUs(saldoForeign)}</td>
                                        </>
                                      ) : null}
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="bg-slate-50 font-bold text-slate-900">
                                  <td colSpan={8} className="px-3 py-3 text-right">Totales del periodo</td>
                                  <td className="px-3 py-3 text-right">{valueByCurrency(moneda, detailTotals.debito, detailTotals.debitoMe)}</td>
                                  <td className="px-3 py-3 text-right">{valueByCurrency(moneda, detailTotals.credito, detailTotals.creditoMe)}</td>
                                  <td className="px-3 py-3 text-right">{valueByCurrency(moneda, calcSaldo('D', detailTotals.debito, detailTotals.credito), calcSaldo('D', detailTotals.debitoMe, detailTotals.creditoMe))}</td>
                                  {moneda === 'ambas' ? (
                                    <>
                                      <td className="px-3 py-3 text-right">{formatUs(detailTotals.debitoMe)}</td>
                                      <td className="px-3 py-3 text-right">{formatUs(detailTotals.creditoMe)}</td>
                                      <td className="px-3 py-3 text-right">{formatUs(calcSaldo('D', detailTotals.debitoMe, detailTotals.creditoMe))}</td>
                                    </>
                                  ) : null}
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
