export type ApiEnvelope<T> = {
  data: T;
};

const API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const baseUrl = typeof window === 'undefined' ? API_BASE : '/proxy';
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      cache: init?.cache ?? 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function hasItems<T>(response: ApiEnvelope<T[]> | null | undefined): response is ApiEnvelope<T[]> {
  return Array.isArray(response?.data) && response.data.length > 0;
}

function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function getIntegradoStatus() {
  return safeFetch('/integrado/status');
}

export async function getSueldoStatus() {
  return safeFetch('/sueldo/status');
}

export async function getEmpresas() {
  const primary = await safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/empresa/select', {
    cache: 'force-cache',
    next: { revalidate: 300 },
  });
  if (hasItems(primary)) {
    return primary;
  }

  const fallback = await safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/users/1/empresas/Integrado', {
    cache: 'force-cache',
    next: { revalidate: 300 },
  });
  if (hasItems(fallback)) {
    return fallback;
  }

  return primary || fallback;
}

export async function getEmpresasByUser(userId: number | string, base = 'Integrado') {
  const normalizedUserId = String(userId || '').trim();
  const normalizedBase = String(base || 'Integrado').trim() || 'Integrado';

  if (!normalizedUserId) {
    return { data: [] as Array<Record<string, string>> };
  }

  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/users/${normalizedUserId}/empresas/${normalizedBase}`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  });
}

export async function getEmpresaMeta(empresa: string) {
  return safeFetch<ApiEnvelope<Record<string, string>>>(`/empresa/meta/${empresa}`);
}

export async function getSucursales(empresa: string) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/sucursal/select/${empresa}`);
}

export async function getTiposCliente() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/clientes/tipos');
}

export async function getVendedores(empresa: string, sucursal?: string) {
  const query = toQuery({ sucursal });
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/empresas/${empresa}/vendedores${query}`);
}

export async function getCalificaciones() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/calificaciones');
}

export async function getVentasTerminos() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/ventas/terminos');
}

export async function getCobradores() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/cobradores');
}

export async function getVentasZonas() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/ventas/zonas');
}

export async function getComprobantesCobrar(empresa: string) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/empresas/${empresa}/comprobantes/cobrar`);
}

export async function getClientesSearch(params: {
  empresa: string;
  cliente: string;
  sucursal?: string;
  tipo?: string;
}) {
  const query = toQuery({
    cliente: params.cliente,
    sucursal: params.sucursal,
    tipo: params.tipo,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/empresas/${params.empresa}/clientes${query}`);
}

export async function getVentasArticulosSearch(params: {
  empresa: string;
  articulo: string;
  sucursal?: string;
}) {
  const query = toQuery({
    articulo: params.articulo,
    sucursal: params.sucursal,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/ventas/${params.empresa}/articulos${query}`);
}

export async function getVentasResumido(params: {
  empresa: string;
  moneda?: string;
  sucursal?: string;
  desde?: string;
  hasta?: string;
  order?: string;
  tipo_cliente?: string;
  cliente?: string;
  tipo_comprobante?: string;
}) {
  const query = toQuery({
    moneda: params.moneda || 'GS',
    sucursal: params.sucursal,
    desde: params.desde,
    hasta: params.hasta,
    order: params.order,
    tipo_cliente: params.tipo_cliente,
    cliente: params.cliente,
    tipo_comprobante: params.tipo_comprobante,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/empresas/${params.empresa}/informes/ventas_resumido${query}`);
}

export async function getVentaDetalle(params: { empresa: string; comprobante: string }) {
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/empresas/${params.empresa}/ventas/${params.comprobante}`);
}

export async function getVentasClientesStats(params: {
  empresa: string;
  sucursal?: string;
  moneda?: string;
  start: string;
  end: string;
  cliente?: string;
  tipoCliente?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    moneda: params.moneda || 'GS',
    start: params.start,
    end: params.end,
    cliente: params.cliente,
    tipoCliente: params.tipoCliente,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/estadisticas/ventas/clientes${query}`);
}

export async function getVentasArticulosStats(params: {
  empresa: string;
  sucursal?: string;
  moneda?: string;
  start: string;
  end: string;
  articulo?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    moneda: params.moneda || 'GS',
    start: params.start,
    end: params.end,
    articulo: params.articulo,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/estadisticas/ventas/articulos${query}`);
}

export async function getVentasVendedoresStats(params: {
  empresa: string;
  sucursal?: string;
  moneda?: string;
  start: string;
  end: string;
  vendedor?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    moneda: params.moneda || 'GS',
    start: params.start,
    end: params.end,
    vendedor: params.vendedor,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/estadisticas/ventas/vendedores${query}`);
}

export async function getCuentasCobrar(params: {
  empresa: string;
  sucursal?: string;
  start: string;
  end: string;
  vencimiento?: boolean;
  cliente?: string;
  calificacion?: string;
  movimiento?: string;
  condicion?: string;
  cobrador?: string;
  vendedor?: string;
  zona?: string;
  tipoCliente?: string;
}) {
  const query = toQuery({
    sucursal: params.sucursal,
    start: params.start,
    end: params.end,
    vencimiento: params.vencimiento ? 'true' : 'false',
    cliente: params.cliente,
    calificacion: params.calificacion,
    movimiento: params.movimiento,
    condicion: params.condicion,
    cobrador: params.cobrador,
    vendedor: params.vendedor,
    zona: params.zona,
    tipoCliente: params.tipoCliente,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/ventas/${params.empresa}/cuentas/cobrar${query}`);
}


export async function getStockFamilias() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/stock/familias');
}

export async function getStockGrupos(familia: string) {
  const query = toQuery({ familia });
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/stock/grupos${query}`);
}

export async function getStockTiposArticulos() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/stock/tipos/articulos');
}

export async function getStockDepositos(empresa: string, sucursal: string) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/stock/${empresa}/sucursales/${sucursal}/depositos`);
}

