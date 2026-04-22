import type { ChartPoint, KPI, ModuleSummary } from '@/types/dashboard';

export const executiveKpis: KPI[] = [
  { title: 'Ventas del mes', value: 'Gs. 845.000.000', change: '+12,4%', trend: 'up' },
  { title: 'Compras del mes', value: 'Gs. 512.000.000', change: '+6,8%', trend: 'up' },
  { title: 'Stock valorizado', value: 'Gs. 1.240.000.000', change: '-2,1%', trend: 'down' },
  { title: 'Margen estimado', value: '39,4%', change: '+1,9 pp', trend: 'up' },
];

export const revenueVsExpense: ChartPoint[] = [
  { name: 'Ene', value: 320 },
  { name: 'Feb', value: 410 },
  { name: 'Mar', value: 385 },
  { name: 'Abr', value: 460 },
  { name: 'May', value: 520 },
  { name: 'Jun', value: 610 },
];

export const moduleSummaries: ModuleSummary[] = [
  {
    id: 'finanzas',
    title: 'Finanzas',
    description: 'Balances, flujo de fondos, extractos y análisis contable.',
    href: '/finanzas',
    metrics: [
      { label: 'Flujo neto', value: 'Gs. 92.000.000' },
      { label: 'Ctas. por pagar', value: 'Gs. 210.000.000' },
    ],
  },
  {
    id: 'ventas',
    title: 'Ventas',
    description: 'Resumen comercial, cobranzas, recaudaciones y estadísticas.',
    href: '/ventas',
    metrics: [
      { label: 'Facturación', value: 'Gs. 845.000.000' },
      { label: 'Top cliente', value: 'Farmacenter' },
    ],
  },
  {
    id: 'compras',
    title: 'Compras',
    description: 'Órdenes de compra, análisis de proveedores y gastos.',
    href: '/compras',
    metrics: [
      { label: 'Órdenes activas', value: '28' },
      { label: 'Proveedor líder', value: 'Distribuidora Sur' },
    ],
  },
  {
    id: 'stock',
    title: 'Stock',
    description: 'Existencias, valorizado, fichas y costos por artículo.',
    href: '/stock',
    metrics: [
      { label: 'Artículos críticos', value: '17' },
      { label: 'Depósitos auditados', value: '4' },
    ],
  },
];
