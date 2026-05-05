import { DataTable } from '@/components/ui/data-table';
import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';
import { ReportScheduleButton } from '@/components/ui/report-schedule-button';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { loadBrandingConfig } from '@/lib/admin-config';
import { getCuentasCobrar, getCuentasPagar, getSucursales } from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';
import type { CuentaPagarRow } from '@/types/finanzas';
import type { CuentaCobrar } from '@/types/ventas';

type SelectOption = {
  value: string;
  label: string;
};

function monthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentYear() {
  return String(new Date().getFullYear());
}

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatAmount(value: number) {
  return value.toLocaleString('es-PY');
}

function normalizeOption(item: Record<string, string>): SelectOption {
  const value =
    item.cod_empresa ||
    item.Cod_Empresa ||
    item.cod_sucursal ||
    item.Cod_Sucursal ||
    item.codigo ||
    item.Codigo ||
    item.id ||
    item.value ||
    '';
  const label =
    item.des_empresa ||
    item.Des_Empresa ||
    item.des_sucursal ||
    item.Des_Sucursal ||
    item.descripcion ||
    item.Descripcion ||
    item.label ||
    value;

  return { value, label: value && label && value !== label ? `${value} · ${label}` : label || value };
}

function sanitizeOptions(items: Array<Record<string, string>> | undefined | null): SelectOption[] {
  const seen = new Set<string>();
  const result: SelectOption[] = [];

  for (const item of items || []) {
    const option = normalizeOption(item);
    const value = String(option.value || '').trim();
    const label = String(option.label || '').trim();

    if (!value || !label || seen.has(value)) continue;
    seen.add(value);
    result.push({ value, label });
  }

  return result;
}

function getProvider(row: CuentaPagarRow) {
  return String(row.RazonSocial || row.razonsocial || row.CodProv || row.codprov || 'Proveedor');
}

function getCurrency(row: CuentaPagarRow) {
  return String(row.Descrip || row.descrip || row.CodMoneda || row.codmoneda || '-');
}

function buildExportBranding(config: Awaited<ReturnType<typeof loadBrandingConfig>>): ExportBrandingOverride | undefined {
  if (!config) return undefined;
  return {
    clientName: config.clientName || undefined,
    tagline: config.tagline || undefined,
    logoUrl: config.logoUrl || undefined,
    faviconUrl: config.faviconUrl || undefined,
  };
}