export async function getStockExistenciaDeposito(params: {
  empresa: string;
  sucursal?: string;
  deposito?: string;
  estado?: string;
  tipo?: string;
  familia?: string;
  grupo?: string;
  existencia?: string;
}) {
  const query = toQuery({
    sucursal: params.sucursal,
    deposito: params.deposito,
    estado: params.estado,
    tipo: params.tipo,
    familia: params.familia,
    grupo: params.grupo,
    existencia: params.existencia,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/stock/informes/${params.empresa}/deposito${query}`);
}

export async function getStockValorizado(params: {
  empresa: string;
  sucursal?: string;
  deposito?: string;
  estado?: string;
  tipo?: string;
  familia?: string;
  grupo?: string;
  existencia?: string;
  moneda?: string;
  costeo?: string;
  summary?: string;
}) {
  const query = toQuery({
    sucursal: params.sucursal,
    deposito: params.deposito,
    estado: params.estado,
    tipo: params.tipo,
    familia: params.familia,
    grupo: params.grupo,
    existencia: params.existencia,
    moneda: params.moneda || 'L',
    costeo: params.costeo || 'P',
    summary: params.summary,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/stock/informes/${params.empresa}/valorizado${query}`);
}

export async function getStockCostoArticuloFull(params: {
  empresa: string;
  articulo?: string;
  tipo?: string;
  estado?: string;
  fechad?: string;
  fechah?: string;
  calcular_empresa?: string;
  inventario_fisico?: string;
  ecuacion_mat?: string;
  periodo?: string;
  anho?: string;
  fecha_inicio_desde?: string;
  fecha_inicio_hasta?: string;
  fecha_fin_desde?: string;
  fecha_fin_hasta?: string;
  recalcular?: string;
}) {
  const query = toQuery({
    articulo: params.articulo,
    tipo: params.tipo,
    estado: params.estado,
    fechad: params.fechad,
    fechah: params.fechah,
    calcular_empresa: params.calcular_empresa,
    inventario_fisico: params.inventario_fisico,
    ecuacion_mat: params.ecuacion_mat,
    periodo: params.periodo,
    anho: params.anho,
    fecha_inicio_desde: params.fecha_inicio_desde,
    fecha_inicio_hasta: params.fecha_inicio_hasta,
    fecha_fin_desde: params.fecha_fin_desde,
    fecha_fin_hasta: params.fecha_fin_hasta,
    recalcular: params.recalcular,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/stock/informes/${params.empresa}/costo_articulo_full${query}`);
}

export async function startStockCostoArticuloFullAsync(params: {
  empresa: string;
  articulo?: string;
  tipo?: string;
  estado?: string;
  fechad?: string;
  fechah?: string;
  calcular_empresa?: string;
  inventario_fisico?: string;
  ecuacion_mat?: string;
  periodo?: string;
  anho?: string;
  fecha_inicio_desde?: string;
  fecha_inicio_hasta?: string;
  fecha_fin_desde?: string;
  fecha_fin_hasta?: string;
  recalcular?: string;
}) {
  const query = toQuery({
    articulo: params.articulo,
    tipo: params.tipo,
    estado: params.estado,
    fechad: params.fechad,
    fechah: params.fechah,
    calcular_empresa: params.calcular_empresa,
    inventario_fisico: params.inventario_fisico,
    ecuacion_mat: params.ecuacion_mat,
    periodo: params.periodo,
    anho: params.anho,
    fecha_inicio_desde: params.fecha_inicio_desde,
    fecha_inicio_hasta: params.fecha_inicio_hasta,
    fecha_fin_desde: params.fecha_fin_desde,
    fecha_fin_hasta: params.fecha_fin_hasta,
    recalcular: params.recalcular,
  });
  return safeFetch<ApiEnvelope<Record<string, unknown>>>(`/stock/informes/${params.empresa}/costo_articulo_full_async/start${query}`);
}

export async function getStockCostoArticuloFullAsyncStatus(empresa: string, jobId: string) {
  const query = toQuery({ job_id: jobId });
  return safeFetch<ApiEnvelope<Record<string, unknown>>>(`/stock/informes/${empresa}/costo_articulo_full_async/status${query}`);
}

export async function getStockCostoArticuloFullAsyncResult(empresa: string, jobId: string) {
  const query = toQuery({ job_id: jobId });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/stock/informes/${empresa}/costo_articulo_full_async/result${query}`);
}



export async function getDepartamentos(empresa: string, sucursal: string) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/departamento/select/${empresa}/${sucursal}`);
}

export async function getProveedores(empresa: string) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/proveedor/select/${empresa}`);
}

