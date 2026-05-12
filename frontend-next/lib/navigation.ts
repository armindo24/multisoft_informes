import type { Route } from 'next';
import type { ComponentType } from 'react';
import { BarChart3, Boxes, ClipboardPenLine, CreditCard, FileStack, HandCoins, LayoutDashboard, RefreshCw, Settings, ShoppingCart } from 'lucide-react';

export type NavigationSubItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

export type NavigationSection = {
  label: string;
  items: NavigationSubItem[];
};

export type NavigationItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  sections?: NavigationSection[];
};

export const navigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cartera', href: '/cartera', icon: HandCoins },
  { label: 'Plantillas', href: '/informes-personalizados', icon: FileStack },
  {
    label: 'Finanzas',
    href: '/finanzas',
    icon: CreditCard,
    sections: [
      {
        label: 'Balances',
        items: [
          { label: 'Balance General', href: '/finanzas?section=balance-general#balance-general' },
          { label: 'Balance Integral', href: '/finanzas?section=balance-integral#balance-integral' },
          { label: 'Balance General PUC', href: '/finanzas?section=balance-general-puc#balance-general-puc' },
          { label: 'Balance General Comprobado', href: '/finanzas?section=balance-general-comprobado#balance-general-comprobado' },
        ],
      },
      {
        label: 'Libros',
        items: [
          { label: 'Libro Mayor de Cuenta', href: '/finanzas?section=mayor-cuenta#mayor-cuenta' },
          { label: 'Libro Mayor de Auxiliares', href: '/finanzas?section=mayor-cuenta-aux#mayor-cuenta-aux' },
          { label: 'Libro Diario', href: '/finanzas?section=libro-diario#libro-diario' },
          { label: 'RG90', href: '/finanzas?section=rg90#rg90' },
        ],
      },
      {
        label: 'Pagos',
        items: [
          { label: 'Ordenes de Pago', href: '/finanzas?section=cuentas-pagar#cuentas-pagar' },
          { label: 'Dashboard Financiero', href: '/finanzas?section=resumen-financiero#resumen-financiero' },
        ],
      },
      {
        label: 'Otros',
        items: [
          { label: 'Centro de Costos', href: '/finanzas?section=resumen-financiero#resumen-financiero', disabled: true },
          { label: 'Extracto de Cuenta Bancaria', href: '/finanzas?section=cuentas-pagar#cuentas-pagar', disabled: true },
          { label: 'Flujo de Fondo', href: '/finanzas?section=flujo-fondo#flujo-fondo' },
          { label: 'Bien Activo', href: '/finanzas?section=balance-general#balance-general', disabled: true },
        ],
      },
    ],
  },
  {
    label: 'Ventas',
    href: '/ventas',
    icon: BarChart3,
    sections: [
      {
        label: 'Ventas',
        items: [
          { label: 'Ventas - Resumido y Detallado', href: '/ventas#ventas-resumen' },
          { label: 'Presupuestos', href: '/ventas#ventas-resumen', disabled: true },
          { label: 'Cuentas por Cobrar a Clientes', href: '/ventas?section=cuentas-cobrar#cuentas-cobrar' },
          { label: 'Planillas de Recaudaciones', href: '/ventas#cuentas-cobrar', disabled: true },
          { label: 'Estadisticas de Ventas', href: '/ventas?agrupacion=clientes#estadisticas-ventas' },
        ],
      },
    ],
  },
  {
    label: 'Compras',
    href: '/compras',
    icon: ShoppingCart,
    sections: [
      {
        label: '',
        items: [
          { label: 'Orden de Compra', href: '/compras?section=orden-compra#orden-compra' },
          { label: 'Compras - Resumido y Detallado', href: '/compras?section=compras-resumen#compras-resumen' },
          { label: 'Compras por Articulos', href: '/compras?section=compras-articulo#compras-articulo' },
          { label: 'Cuentas por Pagar', href: '/compras?section=cuentas-pagar#cuentas-pagar' },
          { label: 'Fondo Fijo', href: '/compras?section=fondo-fijo#fondo-fijo' },
          { label: 'Gastos por Rendir', href: '/compras?section=gastos-rendir#gastos-rendir' },
          { label: 'Estadisticas de Compras', href: '/compras?section=estadisticas-compras#estadisticas-compras' },
        ],
      },
    ],
  },
  {
    label: 'Stock',
    href: '/stock',
    icon: Boxes,
    sections: [
      {
        label: 'Inventario',
        items: [
          { label: 'Existencias', href: '/stock', disabled: true },
          { label: 'Valorizado', href: '/stock', disabled: true },
          { label: 'Costo por Articulo', href: '/stock', disabled: true },
          { label: 'Costo Articulo Full', href: '/stock?section=costo-articulo-full#costo-articulo-full' },
        ],
      },
    ],
  },
  {
    label: 'Registraciones',
    href: '/registraciones',
    icon: ClipboardPenLine,
    sections: [
      {
        label: 'Registraciones',
        items: [
          { label: 'Ventas - Cargar venta', href: '/registraciones?section=cargar-venta#cargar-venta' },
          { label: 'Compras - Cargar compra', href: '/registraciones?section=cargar-compra#cargar-compra' },
          { label: 'Finanzas - Cargar asiento', href: '/registraciones?section=cargar-asiento#cargar-asiento' },
          { label: 'Finanzas - Asientos de Diferencia de Cambio', href: '/registraciones?section=diferencia-cambio#diferencia-cambio' },
        ],
      },
    ],
  },
  {
    label: 'Migraciones',
    href: '/migraciones',
    icon: RefreshCw,
    sections: [
      {
        label: 'Migraciones',
        items: [
          { label: 'Asientos', href: '/migraciones#asientos' },
          { label: 'Ventas', href: '/migraciones#ventas' },
          { label: 'Compras', href: '/migraciones#compras' },
        ],
      },
    ],
  },
  {
    label: 'Configuracion',
    href: '/configuracion',
    icon: Settings,
    sections: [
      {
        label: 'Admin',
        items: [
          { label: 'Usuarios', href: '/configuracion#usuarios' },
          { label: 'Grupos', href: '/configuracion#grupos' },
          { label: 'Asignacion de Empresas', href: '/configuracion#asignacion-empresas' },
          { label: 'Usuarios Conectados', href: '/configuracion#usuarios-conectados' },
          { label: 'Configuracion de Base de Datos', href: '/configuracion#configuracion-base-datos' },
          { label: 'Marca Corporativa', href: '/configuracion#marca-corporativa' },
          { label: 'Configuracion de Email', href: '/configuracion#configuracion-email' },
        ],
      },
    ],
  },
];
