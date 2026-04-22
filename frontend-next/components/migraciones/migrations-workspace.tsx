'use client';

import { FileSpreadsheet, ReceiptText, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AsientosMigrationPanel } from '@/components/migraciones/asientos-migration-panel';
import { VentasMigrationPanel } from '@/components/migraciones/ventas-migration-panel';

type MigrationItem = {
  id: string;
  title: string;
  description: string;
  icon: typeof FileSpreadsheet;
};

const migrationItems: MigrationItem[] = [
  {
    id: 'asientos',
    title: 'Migracion de Asientos',
    description:
      'Acceso al proceso historico para importar y revisar asientos contables desde las estructuras heredadas.',
    icon: FileSpreadsheet,
  },
  {
    id: 'ventas',
    title: 'Migracion de Ventas',
    description:
      'Entrada al flujo anterior para preparar, validar y ejecutar la migracion de comprobantes y movimientos de ventas.',
    icon: ReceiptText,
  },
  {
    id: 'compras',
    title: 'Migracion de Compras',
    description:
      'Modulo legado para carga de compras y documentos asociados, manteniendo la logica operativa ya conocida.',
    icon: ShoppingCart,
  },
];

function normalizeHash(hash: string) {
  return hash.replace(/^#/, '').trim().toLowerCase();
}

function resolveActiveId(hash: string) {
  const normalized = normalizeHash(hash);
  if (!normalized) return migrationItems[0].id;

  return migrationItems.find((item) => item.id === normalized)?.id || migrationItems[0].id;
}

export function MigrationsWorkspace({
  empresas,
  defaultPeriodo,
  username,
  userId,
}: {
  empresas: Array<{ value: string; label: string }>;
  defaultPeriodo: string;
  username: string;
  userId?: number;
}) {
  const [activeId, setActiveId] = useState(migrationItems[0].id);

  useEffect(() => {
    function syncFromHash() {
      setActiveId(resolveActiveId(window.location.hash));
    }

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const activeItem = migrationItems.find((item) => item.id === activeId) || migrationItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <section>
      <article id={activeItem.id} className="card scroll-mt-28 p-6 shadow-[0_0_0_1px_rgba(8,145,178,0.12)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700">
              <ActiveIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Proceso heredado</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{activeItem.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{activeItem.description}</p>
            </div>
          </div>
        </div>

        {activeItem.id === 'asientos' ? (
          <AsientosMigrationPanel
            empresas={empresas}
            defaultPeriodo={defaultPeriodo}
            username={username}
            userId={userId}
          />
        ) : null}

        {activeItem.id === 'ventas' ? (
          <VentasMigrationPanel empresas={empresas} defaultPeriodo={defaultPeriodo} username={username} />
        ) : null}
      </article>
    </section>
  );
}
