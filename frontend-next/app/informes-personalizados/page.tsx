import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { ReportTemplateWorkspace } from '@/components/report-templates/report-template-workspace';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { getSessionUser } from '@/lib/auth-server';
import { loadBrandingConfig, loadReportTemplateById, loadReportTemplatesForUser, type ReportTemplateRecord } from '@/lib/admin-config';
import { getCuentasCobrar, getCuentasPagar } from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';
import { CARTERA_TEMPLATE_BLOCKS, getCarteraTemplateBlock } from '@/lib/report-template-presets';

type SelectOption = {
  value: string;
  label: string;
};

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatAmount(value: number) {
  return value.toLocaleString('es-PY');
}

function sanitizeEmpresas(items: Array<Record<string, string>> | undefined | null): SelectOption[] {
  const seen = new Set<string>();
  const result: SelectOption[] = [];

  for (const item of items || []) {
    const value = String(item.cod_empresa || item.Cod_Empresa || item.value || '').trim();
    const label = String(item.des_empresa || item.Des_Empresa || item.label || value).trim();
    if (!value || !label || seen.has(value)) continue;
    seen.add(value);
    result.push({ value, label: value !== label ? `${value} · ${label}` : label });
  }

  return result;
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

function normalizeTemplateConfig(template: ReportTemplateRecord | null) {
  const raw = (template?.config || {}) as Record<string, unknown>;
  const filters = (raw.filters && typeof raw.filters === 'object' && !Array.isArray(raw.filters))
    ? raw.filters as Record<string, unknown>
    : {};
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : [];
  const blocks = blocksRaw
    .map((item) => (item && typeof item === 'object' ? item as Record<string, unknown> : null))
    .filter(Boolean)
    .map((item) => ({
      key: String(item?.key || '').trim(),
      columns: Array.isArray(item?.columns) ? item.columns.map((column) => String(column || '').trim()).filter(Boolean) : [],
    }))
    .filter((item) => item.key);

  return {
    filters: {
      empresa: String(filters.empresa || '').trim(),
      sucursal: String(filters.sucursal || '').trim(),
      periodo: String(filters.periodo || '').trim(),
      desde: String(filters.desde || '').trim(),
      hasta: String(filters.hasta || '').trim(),
      vencimiento: String(filters.vencimiento || 'true').trim() || 'true',
    },
    blocks,
  };
}

export default async function InformesPersonalizadosPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return null;
  }

  const params = (await searchParams) || {};
  const selectedTemplateId = Number(Array.isArray(params.template) ? params.template[0] : params.template || 0) || null;
  const [empresasResponse, templates] = await Promise.all([
    getScopedEmpresas(),
    loadReportTemplatesForUser(sessionUser.id, Boolean(sessionUser.isSuperuser)),
  ]);
  const empresas = sanitizeEmpresas((empresasResponse?.data || []) as Array<Record<string, string>>);
  const selectedTemplate = selectedTemplateId
    ? await loadReportTemplateById({
        templateId: selectedTemplateId,
        actorUserId: sessionUser.id,
        actorIsSuperuser: Boolean(sessionUser.isSuperuser),
      })
    : null;

  const config = normalizeTemplateConfig(selectedTemplate);
  const empresa = config.filters.empresa;
  const brandingConfig = empresa ? await loadBrandingConfig(empresa) : await loadBrandingConfig();
  const exportBranding = buildExportBranding(brandingConfig);

  const [cobrarResponse, pagarResponse] = selectedTemplate && empresa
    ? await Promise.all([
        getCuentasCobrar({
          empresa,
          sucursal: config.filters.sucursal,
          start: config.filters.desde,
          end: config.filters.hasta,
          vencimiento: config.filters.vencimiento === 'true',
        }),
        getCuentasPagar({
          empresa,
          periodo: config.filters.periodo,
          compras_start: config.filters.desde,
          compras_end: config.filters.hasta,
        }),
      ])
    : [null, null];

  const cobrarRows = (cobrarResponse?.data || []) as Array<Record<string, unknown>>;
  const pagarRows = (pagarResponse?.data || []) as Array<Record<string, unknown>>;

  let saldoAcumulado = 0;
  const receivablesRows = cobrarRows.map((row) => {
    const importe = toNumber(row.importe);
    const saldo = toNumber(row.saldo);
    saldoAcumulado += saldo;
    return {
      tipo: row.des_tp_comp ? `${String(row.cod_tp_comp || '')} - ${String(row.des_tp_comp || '')}` : String(row.cod_tp_comp || '-'),
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
    proveedor: String(row.RazonSocial || row.razonsocial || row.CodProv || row.codprov || 'Proveedor'),
    moneda: String(row.Descrip || row.descrip || row.CodMoneda || row.codmoneda || '-'),
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
      neto: Number((coverage - 100).toFixed(2)),
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
    { label: 'Plantilla', value: selectedTemplate?.name || '-' },
    { label: 'Empresa', value: empresa || '-' },
    { label: 'Sucursal', value: config.filters.sucursal || '-' },
    { label: 'Periodo', value: config.filters.periodo || '-' },
    { label: 'Desde', value: config.filters.desde || '-' },
    { label: 'Hasta', value: config.filters.hasta || '-' },
  ];

  const blockRows: Record<string, Array<Record<string, unknown>>> = {
    summary: summaryRows,
    receivables: receivablesRows,
    payables: payablesRows,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Plantillas"
        title="Informes personalizados"
        description="Primera etapa del constructor por bloques: guarda plantillas de cartera, elige columnas visibles y reutiliza el informe unificado con criterio gerencial."
      />

      <ReportTemplateWorkspace
        companies={empresas}
        templates={templates}
        selectedTemplateId={selectedTemplateId}
      />

      {selectedTemplate ? (
        <>
          <section className="card px-5 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Plantilla activa</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{selectedTemplate.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{selectedTemplate.description || 'Sin descripcion.'}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Neto</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{formatAmount(netoCartera)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Cobertura</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{coverage.toFixed(1)}%</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Bloques</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{config.blocks.length}</p>
                </div>
              </div>
            </div>
          </section>

          {config.blocks.map((blockConfig) => {
            const block = getCarteraTemplateBlock(blockConfig.key);
            if (!block) return null;
            const selectedColumns = block.columns.filter((column) => blockConfig.columns.includes(column.key));
            if (!selectedColumns.length) return null;

            return (
              <DataTable
                key={block.key}
                title={block.label}
                subtitle={block.subtitle}
                exportName={block.exportName}
                rows={blockRows[block.key] || []}
                exportMeta={exportMeta}
                exportBranding={exportBranding}
                taskModule="Plantillas"
                columns={selectedColumns.map((column) => ({
                  key: column.key,
                  header: column.header,
                  sortable: true,
                  type: column.type,
                  align: column.align,
                }))}
              />
            );
          })}
        </>
      ) : (
        <section className="card px-5 py-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">Vista previa</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">Abre una plantilla para ejecutar el informe</h2>
          <p className="mt-2 text-sm text-slate-500">
            Guarda tu primera plantilla de cartera y luego selecciona `Abrir plantilla` para ver el informe armado con sus bloques y columnas elegidas.
          </p>
        </section>
      )}
    </div>
  );
}

