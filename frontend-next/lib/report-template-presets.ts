export type ReportTemplatePresetKey = 'cartera_bloques' | 'ventas_compras_bloques';

export type ReportTemplateColumnMeta = {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge';
  align?: 'left' | 'right' | 'center';
};

export type ReportTemplateBlockMeta = {
  key: string;
  label: string;
  subtitle: string;
  exportName: string;
  columns: ReportTemplateColumnMeta[];
};

export type ReportTemplatePresetMeta = {
  key: ReportTemplatePresetKey;
  label: string;
  description: string;
  scheduleReportKey: string;
  dynamicRangeLabel?: string;
  blocks: ReportTemplateBlockMeta[];
};

export const CARTERA_TEMPLATE_BLOCKS: ReportTemplateBlockMeta[] = [
  {
    key: 'summary',
    label: 'Resumen comparativo',
    subtitle: 'Cruce ejecutivo de cartera para leer rapidamente el equilibrio entre cobrar y pagar antes de entrar al detalle.',
    exportName: 'cartera-resumen-comparativo',
    columns: [
      { key: 'indicador', header: 'Indicador' },
      { key: 'cobrar', header: 'Cobrar', type: 'number', align: 'right' },
      { key: 'pagar', header: 'Pagar', type: 'number', align: 'right' },
      { key: 'neto', header: 'Neto / diferencia', type: 'number', align: 'right' },
      { key: 'lectura', header: 'Lectura gerencial' },
    ],
  },
  {
    key: 'receivables',
    label: 'Cuentas por cobrar',
    subtitle: 'Detalle consolidado de documentos pendientes a clientes dentro del rango consultado.',
    exportName: 'cartera-cuentas-cobrar',
    columns: [
      { key: 'tipo', header: 'Tipo Comprobante' },
      { key: 'comprobante', header: '# Comprobante' },
      { key: 'cuota', header: 'Cuota' },
      { key: 'cliente', header: 'Cliente' },
      { key: 'emision', header: 'Emision', type: 'date' },
      { key: 'vencimiento', header: 'Vencimiento', type: 'date' },
      { key: 'importe', header: 'Importe', type: 'currency', align: 'right' },
      { key: 'saldo', header: 'Saldo', type: 'currency', align: 'right' },
      { key: 'saldoAcumulado', header: 'Saldo acumulado', type: 'currency', align: 'right' },
    ],
  },
  {
    key: 'payables',
    label: 'Cuentas por pagar',
    subtitle: 'Detalle consolidado de saldos abiertos a proveedores dentro del mismo rango operativo.',
    exportName: 'cartera-cuentas-pagar',
    columns: [
      { key: 'proveedor', header: 'Proveedor' },
      { key: 'moneda', header: 'Moneda' },
      { key: 'saldoAnterior', header: 'Saldo anterior', type: 'currency', align: 'right' },
      { key: 'creditos', header: 'Creditos', type: 'currency', align: 'right' },
      { key: 'debitos', header: 'Debitos', type: 'currency', align: 'right' },
      { key: 'saldo', header: 'Saldo', type: 'currency', align: 'right' },
    ],
  },
];

export const VENTAS_COMPRAS_TEMPLATE_BLOCKS: ReportTemplateBlockMeta[] = [
  {
    key: 'summary',
    label: 'Resumen comparativo',
    subtitle: 'Lectura ejecutiva del equilibrio entre facturacion comercial y compras del mismo periodo.',
    exportName: 'ventas-compras-resumen-comparativo',
    columns: [
      { key: 'indicador', header: 'Indicador' },
      { key: 'ventas', header: 'Ventas', type: 'currency', align: 'right' },
      { key: 'compras', header: 'Compras', type: 'currency', align: 'right' },
      { key: 'diferencia', header: 'Diferencia', type: 'currency', align: 'right' },
      { key: 'lectura', header: 'Lectura gerencial' },
    ],
  },
  {
    key: 'sales',
    label: 'Ventas resumidas',
    subtitle: 'Comprobantes de venta del periodo con cliente, fecha y totales visibles.',
    exportName: 'ventas-compras-ventas',
    columns: [
      { key: 'grupo', header: 'Grupo' },
      { key: 'comprobante', header: 'Comprobante' },
      { key: 'cliente', header: 'Cliente' },
      { key: 'ruc', header: 'RUC' },
      { key: 'fecha', header: 'Fecha', type: 'date' },
      { key: 'iva', header: 'IVA', type: 'currency', align: 'right' },
      { key: 'gravado', header: 'Gravado', type: 'currency', align: 'right' },
      { key: 'descuento', header: 'Descuento', type: 'currency', align: 'right' },
      { key: 'total', header: 'Total', type: 'currency', align: 'right' },
    ],
  },
  {
    key: 'purchases',
    label: 'Compras del periodo',
    subtitle: 'Facturas de compra consolidadas con proveedor, sucursal y totales.',
    exportName: 'ventas-compras-compras',
    columns: [
      { key: 'fecha', header: 'Fecha', type: 'date' },
      { key: 'comprobante', header: 'Comprobante' },
      { key: 'proveedor', header: 'Proveedor' },
      { key: 'sucursal', header: 'Sucursal' },
      { key: 'gravada', header: 'Gravada', type: 'currency', align: 'right' },
      { key: 'iva', header: 'IVA', type: 'currency', align: 'right' },
      { key: 'total', header: 'Total', type: 'currency', align: 'right' },
      { key: 'estado', header: 'Estado' },
    ],
  },
];

export const REPORT_TEMPLATE_PRESETS: ReportTemplatePresetMeta[] = [
  {
    key: 'cartera_bloques',
    label: 'Cartera',
    description: 'Cruza cobrar y pagar con un resumen comparativo para seguimiento financiero.',
    scheduleReportKey: 'plantillas.cartera_bloques',
    dynamicRangeLabel: 'Rango dinamico mensual',
    blocks: CARTERA_TEMPLATE_BLOCKS,
  },
  {
    key: 'ventas_compras_bloques',
    label: 'Ventas + Compras',
    description: 'Compara la facturacion comercial contra las compras del mismo periodo en un informe unificado.',
    scheduleReportKey: 'plantillas.ventas_compras_bloques',
    dynamicRangeLabel: 'Rango dinamico mensual',
    blocks: VENTAS_COMPRAS_TEMPLATE_BLOCKS,
  },
];

export function getReportTemplatePreset(key: string) {
  return REPORT_TEMPLATE_PRESETS.find((preset) => preset.key === key);
}

export function getReportTemplateBlocks(templateKey: string) {
  return getReportTemplatePreset(templateKey)?.blocks || CARTERA_TEMPLATE_BLOCKS;
}

export function getReportTemplateBlock(templateKey: string, blockKey: string) {
  return getReportTemplateBlocks(templateKey).find((block) => block.key === blockKey);
}

export function buildDefaultTemplateBlocks(templateKey: string) {
  return getReportTemplateBlocks(templateKey).map((block) => ({
    key: block.key,
    columns: block.columns.map((column) => column.key),
  }));
}

export function getCarteraTemplateBlock(blockKey: string) {
  return getReportTemplateBlock('cartera_bloques', blockKey);
}

export function buildDefaultCarteraTemplateBlocks() {
  return buildDefaultTemplateBlocks('cartera_bloques');
}

export function getVentasComprasTemplateBlock(blockKey: string) {
  return getReportTemplateBlock('ventas_compras_bloques', blockKey);
}

export function buildDefaultVentasComprasTemplateBlocks() {
  return buildDefaultTemplateBlocks('ventas_compras_bloques');
}
