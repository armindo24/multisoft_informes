import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { ReportScheduleButton } from '@/components/ui/report-schedule-button';
import { ReportTemplateWorkspace } from '@/components/report-templates/report-template-workspace';
import type { ExportBrandingOverride } from '@/components/ui/export-utils';
import { getSessionUser } from '@/lib/auth-server';
import { loadBrandingConfig, loadReportTemplateById, loadReportTemplatesForUser, type ReportTemplateRecord } from '@/lib/admin-config';
import { getComprasList, getCuentasCobrar, getCuentasPagar, getVentasResumido } from '@/lib/api';
import { brandShortName, getLogoBackgroundClasses, resolveBrandAssetUrl } from '@/lib/branding';
import { getScopedEmpresas } from '@/lib/empresas-server';
import { getReportTemplateBlock, getReportTemplatePreset, type ReportTemplatePresetKey } from '@/lib/report-template-presets';

type SelectOption = {
  value: string;
  label: string;
};

type TemplateBlockSelection = {
  key: string;
  columns: string[];
};

type TemplateConfig = {
  templateKey: ReportTemplatePresetKey;
  filters: {
    empresa: string;
    sucursal: string;
    periodo: string;
    desde: string;
    hasta: string;
    vencimiento: string;
    moneda: string;
    departamento: string;
    order: string;
  };
  blocks: TemplateBlockSelection[];
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

function normalizeTemplateConfig(template: ReportTemplateRecord | null): TemplateConfig {
  const raw = (template?.config || {}) as Record<string, unknown>;
  const filters = (raw.filters && typeof raw.filters === 'object' && !Array.isArray(raw.filters))
    ? raw.filters as Record<string, unknown>
    : {};
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : [];
  const templateKey = (String(template?.templateKey || 'cartera_bloques').trim() || 'cartera_bloques') as ReportTemplatePresetKey;
  const blocks = blocksRaw
    .map((item) => (item && typeof item === 'object' ? item as Record<string, unknown> : null))
    .filter(Boolean)
    .map((item) => ({
      key: String(item?.key || '').trim(),
      columns: Array.isArray(item?.columns) ? item.columns.map((column) => String(column || '').trim()).filter(Boolean) : [],
    }))
    .filter((item) => item.key);

  return {
    templateKey,
    filters: {
      empresa: String(filters.empresa || '').trim(),
      sucursal: String(filters.sucursal || '').trim(),
      periodo: String(filters.periodo || '').trim(),
      desde: String(filters.desde || '').trim(),
      hasta: String(filters.hasta || '').trim(),
      vencimiento: String(filters.vencimiento || 'true').trim() || 'true',
      moneda: String(filters.moneda || 'GS').trim() || 'GS',
      departamento: String(filters.departamento || '').trim(),
      order: String(filters.order || 'cod_cliente').trim() || 'cod_cliente',
    },
    blocks,
  };
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? String(value[0] || '').trim() : String(value || '').trim();
}

function salesGroupLabel(groupBy: string) {
  if (groupBy === 'cod_tp_comp') return 'Comprobante';
  if (groupBy === 'cod_vendedor') return 'Vendedor';
  return 'Cliente';
}

function salesGroupValue(row: Record<string, unknown>, groupBy: string) {
  if (groupBy === 'cod_tp_comp') return String(row.des_tp_comp || row.cod_tp_comp || 'Sin comprobante');
  if (groupBy === 'cod_vendedor') return String(row.des_vendedor || 'Sin vendedor');
  return String(row.razon_social || row.cliente || 'Sin cliente');
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

  const baseConfig = normalizeTemplateConfig(selectedTemplate);
  const config: TemplateConfig = {
    ...baseConfig,
    filters: {
      ...baseConfig.filters,
      empresa: firstParam(params.empresa) || baseConfig.filters.empresa,
      sucursal: firstParam(params.sucursal) || baseConfig.filters.sucursal,
      periodo: firstParam(params.periodo) || baseConfig.filters.periodo,
      desde: firstParam(params.desde) || baseConfig.filters.desde,
      hasta: firstParam(params.hasta) || baseConfig.filters.hasta,
      vencimiento: firstParam(params.vencimiento) || baseConfig.filters.vencimiento,
      moneda: firstParam(params.moneda) || baseConfig.filters.moneda,
      departamento: firstParam(params.departamento) || baseConfig.filters.departamento,
      order: firstParam(params.order) || baseConfig.filters.order,
    },
  };

  const empresa = config.filters.empresa;
  const preset = getReportTemplatePreset(config.templateKey);
  const brandingConfig = empresa ? await loadBrandingConfig(empresa) : await loadBrandingConfig();
  const exportBranding = buildExportBranding(brandingConfig);
  const brandName = brandingConfig?.clientName || exportBranding?.clientName || 'Multisoft';
  const brandTagline = brandingConfig?.tagline || exportBranding?.tagline || 'Informes Gerenciales';
  const brandLogoUrl = brandingConfig?.logoUrl ? resolveBrandAssetUrl(brandingConfig.logoUrl) : '';
  const brandInitials = brandShortName(brandName);
  const brandLogoBackground = getLogoBackgroundClasses(brandingConfig?.logoBackground || 'auto');

  const shouldLoadCartera = Boolean(selectedTemplate && empresa && config.templateKey === 'cartera_bloques');
  const shouldLoadVentasCompras = Boolean(
    selectedTemplate
      && empresa
      && config.templateKey === 'ventas_compras_bloques'
      && config.filters.sucursal
      && config.filters.departamento,
  );

  const [cobrarResponse, pagarResponse, ventasResponse, comprasResponse] = await Promise.all([
    shouldLoadCartera
      ? getCuentasCobrar({
          empresa,
          sucursal: config.filters.sucursal,
          start: config.filters.desde,
          end: config.filters.hasta,
          vencimiento: config.filters.vencimiento === 'true',
        })
      : Promise.resolve(null),
    shouldLoadCartera
      ? getCuentasPagar({
          empresa,
          periodo: config.filters.periodo,
          compras_start: config.filters.desde,
          compras_end: config.filters.hasta,
        })
      : Promise.resolve(null),
    shouldLoadVentasCompras
      ? getVentasResumido({
          empresa,
          sucursal: config.filters.sucursal,
          moneda: config.filters.moneda,
          desde: config.filters.desde,
          hasta: config.filters.hasta,
          order: config.filters.order,
        })
      : Promise.resolve(null),
    shouldLoadVentasCompras
      ? getComprasList({
          empresa,
          sucursal: config.filters.sucursal,
          moneda: config.filters.moneda,
          compras_start: config.filters.desde,
          compras_end: config.filters.hasta,
          departamento: config.filters.departamento,
          proveedor: '',
          tipooc: '',
          agrupar: '',
        })
      : Promise.resolve(null),
  ]);

  const cobrarRows = (cobrarResponse?.data || []) as Array<Record<string, unknown>>;
  const pagarRows = (pagarResponse?.data || []) as Array<Record<string, unknown>>;
  const ventasRows = (ventasResponse?.data || []) as Array<Record<string, unknown>>;
  const comprasRows = (comprasResponse?.data || []) as Array<Record<string, unknown>>;

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

  const salesRows = ventasRows.map((row) => ({
    grupo: salesGroupValue(row, config.filters.order),
    comprobante: `${String(row.cod_tp_comp || '')} - ${String(row.comp_numero || '')}`.trim(),
    cliente: String(row.razon_social || row.cliente || '-'),
    ruc: String(row.ruc || '-'),
    fecha: String(row.fecha || '').slice(0, 10),
    iva: toNumber(row.total_iva),
    gravado: toNumber(row.to_gravado),
    descuento: toNumber(row.totaldescuento),
    total: toNumber(row.to_gravado) + toNumber(row.total_iva),
  }));

  const purchasesRows = comprasRows.map((row) => ({
    fecha: String(row.FechaFact || row.fecha_fact || '').slice(0, 10),
    comprobante: `${String(row.Cod_Tp_Comp || row.cod_tp_comp || '')} - ${String(row.NroFact || row.nrofact || '')}`.trim(),
    proveedor: String(row.RazonSocial || row.razon_social || '-'),
    sucursal: String(row.des_sucursal || '-'),
    gravada: toNumber(row.gravada),
    iva: toNumber(row.IVA || row.iva),
    total: toNumber(row.total),
    estado: String(row.estado || row.Asentado || '-'),
  }));

  const totalCobrarImporte = receivablesRows.reduce((acc, row) => acc + row.importe, 0);
  const totalCobrarSaldo = receivablesRows.reduce((acc, row) => acc + row.saldo, 0);
  const totalPagarSaldo = payablesRows.reduce((acc, row) => acc + row.saldo, 0);
  const totalPagarDebitos = payablesRows.reduce((acc, row) => acc + row.debitos, 0);
  const netoCartera = totalCobrarSaldo - totalPagarSaldo;
  const coverage = totalPagarSaldo > 0 ? (totalCobrarSaldo / totalPagarSaldo) * 100 : 100;
  const ratioCobroPago = totalPagarSaldo > 0 ? totalCobrarSaldo / totalPagarSaldo : 1;

  const totalFacturado = salesRows.reduce((acc, row) => acc + row.total, 0);
  const totalComprado = purchasesRows.reduce((acc, row) => acc + row.total, 0);
  const netoComercial = totalFacturado - totalComprado;
  const ventasVsComprasRatio = totalComprado > 0 ? totalFacturado / totalComprado : 1;

  const carteraSummaryRows = [
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

  const ventasComprasSummaryRows = [
    {
      indicador: 'Volumen del periodo',
      ventas: totalFacturado,
      compras: totalComprado,
      diferencia: netoComercial,
      lectura: netoComercial >= 0 ? 'Ventas por encima de compras' : 'Compras por encima de ventas',
    },
    {
      indicador: 'Documentos visibles',
      ventas: salesRows.length,
      compras: purchasesRows.length,
      diferencia: salesRows.length - purchasesRows.length,
      lectura: 'Cantidad de comprobantes visibles',
    },
    {
      indicador: 'IVA comparado',
      ventas: salesRows.reduce((acc, row) => acc + row.iva, 0),
      compras: purchasesRows.reduce((acc, row) => acc + row.iva, 0),
      diferencia: salesRows.reduce((acc, row) => acc + row.iva, 0) - purchasesRows.reduce((acc, row) => acc + row.iva, 0),
      lectura: 'Diferencia de carga impositiva visible',
    },
    {
      indicador: 'Ratio ventas/compras',
      ventas: Number(ventasVsComprasRatio.toFixed(2)),
      compras: 1,
      diferencia: Number((ventasVsComprasRatio - 1).toFixed(2)),
      lectura: ventasVsComprasRatio >= 1 ? 'Relacion comercial saludable' : 'Relacion comercial presionada',
    },
  ];

  const exportMeta = [
    { label: 'Plantilla', value: selectedTemplate?.name || '-' },
    { label: 'Preset', value: preset?.label || config.templateKey },
    { label: 'Empresa', value: empresa || '-' },
    { label: 'Sucursal', value: config.filters.sucursal || '-' },
    { label: 'Periodo', value: config.filters.periodo || '-' },
    { label: 'Desde', value: config.filters.desde || '-' },
    { label: 'Hasta', value: config.filters.hasta || '-' },
    ...(config.templateKey === 'ventas_compras_bloques'
      ? [
          { label: 'Moneda', value: config.filters.moneda || '-' },
          { label: 'Departamento', value: config.filters.departamento || '-' },
        ]
      : []),
  ];

  const blockRows: Record<string, Array<Record<string, unknown>>> = config.templateKey === 'ventas_compras_bloques'
    ? {
        summary: ventasComprasSummaryRows,
        sales: salesRows,
        purchases: purchasesRows,
      }
    : {
        summary: carteraSummaryRows,
        receivables: receivablesRows,
        payables: payablesRows,
      };

  const activeCards = config.templateKey === 'ventas_compras_bloques'
    ? [
        { label: 'Facturado', value: formatAmount(totalFacturado) },
        { label: 'Comprado', value: formatAmount(totalComprado) },
        { label: 'Neto comercial', value: formatAmount(netoComercial) },
        { label: 'Bloques', value: String(config.blocks.length) },
      ]
    : [
        { label: 'Neto', value: formatAmount(netoCartera) },
        { label: 'Cobertura', value: `${coverage.toFixed(1)}%` },
        { label: 'Por cobrar', value: formatAmount(totalCobrarSaldo) },
        { label: 'Bloques', value: String(config.blocks.length) },
      ];

  const scheduleReportKey = preset?.scheduleReportKey || 'plantillas.cartera_bloques';
  const scheduleParams: Record<string, string> = config.templateKey === 'ventas_compras_bloques'
    ? {
        template_id: String(selectedTemplate?.id || ''),
        empresa: config.filters.empresa,
        sucursal: config.filters.sucursal,
        periodo: config.filters.periodo,
        desde: config.filters.desde,
        hasta: config.filters.hasta,
        moneda: config.filters.moneda,
        departamento: config.filters.departamento,
        order: config.filters.order,
      }
    : {
        template_id: String(selectedTemplate?.id || ''),
        empresa: config.filters.empresa,
        sucursal: config.filters.sucursal,
        periodo: config.filters.periodo,
        desde: config.filters.desde,
        hasta: config.filters.hasta,
        vencimiento: config.filters.vencimiento,
      };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Plantillas"
        title="Informes personalizados"
        description="Constructor por presets para guardar, reutilizar y programar informes unificados con criterio ejecutivo."
        actions={selectedTemplate ? (
          <ReportScheduleButton
            reportKey={scheduleReportKey}
            reportTitle={selectedTemplate.name}
            reportModule="Plantillas"
            detailHint={selectedTemplate.description || 'Entrega automatica de plantilla personalizada.'}
            reportParams={scheduleParams}
          />
        ) : null}
      />

      <ReportTemplateWorkspace
        companies={empresas}
        templates={templates}
        selectedTemplate={selectedTemplate}
        selectedTemplateId={selectedTemplateId}
      />

      {selectedTemplate ? (
        <>
          <section className="card px-5 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                {brandLogoUrl ? (
                  <div className={['flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl px-3 shadow-sm', brandLogoBackground].join(' ')}>
                    <img
                      src={brandLogoUrl}
                      alt={brandName}
                      className="max-h-full w-auto max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-lg font-black tracking-[0.18em] text-white shadow-sm">
                    {brandInitials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Plantilla activa</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{selectedTemplate.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{selectedTemplate.description || 'Sin descripcion.'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600">
                      {brandName}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {brandTagline}
                    </span>
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-medium text-cyan-700">
                      {preset?.label || config.templateKey}
                    </span>
                    {empresa ? (
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-medium text-cyan-700">
                        Empresa {empresa}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={`grid gap-2 ${activeCards.length > 3 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                {activeCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{card.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {config.blocks.map((blockConfig) => {
            const block = getReportTemplateBlock(config.templateKey, blockConfig.key);
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
            Guarda una plantilla de cartera o de ventas más compras, y luego selecciona `Abrir plantilla` para ver el informe armado con sus bloques y columnas elegidas.
          </p>
        </section>
      )}
    </div>
  );
}