export async function getTipoOrdenCompra(empresa: string) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/tipooc/select/${empresa}`);
}

export async function getComprasList(params: {
  empresa: string;
  sucursal: string;
  moneda?: string;
  compras_start: string;
  compras_end: string;
  departamento: string;
  proveedor?: string;
  tipooc?: string;
  agrupar?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    moneda: params.moneda || 'GS',
    compras_start: params.compras_start,
    compras_end: params.compras_end,
    departamento: params.departamento,
    proveedor: params.proveedor,
    tipooc: params.tipooc,
    agrupar: params.agrupar,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/compras/list${query}`);
}

export async function getOrdenCompraList(params: {
  empresa: string;
  sucursal: string;
  compras_start: string;
  compras_end: string;
  departamento: string;
  proveedor?: string;
  tipooc?: string;
  estado?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    compras_start: params.compras_start,
    compras_end: params.compras_end,
    departamento: params.departamento,
    proveedor: params.proveedor,
    tipooc: params.tipooc,
    estado: params.estado,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/ordencompra/list${query}`);
}

export async function getComprasProveedorRanking(params: {
  empresa: string;
  sucursal: string;
  moneda?: string;
  compras_start: string;
  compras_end: string;
  proveedor?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    moneda: params.moneda || 'GS',
    compras_start: params.compras_start,
    compras_end: params.compras_end,
    proveedor: params.proveedor,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/compras_proveedor/ranking${query}`);
}

