export type ReportTemplateColumnMeta = {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge';
  align?: 'left' | 'right' | 'center';
};

export type ReportTemplateBlockMeta = {
  key: 'summary' | 'receivables' | 'payables';
  label: string;
  subtitle: string;
  exportName: string;
  columns: ReportTemplateColumnMeta[];
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

export function getCarteraTemplateBlock(blockKey: string) {
  return CARTERA_TEMPLATE_BLOCKS.find((block) => block.key === blockKey);
}

export function buildDefaultCarteraTemplateBlocks() {
  return CARTERA_TEMPLATE_BLOCKS.map((block) => ({
    key: block.key,
    columns: block.columns.map((column) => column.key),
  }));
}
