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
      <article id={activeItem.id} className="card scroll-mt-28 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700">
              <ActiveIcon className="h-4 w-4" />
            </span>
            <div>
              <h1 className="flex flex-wrap items-center gap-x-2 text-base font-semibold text-slate-900">
                <span className="font-normal text-slate-500">Migraciones</span>
                <span aria-hidden="true" className="font-normal text-slate-300">/</span>
                {activeItem.title.replace('Migracion de ', '')}
              </h1>
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