export async function getComprasArticuloRanking(params: {
  empresa: string;
  sucursal: string;
  moneda?: string;
  compras_start: string;
  compras_end: string;
  proveedor?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    sucursal: params.sucursal,
    moneda: params.moneda || 'GS',
    compras_start: params.compras_start,
    compras_end: params.compras_end,
    proveedor: params.proveedor,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/compras_articulo/ranking${query}`);
}

export async function getBalanceGeneral(params: {
  empresa: string;
  periodo: string;
  mesd: string;
  mesh: string;
  cuentad?: string;
  cuentah?: string;
  nivel?: string | number;
  moneda?: string;
  aux?: string;
  saldo?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    periodo: params.periodo,
    mesd: params.mesd,
    mesh: params.mesh,
    cuentad: params.cuentad || '1',
    cuentah: params.cuentah || '9',
    nivel: params.nivel || 9,
    moneda: params.moneda || 'local',
    aux: params.aux || 'NO',
    saldo: params.saldo || 'NO',
  });
  return safeFetch<{ data: Array<Record<string, unknown>>; warning?: string }>(`/balancegeneral/list/${query}`);
}

export async function getBalanceGeneralPuc(params: {
  empresa: string;
  periodo: string;
  mesd: string;
  mesh: string;
  cuentad?: string;
  cuentah?: string;
  nivel?: string | number;
  moneda?: string;
  aux?: string;
  saldo?: string;
  practicado_al?: string;
  recalcular_saldos?: string;
  codigo_entidad?: string;
  balance_cuentas_puc?: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    periodo: params.periodo,
    mesd: params.mesd,
    mesh: params.mesh,
    cuentad: params.cuentad || '1',
    cuentah: params.cuentah || '9',
    nivel: params.nivel || 9,
    moneda: params.moneda || 'local',
    aux: params.aux || 'NO',
    saldo: params.saldo || 'NO',
    practicado_al: params.practicado_al,
    recalcular_saldos: params.recalcular_saldos,
    codigo_entidad: params.codigo_entidad,
    balance_cuentas_puc: params.balance_cuentas_puc,
  });
  return safeFetch<{
    data: Array<Record<string, unknown>>;
    resultado?: { local?: number; extranjera?: number };
    warning?: string;
  }>(`/balancegeneral_puc/list/${query}`);
}

export async function getFlowCash(params: { empresa: string; periodo: string; mes: string }) {
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/flowcash/${params.periodo}/${params.empresa}/${params.mes}`);
}

export async function getBalanceIntegralAuxiliares(params: {
  empresa: string;
  periodo: string;
  mesd: string;
  mesh: string;
  moneda?: string;
  cuentad?: string;
  cuentah?: string;
  fechad?: string;
  fechah?: string;
  limit?: number;
}) {
  const query = toQuery({
    empresa: params.empresa,
    periodo: params.periodo,
    mesd: params.mesd,
    mesh: params.mesh,
    moneda: params.moneda || 'local',
    cuentad: params.cuentad || '1',
    cuentah: params.cuentah || '9',
    fechad: params.fechad,
    fechah: params.fechah,
    limit: params.limit || 10,
  });
  return safeFetch<{
    clientes: Array<Record<string, unknown>>;
    proveedores: Array<Record<string, unknown>>;
    warning?: string;
  }>(`/balanceintegral/auxiliares${query}`);
}

export async function getBalanceComprobado(params: {
  empresa: string;
  periodo: string;
  periodoant: string;
  mes: string;
  mesant: string;
  nivel?: string | number;
  moneda?: string;
}) {
  return safeFetch<{
    data: Array<Record<string, unknown>>;
    warning?: string;
  }>(`/balancecomprobado/list/${params.empresa}/${params.periodo}/${params.periodoant}/${params.mes}/${params.mesant}/${params.nivel || 0}/${params.moneda || 'local'}`);
}

export async function getTipoAsientoOptions() {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>('/tipoasiento/select/', {
    cache: 'force-cache',
    next: { revalidate: 600 },
  });
}

export async function getDiarioComprobado(params: {
  empresa: string;
  tipoasiento?: string;
  fechad: string;
  fechah: string;
  autorizado?: string;
}) {
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(
    `/diariocomprobado/list/${params.empresa}/${params.tipoasiento || 'NINGUNO'}/${params.fechad}/${params.fechah}/${params.autorizado || 'TO'}`,
  );
}

