import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';
import { PurchaseFilters } from '@/components/compras/purchase-filters';
import { PurchaseOrdersTable } from '@/components/compras/purchase-orders-table';
import { PurchasesTable } from '@/components/compras/purchases-table';
import {
  getComprasList,
  getDepartamentos,
  getOrdenCompraList,
  getProveedores,
  getSucursales,
  getTipoOrdenCompra,
} from '@/lib/api';
import { loadBrandingConfig } from '@/lib/admin-config';
import { getScopedEmpresas } from '@/lib/empresas-server';
import { CompraRow, OrdenCompraRow, SelectOption } from '@/types/compras';

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
    item.coddpto ||
    item.CodDpto ||
    item.codprov ||
    item.CodProv ||
    item.cod_tp_comp ||
    item.Cod_Tp_Comp ||
    item.CodTipoOrden ||
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
    item.descrip ||
    item.Descrip ||
    item.RazonSocial ||
    item.Des_Tp_Comp ||
    item.DesTipoOrden ||
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

    if (!value || !label) continue;
    if (seen.has(value)) continue;

    seen.add(value);
    result.push({ value, label });
  }

  return result;
}

export default async function ComprasPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const section = String(params.section || 'compras-resumen');
  const isComprasResumenSection = !section || section === 'compras-resumen';
  const hasSubmittedFilters = ['empresa', 'sucursal', 'departamento', 'moneda', 'proveedor', 'tipooc', 'estado', 'agrupar', 'compras_start', 'compras_end'].some((key) => {
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
  const sucursal = String(params.sucursal || sucursales[0]?.value || '');

  const departamentosResponse = empresa && sucursal ? await getDepartamentos(empresa, sucursal) : null;
  const proveedoresResponse = empresa ? await getProveedores(empresa) : null;
  const tiposResponse = empresa ? await getTipoOrdenCompra(empresa) : null;

  const departamentos = sanitizeOptions((departamentosResponse?.data || []) as Array<Record<string, string>>);
  const proveedores = sanitizeOptions((proveedoresResponse?.data || []) as Array<Record<string, string>>).slice(0, 200);
  const tiposoc = sanitizeOptions((tiposResponse?.data || []) as Array<Record<string, string>>);

  const departamento = String(params.departamento || departamentos[0]?.value || '');
  const moneda = String(params.moneda || 'GS');
  const proveedor = String(params.proveedor || '');
  const tipooc = String(params.tipooc || '');
  const estado = String(params.estado || '');
  const agrupar = String(params.agrupar || '');
  const compras_start = String(params.compras_start || monthStart());
  const compras_end = String(params.compras_end || today());

  const [comprasResponse, ordenesResponse] = empresa && sucursal && departamento && hasSubmittedFilters
    ? await Promise.all([
        getComprasList({ empresa, sucursal, moneda, compras_start, compras_end, departamento, proveedor, tipooc, agrupar }),
        getOrdenCompraList({ empresa, sucursal, compras_start, compras_end, departamento, proveedor, tipooc, estado }),
      ])
    : [null, null];

  const compras = (comprasResponse?.data || []) as CompraRow[];
  const ordenes = (ordenesResponse?.data || []) as OrdenCompraRow[];

  const totalComprado = compras.reduce((acc, row) => acc + toNumber(row.total), 0);
  const totalIva = compras.reduce((acc, row) => acc + toNumber(row.IVA || row.iva), 0);
  const ordenesAbiertas = ordenes.filter((row) => !['Cancelado', 'Recibido en Casa Matriz'].includes(String(row.estado || ''))).length;
  const totalOrdenado = ordenes.reduce((acc, row) => acc + toNumber(row.total), 0);

  const current = { empresa, sucursal, departamento, moneda, proveedor, tipooc, estado, agrupar, compras_start, compras_end, section };
  const connectionWarning = !empresa
    ? 'No se encontraron empresas configuradas en el API.'
    : isComprasResumenSection && hasSubmittedFilters && !comprasResponse && !ordenesResponse
      ? 'No se pudo obtener informacion de compras para este filtro. Intenta nuevamente.'
      : '';

  const sectionMeta: Record<string, { title: string; description: string; eyebrow?: string }> = {
    'compras-resumen': {
      title: 'Compras',
      description: 'Consulta compras del periodo, ordenes, proveedores y articulos con filtros claros y salidas para analisis.',
      eyebrow: 'Abastecimiento',
    },
    'orden-compra': {
      title: 'Orden de Compra',
      description: 'Gestion y consulta de ordenes de compra con filtros operativos.',
      eyebrow: 'Modulo abastecimiento',
    },
    'compras-articulo': {
      title: 'Compras por Articulos',
      description: 'Analisis de compras por articulo, proveedor y periodo.',
      eyebrow: 'Modulo abastecimiento',
    },
    'cuentas-pagar': {
      title: 'Cuentas por Pagar',
      description: 'Consulta de saldos pendientes de proveedores y documentos por pagar.',
      eyebrow: 'Modulo abastecimiento',
    },
    'fondo-fijo': {
      title: 'Fondo Fijo',
      description: 'Seguimiento de fondo fijo y rendiciones operativas.',
      eyebrow: 'Caja chica',
    },
    'gastos-rendir': {
      title: 'Gastos por Rendir',
      description: 'Control de gastos pendientes de rendicion.',
      eyebrow: 'Caja chica',
    },
    'estadisticas-compras': {
      title: 'Estadisticas de Compras',
      description: 'Indicadores y rankings para evaluar el comportamiento de compras.',
      eyebrow: 'Analitica',
    },
  };
  const currentSectionMeta = sectionMeta[section] || sectionMeta['compras-resumen'];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={currentSectionMeta.eyebrow || 'Abastecimiento'}
        title={currentSectionMeta.title}
        description={currentSectionMeta.description}
      />

      {isComprasResumenSection ? (
        <PurchaseFilters
          empresas={empresas}
          sucursales={sucursales}
          departamentos={departamentos}
          proveedores={proveedores}
          tiposoc={tiposoc}
          current={current}
        />
      ) : (
        <section id={section} className="card px-5 py-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Menu historico recuperado</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{currentSectionMeta.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Esta opcion ya aparece integrada en el menu lateral como en el sistema anterior. La siguiente etapa es migrar su formulario y resultado sobre esta misma pantalla, sin abrir ventanas externas ni duplicar navegacion.
            </p>
          </div>
        </section>
      )}

      {isComprasResumenSection && !hasSubmittedFilters && empresa ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          Selecciona los filtros y presiona Aplicar para consultar compras. Asi la entrada al modulo es mas rapida.
        </div>
      ) : null}

      {connectionWarning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{connectionWarning}</div>
      ) : null}

      {isComprasResumenSection ? (
        <>
          <section id="compras-resumen" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard item={{ title: 'Comprado visible', value: totalComprado.toLocaleString('es-PY'), change: `${compras.length} facturas`, trend: 'up' }} />
            <KpiCard item={{ title: 'IVA compras', value: totalIva.toLocaleString('es-PY'), change: moneda, trend: 'neutral' }} />
            <KpiCard item={{ title: 'Ordenes abiertas', value: ordenesAbiertas.toLocaleString('es-PY'), change: `${ordenes.length} visibles`, trend: ordenesAbiertas > 0 ? 'neutral' : 'up' }} />
            <KpiCard item={{ title: 'Monto ordenado', value: totalOrdenado.toLocaleString('es-PY'), change: 'Ordenes de compra', trend: 'up' }} />
          </section>

          <PurchasesTable
            rows={compras}
            exportBranding={exportBranding}
            scheduleConfig={{
              reportKey: 'compras.compras_periodo',
              reportModule: 'Compras',
              reportParams: current,
            }}
          />
          <PurchaseOrdersTable
            rows={ordenes}
            exportBranding={exportBranding}
            scheduleConfig={{
              reportKey: 'compras.ordenes_compra',
              reportModule: 'Compras',
              reportParams: current,
            }}
          />
        </>
      ) : (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <KpiCard item={{ title: 'Migracion visual', value: 'Lista', change: 'Menu lateral activo', trend: 'up' }} />
          <KpiCard item={{ title: 'Acceso interno', value: 'Unificado', change: 'Sin ventana externa', trend: 'up' }} />
          <KpiCard item={{ title: 'Siguiente paso', value: 'Formulario', change: 'Pendiente de migracion', trend: 'neutral' }} />
        </section>
      )}
    </div>
  );
}