export default async function CarteraPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const empresasResponse = await getScopedEmpresas();
  const empresas = sanitizeOptions((empresasResponse?.data || []) as Array<Record<string, string>>);
  const empresa = String(params.empresa || empresas[0]?.value || '');

  const sucursalesResponse = empresa ? await getSucursales(empresa) : null;
  const sucursales = sanitizeOptions((sucursalesResponse?.data || []) as Array<Record<string, string>>);
  const sucursal = String(params.sucursal || '');
  const periodo = String(params.periodo || currentYear());
  const desde = String(params.desde || monthStart());
  const hasta = String(params.hasta || today());
  const vencimiento = String(params.vencimiento || 'true');

  const brandingConfig = empresa ? await loadBrandingConfig(empresa) : await loadBrandingConfig();
  const exportBranding = buildExportBranding(brandingConfig);

  const [cobrarResponse, pagarResponse] = empresa
    ? await Promise.all([
        getCuentasCobrar({
          empresa,
          sucursal,
          start: desde,
          end: hasta,
          vencimiento: vencimiento === 'true',
        }),
        getCuentasPagar({
          empresa,
          periodo,
          compras_start: desde,
          compras_end: hasta,
        }),
      ])
    : [null, null];

  const cobrarRows = (cobrarResponse?.data || []) as CuentaCobrar[];
  const pagarRows = (pagarResponse?.data || []) as CuentaPagarRow[];

  let saldoAcumulado = 0;
  const receivablesRows = cobrarRows.map((row) => {
    const importe = toNumber(row.importe);
    const saldo = toNumber(row.saldo);
    saldoAcumulado += saldo;

    return {
      tipo: row.des_tp_comp ? `${row.cod_tp_comp || ''} - ${row.des_tp_comp}` : String(row.cod_tp_comp || '-'),
      comprobante: String(row.comp_numero || '-'),
      cuota: String(row.cuota_numero || '-'),
      cliente: String(row.razon_social || row.cod_cliente || '-'),
      emision: String(row.fecha_emi || '').slice(0, 10),
      vencimiento: String(row.fecha_ven || '').slice(0, 10),
      importe,
      saldo,
      saldoAcumulado,
    };
  });

  const payablesRows = pagarRows.map((row) => ({
    proveedor: getProvider(row),
    moneda: getCurrency(row),
    saldoAnterior: toNumber(row.SaldoAnterior || row.saldoanterior),
    creditos: toNumber(row.TotalCredito || row.totalcredito),
    debitos: toNumber(row.TotalDebito || row.totaldebito),
    saldo: toNumber(row.Saldo || row.saldo),
  }));

  const totalCobrarImporte = receivablesRows.reduce((acc, row) => acc + row.importe, 0);
  const totalCobrarSaldo = receivablesRows.reduce((acc, row) => acc + row.saldo, 0);
  const totalPagarSaldo = payablesRows.reduce((acc, row) => acc + row.saldo, 0);
  const totalPagarDebitos = payablesRows.reduce((acc, row) => acc + row.debitos, 0);
  const netoCartera = totalCobrarSaldo - totalPagarSaldo;
  const coverage = totalPagarSaldo > 0 ? (totalCobrarSaldo / totalPagarSaldo) * 100 : 100;
  const ratioCobroPago = totalPagarSaldo > 0 ? totalCobrarSaldo / totalPagarSaldo : 1;

  const summaryRows = [
    {
      indicador: 'Saldo operativo',
      cobrar: totalCobrarSaldo,
      pagar: totalPagarSaldo,
      neto: netoCartera,
      lectura: netoCartera >= 0 ? 'Cobertura favorable' : 'Presion de pagos',
    },
    {
      indicador: 'Volumen documentado',
      cobrar: receivablesRows.length,
      pagar: payablesRows.length,
      neto: receivablesRows.length - payablesRows.length,
      lectura: 'Cantidad de documentos vs proveedores',
    },
    {
      indicador: 'Importe / movimiento',
      cobrar: totalCobrarImporte,
      pagar: totalPagarDebitos,
      neto: totalCobrarImporte - totalPagarDebitos,
      lectura: 'Comparacion entre importe a cobrar y debitos del periodo',
    },
    {
      indicador: 'Cobertura porcentual',
      cobrar: Number(coverage.toFixed(2)),
      pagar: 100,
      neto: Number(((coverage - 100) || 0).toFixed(2)),
      lectura: coverage >= 100 ? 'La cartera cubre pagos' : 'La cartera no cubre pagos',
    },
    {
      indicador: 'Ratio cobrar/pagar',
      cobrar: Number(ratioCobroPago.toFixed(2)),
      pagar: 1,
      neto: Number((ratioCobroPago - 1).toFixed(2)),
      lectura: ratioCobroPago >= 1 ? 'Relacion saludable' : 'Relacion por debajo de 1',
    },
  ];

  const exportMeta = [
    { label: 'Empresa', value: empresa || '-' },
    { label: 'Sucursal', value: sucursal || 'Todas' },
    { label: 'Periodo', value: periodo || '-' },
    { label: 'Desde', value: desde || '-' },
    { label: 'Hasta', value: hasta || '-' },
  ];
  const scheduleParams = {
    empresa,
    sucursal,
    periodo,
    desde,
    hasta,
    vencimiento,
  };

  const warning = !empresa
    ? 'No se encontraron empresas disponibles para armar el informe unificado.'
    : !cobrarResponse && !pagarResponse
      ? 'No se pudieron obtener las cuentas por cobrar y por pagar con el filtro actual.'
      : '';

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Informe unificado"
        title="Cartera gerencial"
        description="Cruza cuentas por cobrar y cuentas por pagar en una sola vista ejecutiva para analizar exposición, cobertura y saldo neto del periodo."
        actions={empresa ? (
          <ReportScheduleButton
            reportKey="cartera.unificada"
            reportTitle="Cartera gerencial"
            reportModule="Cartera"
            detailHint="Entrega automatica del informe unificado de cuentas por cobrar y cuentas por pagar."
            reportParams={scheduleParams}
          />
        ) : null}
      />

      <section>
        <input id="cartera-filters-toggle" type="checkbox" className="peer sr-only md:hidden" />
        <label
          htmlFor="cartera-filters-toggle"
          className="mb-3 flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm md:hidden"
        >
          Filtros
        </label>
        <form className="card hidden gap-3 px-5 py-5 peer-checked:grid md:grid md:grid-cols-2 xl:grid-cols-6">
          <label className="text-sm font-medium text-slate-700">
            Empresa
            <select name="empresa" defaultValue={empresa} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400">
              {empresas.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Sucursal
            <select name="sucursal" defaultValue={sucursal} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400">
              <option value="">Todas</option>
              {sucursales.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Periodo
            <input name="periodo" defaultValue={periodo} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Desde
            <input type="date" name="desde" defaultValue={desde} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Hasta
            <input type="date" name="hasta" defaultValue={hasta} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Cobrar por vencimiento
            <select name="vencimiento" defaultValue={vencimiento} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400">
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </label>

          <div className="md:col-span-2 xl:col-span-6 flex justify-end gap-2">
            <a
              href="/cartera"
              className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Limpiar
            </a>
            <button
              type="submit"
              className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Aplicar
            </button>
          </div>
        </form>
      </section>

      {warning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard item={{ title: 'Saldo por cobrar', value: formatAmount(totalCobrarSaldo), change: `${receivablesRows.length} documentos`, trend: totalCobrarSaldo > 0 ? 'neutral' : 'up' }} />
        <KpiCard item={{ title: 'Importe por cobrar', value: formatAmount(totalCobrarImporte), change: 'Ventas pendientes', trend: 'up' }} />
        <KpiCard item={{ title: 'Saldo por pagar', value: formatAmount(totalPagarSaldo), change: `${payablesRows.length} proveedores`, trend: totalPagarSaldo > 0 ? 'neutral' : 'up' }} />
        <KpiCard item={{ title: 'Debitos de pagar', value: formatAmount(totalPagarDebitos), change: 'Movimiento proveedor', trend: 'neutral' }} />
        <KpiCard item={{ title: 'Neto de cartera', value: formatAmount(netoCartera), change: `${coverage.toFixed(1)}% cobertura`, trend: netoCartera >= 0 ? 'up' : 'down' }} />
      </section>

      <section className="card px-5 py-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Lectura ejecutiva</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Este bloque compara en una sola vista la presión de cobro contra la obligación de pago del mismo periodo operativo.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Saldo neto</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatAmount(netoCartera)}</p>
            <p className="mt-1 text-sm text-slate-500">Cobrar menos pagar en el rango consultado.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Cobertura</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{coverage.toFixed(1)}%</p>
            <p className="mt-1 text-sm text-slate-500">Relación entre saldo por cobrar y saldo por pagar.</p>
          </div>
        </div>
      </section>

      <DataTable
        title="Resumen comparativo"
        subtitle="Cruce ejecutivo de cartera para leer rapidamente el equilibrio entre cobrar y pagar antes de entrar al detalle."
        exportName="cartera-resumen-comparativo"
        rows={summaryRows}
        exportMeta={exportMeta}
        exportBranding={exportBranding}
        taskModule="Cartera"
        tableClassName="min-w-[1180px] table-fixed"
        pdfOptions={{ landscape: true, compact: true }}
        columns={[
          { key: 'indicador', header: 'Indicador', sortable: true, className: 'w-[250px] max-w-[250px] truncate' },
          { key: 'cobrar', header: 'Cobrar', sortable: true, type: 'number', align: 'right', className: 'w-[170px] whitespace-nowrap' },
          { key: 'pagar', header: 'Pagar', sortable: true, type: 'number', align: 'right', className: 'w-[170px] whitespace-nowrap' },
          { key: 'neto', header: 'Neto / diferencia', sortable: true, type: 'number', align: 'right', className: 'w-[190px] whitespace-nowrap' },
          { key: 'lectura', header: 'Lectura gerencial', sortable: true, className: 'w-[300px] max-w-[300px] truncate' },
        ]}
      />

      <DataTable
        title="Cuentas por cobrar"
        subtitle="Detalle consolidado de documentos pendientes a clientes dentro del rango consultado."
        exportName="cartera-cuentas-cobrar"
        rows={receivablesRows}
        exportMeta={exportMeta}
        exportBranding={exportBranding}
        taskModule="Cartera"
        tableClassName="min-w-[1500px] table-fixed"
        pdfOptions={{ landscape: true, compact: true }}
        columns={[
          { key: 'tipo', header: 'Tipo Comprobante', sortable: true, className: 'min-w-[220px] max-w-[220px] truncate' },
          { key: 'comprobante', header: '# Comprobante', sortable: true, className: 'min-w-[120px] whitespace-nowrap' },
          { key: 'cuota', header: 'Cuota', sortable: true, className: 'min-w-[90px] whitespace-nowrap' },
          { key: 'cliente', header: 'Cliente', sortable: true, className: 'min-w-[280px] max-w-[280px] truncate' },
          { key: 'emision', header: 'Emision', sortable: true, type: 'date', className: 'min-w-[110px] whitespace-nowrap' },
          { key: 'vencimiento', header: 'Vencimiento', sortable: true, type: 'date', className: 'min-w-[120px] whitespace-nowrap' },
          { key: 'importe', header: 'Importe', sortable: true, type: 'currency', align: 'right', className: 'min-w-[140px] whitespace-nowrap' },
          { key: 'saldo', header: 'Saldo', sortable: true, type: 'currency', align: 'right', className: 'min-w-[140px] whitespace-nowrap' },
          { key: 'saldoAcumulado', header: 'Saldo acumulado', sortable: true, type: 'currency', align: 'right', className: 'min-w-[160px] whitespace-nowrap' },
        ]}
      />

      <DataTable
        title="Cuentas por pagar"
        subtitle="Detalle consolidado de saldos abiertos a proveedores dentro del mismo rango operativo."
        exportName="cartera-cuentas-pagar"
        rows={payablesRows}
        exportMeta={exportMeta}
        exportBranding={exportBranding}
        taskModule="Cartera"
        tableClassName="min-w-[1080px] table-fixed"
        pdfOptions={{ landscape: true, compact: true }}
        columns={[
          { key: 'proveedor', header: 'Proveedor', sortable: true, className: 'min-w-[300px] max-w-[300px] truncate' },
          { key: 'moneda', header: 'Moneda', sortable: true, className: 'min-w-[110px] whitespace-nowrap' },
          { key: 'saldoAnterior', header: 'Saldo anterior', sortable: true, type: 'currency', align: 'right', className: 'min-w-[140px] whitespace-nowrap' },
          { key: 'creditos', header: 'Creditos', sortable: true, type: 'currency', align: 'right', className: 'min-w-[130px] whitespace-nowrap' },
          { key: 'debitos', header: 'Debitos', sortable: true, type: 'currency', align: 'right', className: 'min-w-[130px] whitespace-nowrap' },
          { key: 'saldo', header: 'Saldo', sortable: true, type: 'currency', align: 'right', className: 'min-w-[140px] whitespace-nowrap' },
        ]}
      />
    </div>
  );
}