export async function getMayorCuentaCab(params: {
  empresa: string;
  periodo: string;
  fechad: string;
  fechah: string;
  tipoasiento?: string;
  cuentad?: string;
  cuentah?: string;
  incluir?: string;
}) {
  return safeFetch<Array<{ data1?: Array<Record<string, unknown>>; data2?: Array<Record<string, unknown>> }>>(
    `/mayorcuenta/cab/${params.empresa}/${params.periodo}/${params.fechad}/${params.fechah}/${params.tipoasiento || 'NINGUNO'}/${params.cuentad || 'NINGUNA'}/${params.cuentah || 'NINGUNA'}/${params.incluir || 'NO'}`,
    {
      cache: 'force-cache',
      next: { revalidate: 30 },
    },
  );
}

export async function getMayorCuentaDet(params: {
  empresa: string;
  periodo: string;
  fechad: string;
  fechah: string;
  tipoasiento?: string;
  cuenta: string;
}) {
  return safeFetch<Array<{ dato1?: Array<Record<string, unknown>>; dato2?: Array<Record<string, unknown>> }>>(
    `/mayorcuenta/det/${params.empresa}/${params.periodo}/${params.fechad}/${params.fechah}/${params.tipoasiento || 'NINGUNO'}/${params.cuenta}`,
  );
}

export async function getMayorCuentaAuxCab(params: {
  empresa: string;
  periodo: string;
  fechad: string;
  fechah: string;
  tipoasiento?: string;
  cuentad?: string;
  cuentah?: string;
  incluir?: string;
  cuentaad?: string;
  cuentaah?: string;
}) {
  return safeFetch<Array<{ data1?: Array<Record<string, unknown>>; data2?: Array<Record<string, unknown>> }>>(
    `/mayorcuentaaux/cab/${params.empresa}/${params.periodo}/${params.fechad}/${params.fechah}/${params.tipoasiento || 'NINGUNO'}/${params.cuentad || 'NINGUNA'}/${params.cuentah || 'NINGUNA'}/${params.incluir || 'NO'}/${params.cuentaad || 'NINGUNA'}/${params.cuentaah || 'NINGUNA'}`,
    {
      cache: 'force-cache',
      next: { revalidate: 30 },
    },
  );
}

export async function getMayorCuentaAuxDet(params: {
  empresa: string;
  periodo: string;
  fechad: string;
  fechah: string;
  tipoasiento?: string;
  cuenta: string;
  path: string;
}) {
  return safeFetch<Array<{ dato1?: Array<Record<string, unknown>>; dato2?: Array<Record<string, unknown>> }>>(
    `/mayorcuentaaux/det/${params.empresa}/${params.periodo}/${params.fechad}/${params.fechah}/${params.tipoasiento || 'NINGUNO'}/${params.cuenta}/${params.path}`,
  );
}

export async function getCuentaSelect(params: {
  empresa: string;
  periodo: string;
}) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/cuenta/select/${params.empresa}/${params.periodo}`);
}

export async function getCuentaPlancta(params: {
  empresa: string;
  periodo: string;
}) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/cuenta/plancta/${params.empresa}/${params.periodo}`, {
    cache: 'force-cache',
    next: { revalidate: 600 },
  });
}

export async function getCuentaAuxSelect(params: {
  empresa: string;
  periodo: string;
}) {
  return safeFetch<ApiEnvelope<Array<Record<string, string>>>>(`/cuentaauxi/select/${params.empresa}/${params.periodo}`, {
    cache: 'force-cache',
    next: { revalidate: 600 },
  });
}

export async function getCuentasPagar(params: {
  empresa: string;
  periodo: string;
  compras_start: string;
  compras_end: string;
}) {
  const query = toQuery({
    empresa: params.empresa,
    periodo: params.periodo,
    compras_start: params.compras_start,
    compras_end: params.compras_end,
  });
  return safeFetch<ApiEnvelope<Array<Record<string, unknown>>>>(`/cuentas_pagar/list${query}`);
}
