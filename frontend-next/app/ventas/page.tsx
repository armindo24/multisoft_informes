import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';
import { ReceivablesTable } from '@/components/ventas/receivables-table';
import { SalesFilters } from '@/components/ventas/sales-filters';
import { SalesStats } from '@/components/ventas/sales-stats';
import { SalesTable } from '@/components/ventas/sales-table';
import {
  getCalificaciones,
  getCobradores,
  getComprobantesCobrar,
  getCuentasCobrar,
  getVendedores,
  getSucursales,
  getTiposCliente,
  getVentasTerminos,
  getVentasArticulosStats,
  getVentasClientesStats,
  getVentasResumido,
  getVentasVendedoresStats,
  getVentasZonas,
} from '@/lib/api';
import { loadBrandingConfig } from '@/lib/admin-config';
import { getScopedEmpresas } from '@/lib/empresas-server';
import { CuentaCobrar, SelectOption, VentaResumen } from '@/types/ventas';

function monthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function normalizeOption(item: Record<string, string>): SelectOption {
  const value =
    item.cod_empresa ||
    item.Cod_Empresa ||
    item.cod_sucursal ||
    item.Cod_Sucursal ||
    item.cod_calificacion ||
    item.Cod_Calificacion ||
    item.cod_tp_cliente ||
    item.Cod_Tp_Cliente ||
    item.cod_tp_comp ||
    item.Cod_Tp_Comp ||
    item.cod_con_vta ||
    item.Cod_Con_Vta ||
    item.cod_cobrador ||
    item.Cod_Cobrador ||
    item.cod_zona ||
    item.Cod_Zona ||
    item.cod_vendedor ||
    item.Cod_Vendedor ||
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
    item.des_calificacion ||
    item.Des_Calificacion ||
    item.des_tp_cliente ||
    item.Des_Tp_Cliente ||
    item.des_tp_comp ||
    item.Des_Tp_Comp ||
    item.des_con_vta ||
    item.Des_Con_Vta ||
    item.des_cobrador ||
    item.Des_Cobrador ||
    item.des_zona ||
    item.Des_Zona ||
    item.des_vendedor ||
    item.Des_Vendedor ||
    item.descripcion ||
    item.Descripcion ||
    item.label ||
    value;

  return { value, label: value && label && value !== label ? `${value} - ${label}` : label || value };
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

export default async function VentasPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const isStatsMode = typeof params.agrupacion === 'string' && params.agrupacion.trim() !== '';
  const section = String(params.section || '');
  const isReceivablesMode = section === 'cuentas-cobrar';
  const hasSubmittedFilters = ['empresa', 'sucursal', 'moneda', 'desde', 'hasta'].some((key) => {
    const value = params[key];
    return typeof value === 'string' && value.trim() !== '';
  });

  const empresasResponse = await getScopedEmpresas();
  const empresas = sanitizeOptions((empresasResponse?.data || []) as Array<Record<string, string>>);
  const empresa = String(params.empresa || empresas[0]?.value || '');
  const brandingConfig = empresa ? await loadBrandingConfig(empresa) : await loadBrandingConfig();
  const exportBranding = brandingConfig
    ? {
        clientName: brandingConfig.clientName || undefined,
        tagline: brandingConfig.tagline || undefined,
        logoUrl: brandingConfig.logoUrl || undefined,
        faviconUrl: brandingConfig.faviconUrl || undefined,
      }
    : undefined;
  const sucursalesResponse = empresa ? await getSucursales(empresa) : null;
  const sucursales = sanitizeOptions((sucursalesResponse?.data || []) as Array<Record<string, string>>);
  const sucursal = typeof params.sucursal === 'string' ? params.sucursal : '';
  const moneda = String(params.moneda || 'GS');
  const desde = String(params.desde || monthStart());
  const hasta = String(params.hasta || today());
  const order = String(params.order || 'cod_cliente');
  const tipo_cliente = String(params.tipo_cliente || '');
  const agrupacion = String(params.agrupacion || 'clientes');
  const cliente = String(params.cliente || '');
  const vendedor = String(params.vendedor || '');
  const articulo = String(params.articulo || '');
  const calificacion = String(params.calificacion || '');
  const movimiento = String(params.movimiento || '');
  const condicion = String(params.condicion || '');
  const zona = String(params.zona || '');
  const cobrador = String(params.cobrador || '');
  const tipoClienteCobrar = String(params.tipoCliente || '');
  const vencimiento = String(params.vencimiento || '');

  const tiposClienteResponse = await getTiposCliente();
  const tiposCliente = sanitizeOptions((tiposClienteResponse?.data || []) as Array<Record<string, string>>);
  const vendedoresListResponse = empresa && sucursal ? await getVendedores(empresa, sucursal) : null;
  const vendedores = sanitizeOptions((vendedoresListResponse?.data || []) as Array<Record<string, string>>);
  const [calificacionesResponse, condicionesVentaResponse, cobradoresResponse, zonasResponse, movimientosCobrarResponse] = await Promise.all([
    getCalificaciones(),
    getVentasTerminos(),
    getCobradores(),
    getVentasZonas(),
    empresa ? getComprobantesCobrar(empresa) : Promise.resolve(null),
  ]);
  const calificaciones = sanitizeOptions((calificacionesResponse?.data || []) as Array<Record<string, string>>);
  const condicionesVenta = sanitizeOptions((condicionesVentaResponse?.data || []) as Array<Record<string, string>>);
  const cobradores = sanitizeOptions((cobradoresResponse?.data || []) as Array<Record<string, string>>);
  const zonas = sanitizeOptions((zonasResponse?.data || []) as Array<Record<string, string>>);
  const movimientosCobrar = sanitizeOptions((movimientosCobrarResponse?.data || []) as Array<Record<string, string>>);

  const [ventasResponse, clientesResponse, articulosResponse, vendedoresStatsResponse, cobrarResponse] = empresa && hasSubmittedFilters
    ? await Promise.all([
        !isStatsMode && !isReceivablesMode ? getVentasResumido({ empresa, sucursal, moneda, desde, hasta, order, tipo_cliente }) : Promise.resolve(null),
        isStatsMode && sucursal ? getVentasClientesStats({ empresa, sucursal, moneda, start: desde, end: hasta, cliente, tipoCliente: tipo_cliente }) : Promise.resolve(null),
        isStatsMode && sucursal ? getVentasArticulosStats({ empresa, sucursal, moneda, start: desde, end: hasta, articulo }) : Promise.resolve(null),
        isStatsMode && sucursal ? getVentasVendedoresStats({ empresa, sucursal, moneda, start: desde, end: hasta, vendedor }) : Promise.resolve(null),
        isReceivablesMode
          ? getCuentasCobrar({ empresa, sucursal, start: desde, end: hasta, vencimiento: vencimiento === 'true', cliente, calificacion, movimiento, condicion, cobrador, vendedor, zona, tipoCliente: tipoClienteCobrar })
          : !isStatsMode
            ? getCuentasCobrar({ empresa, sucursal, start: desde, end: hasta, vencimiento: true })
            : Promise.resolve(null),
      ])
    : [null, null, null, null, null];

  const ventas = (ventasResponse?.data || []) as VentaResumen[];
  const cuentasCobrar = (cobrarResponse?.data || []) as CuentaCobrar[];
  const totalFacturado = ventas.reduce((acc, item) => acc + toNumber(item.to_gravado) + toNumber(item.total_iva), 0);
  const totalDescuentos = ventas.reduce((acc, item) => acc + toNumber(item.totaldescuento), 0);
  const totalIva = ventas.reduce((acc, item) => acc + toNumber(item.total_iva), 0);
  const saldoPendiente = cuentasCobrar.reduce((acc, item) => acc + toNumber(item.saldo), 0);

  const estadisticasRows =
    agrupacion === 'articulos'
      ? ((articulosResponse?.data || []) as Array<Record<string, unknown>>)
      : agrupacion === 'vendedores'
        ? ((vendedoresStatsResponse?.data || []) as Array<Record<string, unknown>>)
        : ((clientesResponse?.data || []) as Array<Record<string, unknown>>);

  const current = { empresa, sucursal, moneda, desde, hasta, order, tipo_cliente, agrupacion, cliente, vendedor, articulo, calificacion, movimiento, condicion, zona, cobrador, tipoCliente: tipoClienteCobrar, vencimiento };
  const statsLoaded = Boolean(clientesResponse || articulosResponse || vendedoresStatsResponse);
  const connectionWarning = !empresa
    ? 'No se encontraron empresas configuradas en el API.'
    : isStatsMode
      ? hasSubmittedFilters && !statsLoaded
        ? 'No se pudieron obtener las estadisticas de ventas para este filtro. Intenta nuevamente.'
        : ''
      : isReceivablesMode
        ? hasSubmittedFilters && !cobrarResponse
          ? 'No se pudieron obtener las cuentas por cobrar para este filtro. Intenta nuevamente.'
          : ''
      : hasSubmittedFilters && !ventasResponse && !cobrarResponse
      ? 'No se pudieron obtener las ventas para este filtro. Intenta nuevamente.'
      : '';

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Gestion comercial"
        title="Ventas"
        description="Analiza ventas, estadisticas comerciales y cuentas por cobrar con filtros por periodo, cliente, vendedor y sucursal."
      />

      <SalesFilters empresas={empresas} sucursales={sucursales} tiposCliente={tiposCliente} vendedores={vendedores} calificaciones={calificaciones} condicionesVenta={condicionesVenta} cobradores={cobradores} zonas={zonas} movimientosCobrar={movimientosCobrar} current={current} showStatsFields={isStatsMode} showReceivablesFields={isReceivablesMode} />

      {!hasSubmittedFilters && empresa ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          Selecciona los filtros y presiona Aplicar para consultar datos de ventas. Asi la entrada al modulo es mas rapida.
        </div>
      ) : null}

      {connectionWarning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{connectionWarning}</div>
      ) : null}

      {isStatsMode ? (
        <SalesStats rows={estadisticasRows} agrupacion={agrupacion} moneda={moneda} exportBranding={exportBranding} />
      ) : isReceivablesMode ? (
        <div id="cuentas-cobrar" className="scroll-mt-28">
          <ReceivablesTable rows={cuentasCobrar} exportBranding={exportBranding} />
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard item={{ title: 'Facturacion visible', value: totalFacturado.toLocaleString('es-PY'), change: `${ventas.length} comprobantes`, trend: 'up' }} />
            <KpiCard item={{ title: 'IVA acumulado', value: totalIva.toLocaleString('es-PY'), change: moneda, trend: 'neutral' }} />
            <KpiCard item={{ title: 'Descuentos', value: totalDescuentos.toLocaleString('es-PY'), change: 'Periodo filtrado', trend: 'down' }} />
            <KpiCard item={{ title: 'Saldo por cobrar', value: saldoPendiente.toLocaleString('es-PY'), change: `${cuentasCobrar.length} documentos`, trend: saldoPendiente > 0 ? 'neutral' : 'up' }} />
          </section>

          <div id="ventas-resumen" className="scroll-mt-28">
            <SalesTable rows={ventas} groupBy={order} exportBranding={exportBranding} />
          </div>
        </>
      )}
    </div>
  );
}
