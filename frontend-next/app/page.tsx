import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';
import { ExecutiveModuleStatus, ExecutiveOverview } from '@/components/dashboard/executive-overview';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { SalesChart } from '@/components/dashboard/sales-chart';
import {
  getBalanceGeneral,
  getComprasList,
  getCuentasCobrar,
  getStockValorizado,
  getSucursales,
  getVentasResumido,
} from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';

function monthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function yearStart() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function normalizeOption(item: Record<string, string>) {
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
  return { value, label };
}

function getBalanceCode(row: Record<string, unknown>) {
  return String(row.CodPlanCta || row.codplancta || row.CODIGO || row.codigo || row.cod_cuenta || '');
}

function getBalanceSaldo(row: Record<string, unknown>) {
  return toNumber(row.SALDO || row.saldo || row.Saldo || row.total || row.Total);
}

function rowValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return toNumber(value);
    }
  }
  return 0;
}

function ventaTotal(row: Record<string, unknown>) {
  const explicitTotal = rowValue(row, ['total', 'Total', 'TOTAL', 'total_factura', 'TotalFactura']);
  if (explicitTotal) return explicitTotal;
  return rowValue(row, ['to_exento', 'To_Exento', 'TO_EXENTO', 'total_exento', 'TotalExento'])
    + rowValue(row, ['to_gravado', 'To_Gravado', 'TO_GRAVADO', 'total_gravado', 'TotalGravado'])
    + rowValue(row, ['total_iva', 'Total_IVA', 'TOTAL_IVA', 'iva', 'IVA']);
}

export default async function DashboardPage() {
  const empresasResponse = await getScopedEmpresas();
  const empresas = (empresasResponse?.data || []).map((item) => normalizeOption(item as Record<string, string>));
  const empresa = empresas[0]?.value || '';
  const sucursalesResponse = empresa ? await getSucursales(empresa) : null;
  const sucursales = (sucursalesResponse?.data || []).map((item) => normalizeOption(item as Record<string, string>));
  const sucursal = sucursales[0]?.value || '';
  const desde = yearStart();
  const hasta = today();
  const periodo = String(new Date().getFullYear());
  const mesActual = String(new Date().getMonth() + 1).padStart(2, '0');

  const comprasPromise = empresa && sucursales.length
    ? Promise.all(
        sucursales.map((item) =>
          getComprasList({
            empresa,
            sucursal: item.value,
            moneda: 'GS',
            compras_start: desde,
            compras_end: hasta,
          }),
        ),
      )
    : Promise.resolve([]);

  const [ventasResponse, cobrarResponse, valorizadoResponse, balanceResponse, comprasResponses] = empresa
    ? await Promise.all([
        getVentasResumido({ empresa, moneda: 'GS', desde, hasta, order: 'cod_cliente' }),
        getCuentasCobrar({ empresa, start: desde, end: hasta, vencimiento: true }),
        getStockValorizado({ empresa, estado: 'A', existencia: 'mayor', moneda: 'L', costeo: 'P', summary: 'S' }),
        getBalanceGeneral({ periodo, empresa, mesd: '01', mesh: mesActual, moneda: 'local', cuentad: '1', cuentah: '9', nivel: 9, aux: 'NO', saldo: 'NO' }),
        comprasPromise,
      ])
    : [null, null, null, null, null];

  const ventas = (ventasResponse?.data || []) as Array<Record<string, unknown>>;
  const cobrar = (cobrarResponse?.data || []) as Array<Record<string, unknown>>;
  const stock = (valorizadoResponse?.data || []) as Array<Record<string, unknown>>;
  const stockSummary = stock[0] || {};
  const balance = (balanceResponse?.data || []) as Array<Record<string, unknown>>;
  const compras = Array.isArray(comprasResponses)
    ? comprasResponses.flatMap((response) => (response?.data || []) as Array<Record<string, unknown>>)
    : [];

  const facturacion = ventas.reduce((acc, row) => acc + ventaTotal(row), 0);
  const saldoCobrar = cobrar.reduce((acc, row) => acc + rowValue(row, ['saldo', 'Saldo', 'SALDO']), 0);
  const inventario = rowValue(stockSummary, ['valor_inventario', 'ValorInventario', 'VALOR_INVENTARIO', 'total', 'Total']);
  const activo = balance.filter((row) => getBalanceCode(row).startsWith('1')).reduce((acc, row) => acc + getBalanceSaldo(row), 0);
  const totalCompras = compras.reduce((acc, row) => acc + toNumber(row.total), 0);

  const chartData = [
    { name: 'Ventas', value: facturacion },
    { name: 'Compras', value: totalCompras },
    { name: 'CxC', value: saldoCobrar },
    { name: 'Inventario', value: inventario },
    { name: 'Activo', value: activo },
  ];

  const moduleStatus: ExecutiveModuleStatus[] = [
    { name: 'Ventas', href: '/ventas', status: ventasResponse ? 'Conectado' as const : 'Sin datos' as const, detail: `${ventas.length} registros visibles del período.` },
    { name: 'Stock', href: '/stock', status: valorizadoResponse ? 'Conectado' as const : 'Sin datos' as const, detail: `${toNumber(stockSummary.articulos).toLocaleString('es-PY')} articulos resumidos.` },
    { name: 'Finanzas', href: '/finanzas', status: balanceResponse ? 'Conectado' as const : 'Sin datos' as const, detail: `${balance.length} líneas de balance general.` },
    { name: 'Compras', href: '/compras', status: comprasResponses ? 'Conectado' as const : 'Sin datos' as const, detail: `${compras.length} movimientos visibles del período.` },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Dashboard ejecutivo"
        title="Panel gerencial consolidado"
        description="Vista principal fortalecida con métricas reales del backend actual, accesos rápidos, rutas protegidas y una base más lista para seguir migrando el sistema sin depender de templates clásicos."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard item={{ title: 'Facturación visible', value: facturacion.toLocaleString('es-PY'), change: 'Ventas', trend: 'up' }} />
        <KpiCard item={{ title: 'Cuentas por cobrar', value: saldoCobrar.toLocaleString('es-PY'), change: 'CxC', trend: saldoCobrar > 0 ? 'neutral' : 'up' }} />
        <KpiCard item={{ title: 'Inventario valorizado', value: inventario.toLocaleString('es-PY'), change: 'Stock', trend: 'neutral' }} />
        <KpiCard item={{ title: 'Activo visible', value: activo.toLocaleString('es-PY'), change: 'Finanzas', trend: 'up' }} />
        <KpiCard item={{ title: 'Comprado visible', value: totalCompras.toLocaleString('es-PY'), change: 'Compras', trend: 'down' }} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SalesChart data={chartData} />
        <ExecutiveOverview items={moduleStatus} />
      </section>

      <QuickActions />
    </div>
  );
}
