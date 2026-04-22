import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';
import { StockAlerts } from '@/components/stock/stock-alerts';
import { StockCostoArticuloFullFilters } from '@/components/stock/stock-costo-articulo-full-filters';
import { StockCostoArticuloFullResults } from '@/components/stock/stock-costo-articulo-full-results';
import { StockExistenceTable } from '@/components/stock/stock-existence-table';
import { StockFilters } from '@/components/stock/stock-filters';
import { StockValuationTable } from '@/components/stock/stock-valuation-table';
import {
  getSucursales,
  getStockDepositos,
  getStockExistenciaDeposito,
  getStockFamilias,
  getStockGrupos,
  getStockTiposArticulos,
  getStockValorizado,
} from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';
import { SelectOption, StockDepositoRow, StockValorizadoRow } from '@/types/stock';

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeOption(item: Record<string, string>): SelectOption {
  const value =
    item.cod_empresa ||
    item.Cod_Empresa ||
    item.cod_sucursal ||
    item.Cod_Sucursal ||
    item.cod_deposito ||
    item.Cod_Deposito ||
    item.codfamilia ||
    item.CodFamilia ||
    item.codgrupo ||
    item.CodGrupo ||
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
    item.des_deposito ||
    item.Des_Deposito ||
    item.desfamilia ||
    item.DesFamilia ||
    item.desgrupo ||
    item.DesGrupo ||
    item.descrip ||
    item.Descrip ||
    item.descripcion ||
    item.Descripcion ||
    item.name ||
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

export default async function StockPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const section = String(params.section || '');
  const isCostoArticuloFullMode = section === 'costo-articulo-full';
  const hasSubmittedFilters = ['empresa', 'sucursal', 'deposito', 'familia', 'grupo', 'tipo', 'estado', 'existencia', 'moneda'].some((key) => {
    const value = params[key];
    return typeof value === 'string' && value.trim() !== '';
  });
  const hasSubmittedCostoArticuloFull = String(params.submitted || '') === '1';
  const empresasResponse = await getScopedEmpresas();
  const empresas = sanitizeOptions((empresasResponse?.data || []) as Array<Record<string, string>>);
  const empresa = String(params.empresa || empresas[0]?.value || '');

  const sucursalesResponse = empresa ? await getSucursales(empresa) : null;
  const sucursales = sanitizeOptions((sucursalesResponse?.data || []) as Array<Record<string, string>>);
  const sucursal = typeof params.sucursal === 'string' ? params.sucursal : '';

  const [depositosResponse, familiasResponse, tiposResponse] = empresa
    ? await Promise.all([
        sucursal ? getStockDepositos(empresa, sucursal) : Promise.resolve(null),
        getStockFamilias(),
        getStockTiposArticulos(),
      ])
    : [null, null, null];

  const familia = String(params.familia || '');
  const gruposResponse = familia ? await getStockGrupos(familia) : null;

  const depositos = sanitizeOptions((depositosResponse?.data || []) as Array<Record<string, string>>);
  const familias = sanitizeOptions((familiasResponse?.data || []) as Array<Record<string, string>>);
  const grupos = sanitizeOptions((gruposResponse?.data || []) as Array<Record<string, string>>);
  const tipos = sanitizeOptions((tiposResponse?.data || []) as Array<Record<string, string>>);

  const deposito = String(params.deposito || '');
  const tipo = String(params.tipo || '');
  const grupo = String(params.grupo || '');
  const estado = String(params.estado || 'A');
  const existencia = String(params.existencia || 'mayor');
  const moneda = String(params.moneda || 'L');
  const costeo = String(params.costeo || 'P');
  const articulo = String(params.articulo || '');
  const now = new Date();
  const defaultFechaHasta = formatDateInput(now);
  const defaultFechaDesde = formatDateInput(new Date(now.getFullYear(), now.getMonth(), 1));
  const fechad = String(params.fechad || defaultFechaDesde);
  const fechah = String(params.fechah || defaultFechaHasta);
  const calcular_empresa = String(params.calcular_empresa || '');
  const ecuacion_mat = String(params.ecuacion_mat || '');

  const [existenciaResponse, valorizadoResponse] = empresa && hasSubmittedFilters
    ? await Promise.all([
        getStockExistenciaDeposito({ empresa, sucursal, deposito, estado, tipo, familia, grupo, existencia }),
        getStockValorizado({ empresa, sucursal, deposito, estado, tipo, familia, grupo, existencia, moneda, costeo }),
      ])
    : [null, null];
  const existenciaRows = (existenciaResponse?.data || []) as StockDepositoRow[];
  const valorizadoRows = (valorizadoResponse?.data || []) as StockValorizadoRow[];

  const totalExistencia = valorizadoRows.reduce((acc, row) => acc + toNumber(row.total_existencia), 0);
  const valorInventario = valorizadoRows.reduce((acc, row) => acc + toNumber(row.total_existencia) * toNumber(row.costo), 0);
  const articulosConStock = valorizadoRows.filter((row) => toNumber(row.total_existencia) > 0).length;
  const alertasReposicion = existenciaRows.filter((row) => toNumber(row.existencia) <= toNumber(row.pto_pedido)).length;
  const currencyLabel = moneda === 'E' ? 'USD' : 'Gs';

  const current = { empresa, sucursal, deposito, familia, grupo, tipo, estado, existencia, moneda };
  const costoArticuloCurrent = { empresa, articulo, tipo, estado, fechad, fechah, calcular_empresa, ecuacion_mat };
  const connectionWarning = !empresa
    ? 'No se encontraron empresas configuradas en el API.'
    : !isCostoArticuloFullMode && !existenciaResponse && !valorizadoResponse
      ? 'No se pudo consultar el API de stock. Verifica que Node y la base integrada esten levantados.'
      : '';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Modulo migrado"
        title={isCostoArticuloFullMode ? 'Costo Articulo Full' : 'Stock'}
        description={
          isCostoArticuloFullMode
            ? 'Seccion integrada dentro de Stock usando el endpoint real del informe historico para costo articulo full, sin duplicar navegacion dentro de la pantalla.'
            : 'Esta migracion ya consume endpoints reales del backend actual para existencia por deposito, stock valorizado y catalogos auxiliares. Con esto ya puedes reemplazar la vista antigua por una pantalla mas ejecutiva y mantenible.'
        }
      />

      {isCostoArticuloFullMode ? (
        <StockCostoArticuloFullFilters empresas={empresas} tipos={tipos} current={costoArticuloCurrent} />
      ) : (
        <StockFilters
          empresas={empresas}
          sucursales={sucursales}
          depositos={depositos}
          familias={familias}
          grupos={grupos}
          tipos={tipos}
          current={current}
        />
      )}

      {isCostoArticuloFullMode ? !hasSubmittedCostoArticuloFull && empresa ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          Selecciona los filtros y presiona Procesar para consultar costo articulo full.
        </div>
      ) : null : !hasSubmittedFilters && empresa ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          Selecciona los filtros y presiona Aplicar para consultar stock. Asi la entrada al modulo es mas rapida.
        </div>
      ) : null}

      {connectionWarning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{connectionWarning}</div>
      ) : null}

      {isCostoArticuloFullMode ? (
        <StockCostoArticuloFullResults
          empresa={empresa}
          articulo={articulo}
          tipo={tipo}
          estado={estado}
          fechad={fechad}
          fechah={fechah}
          calcular_empresa={calcular_empresa}
          ecuacion_mat={ecuacion_mat}
          submitted={hasSubmittedCostoArticuloFull}
        />
      ) : (
        <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard item={{ title: 'Articulos con stock', value: articulosConStock.toLocaleString('es-PY'), change: `${valorizadoRows.length} visibles`, trend: 'up' }} />
        <KpiCard item={{ title: 'Existencia acumulada', value: totalExistencia.toLocaleString('es-PY'), change: 'Filtro actual', trend: 'neutral' }} />
        <KpiCard item={{ title: 'Inventario valorizado', value: `${valorInventario.toLocaleString('es-PY')} ${currencyLabel}`, change: 'Costeo promedio', trend: 'up' }} />
        <KpiCard item={{ title: 'Alertas de reposicion', value: alertasReposicion.toLocaleString('es-PY'), change: 'Punto de pedido', trend: alertasReposicion > 0 ? 'down' : 'up' }} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <StockValuationTable rows={valorizadoRows} currencyLabel={currencyLabel} />
        <StockAlerts rows={existenciaRows} />
      </section>

      <StockExistenceTable rows={existenciaRows} />
        </>
      )}
    </div>
  );
}
