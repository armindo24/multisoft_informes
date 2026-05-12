import { PageHeader } from '@/components/ui/page-header';
import { DiferenciaCambioPanel } from '@/components/registraciones/diferencia-cambio-panel';
import { getSessionUser } from '@/lib/auth-server';
import { getTipoAsientoOptions } from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';
import type { SelectOption } from '@/types/finanzas';
import { redirect } from 'next/navigation';

const actions = [
  {
    id: 'cargar-venta',
    area: 'Ventas',
    title: 'Cargar venta',
    description: 'Registro operativo de comprobantes de venta.',
  },
  {
    id: 'cargar-compra',
    area: 'Compras',
    title: 'Cargar compra',
    description: 'Registro operativo de comprobantes de compra.',
  },
  {
    id: 'cargar-asiento',
    area: 'Finanzas',
    title: 'Cargar asiento',
    description: 'Carga de asientos contables manuales.',
  },
  {
    id: 'diferencia-cambio',
    area: 'Finanzas',
    title: 'Asientos de Diferencia de Cambio',
    description: 'Generacion y control de asientos por diferencia cambiaria.',
  },
];

function normalizeOption(item: Record<string, string>): SelectOption {
  const value = item.cod_empresa || item.Cod_Empresa || item.codigo || item.Codigo || item.TipoAsiento || item.tipoasiento || item.value || '';
  const label = item.des_empresa || item.Des_Empresa || item.Descrip || item.descrip || item.descripcion || item.Descripcion || item.label || value;
  return { value, label: value && label && value !== label ? `${value} - ${label}` : label || value };
}

function sanitizeOptions(items: Array<Record<string, string>> | undefined | null): SelectOption[] {
  const seen = new Set<string>();
  const result: SelectOption[] = [];

  for (const item of items || []) {
    const option = normalizeOption(item);
    const value = String(option.value || '').trim();
    const label = String(option.label || '').trim();

    if (!value || !label || seen.has(value)) continue;
    seen.add(value);
    result.push({ value, label });
  }

  return result;
}

export default async function RegistracionesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sessionUser = await getSessionUser();
  const groups = new Set((sessionUser?.groups || []).map((item) => String(item || '').trim().toLowerCase()));
  const canAccess = Boolean(sessionUser?.isSuperuser) || groups.has('registraciones');

  if (!canAccess) {
    redirect('/dashboard');
  }

  const params = (await searchParams) || {};
  const selectedSection = String(params.section || '');
  const [empresasResponse, tipoAsientosResponse] = await Promise.all([
    getScopedEmpresas('Integrado'),
    getTipoAsientoOptions(),
  ]);
  const empresas = sanitizeOptions((empresasResponse?.data || []) as Array<Record<string, string>>);
  const tipoAsientos = sanitizeOptions((tipoAsientosResponse?.data || []) as Array<Record<string, string>>);
  const currentYear = String(new Date().getFullYear());
  const defaultEmpresa = empresas[0]?.value || '';

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operaciones"
        title="Registraciones"
        description="Accesos de carga para ventas, compras y movimientos financieros operativos."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const active = selectedSection === action.id;

          return (
            <a
              key={action.id}
              id={action.id}
              href={`/registraciones?section=${action.id}#${action.id}`}
              className={[
                'card scroll-mt-28 p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md',
                active ? 'border-cyan-300 bg-cyan-50/70' : '',
              ].join(' ')}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700">{action.area}</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
            </a>
          );
        })}
      </section>

      {selectedSection === 'diferencia-cambio' ? (
        <DiferenciaCambioPanel
          empresas={empresas}
          tipoAsientos={tipoAsientos}
          defaultEmpresa={defaultEmpresa}
          defaultPeriodo={currentYear}
        />
      ) : null}
    </div>
  );
}
