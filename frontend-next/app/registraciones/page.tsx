import { PageHeader } from '@/components/ui/page-header';
import { DiferenciaCambioPanel } from '@/components/registraciones/diferencia-cambio-panel';
import { getSessionUser } from '@/lib/auth-server';
import { getCuentaAuxSelect, getCuentaPlancta, getTipoAsientoOptions } from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';
import type { AccountPlanOption, AuxiliarOption, SelectOption } from '@/types/finanzas';
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

function normalizeCuentaPlanOption(item: Record<string, string>): AccountPlanOption {
  const value = String(item.CodPlanCta || item.codplancta || item.codigo || item.value || '').trim();
  const nivel = String(item.nivel || item.Nivel || '').trim();
  const name = String(item.Nombre || item.nombre || item.descripcion || '').trim() || value;
  return {
    value,
    label: value && name ? `${value} - ${name}` : value,
    name,
    imputable: String(item.imputable || item.Imputable || '').trim(),
    auxiliar: String(item.auxiliar || item.Auxiliar || '').trim(),
    moneda: String(item.codmoneda || item.CodMoneda || '').trim(),
    nivel,
  };
}

function sanitizeCuentaPlanOptions(items: Array<Record<string, string>> | undefined | null): AccountPlanOption[] {
  const seen = new Set<string>();
  const result: AccountPlanOption[] = [];

  for (const item of items || []) {
    const option = normalizeCuentaPlanOption(item);
    if (!option.value || seen.has(option.value)) continue;
    seen.add(option.value);
    result.push(option);
  }

  return result;
}

function normalizeAuxiliarOption(item: Record<string, string>): AuxiliarOption {
  const rawValue = item.CodPlanAux || item.codplanaux || item.codigo || item.value || '';
  const accountCode = String(rawValue).includes('-') ? String(rawValue).split('-').slice(1).join('-').trim() : String(item.CodPlanCta || item.codplancta || '');
  const auxCode = String(rawValue).includes('-') ? String(rawValue).split('-')[0].trim() : String(rawValue || '').trim();
  const rawLabel = item.Nombre || item.nombre || item.descripcion || item.label || auxCode;
  const cleaned = String(rawLabel || '').replace(/^.+?\s*-\s*/, '').trim();
  return {
    value: auxCode,
    label: cleaned ? `${auxCode} - ${cleaned}` : auxCode,
    auxCode,
    accountCode,
    name: cleaned || auxCode,
  };
}

function sanitizeAuxiliarOptions(items: Array<Record<string, string>> | undefined | null): AuxiliarOption[] {
  const seen = new Set<string>();
  const result: AuxiliarOption[] = [];

  for (const item of items || []) {
    const option = normalizeAuxiliarOption(item);
    const key = `${option.auxCode}:${option.accountCode}`;
    if (!option.value || seen.has(key)) continue;
    seen.add(key);
    result.push(option);
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
  const isDiferenciaCambio = selectedSection === 'diferencia-cambio';
  const [empresasResponse, tipoAsientosResponse] = await Promise.all([
    getScopedEmpresas('Integrado'),
    getTipoAsientoOptions(),
  ]);
  const empresas = sanitizeOptions((empresasResponse?.data || []) as Array<Record<string, string>>);
  const tipoAsientos = sanitizeOptions((tipoAsientosResponse?.data || []) as Array<Record<string, string>>);
  const currentYear = String(new Date().getFullYear());
  const defaultEmpresa = empresas[0]?.value || '';
  const [cuentaOptionsResponse, auxiliarOptionsResponse] = isDiferenciaCambio && defaultEmpresa
    ? await Promise.all([
        getCuentaPlancta({ empresa: defaultEmpresa, periodo: currentYear }),
        getCuentaAuxSelect({ empresa: defaultEmpresa, periodo: currentYear }),
      ])
    : [null, null];
  const accountOptions = sanitizeCuentaPlanOptions((cuentaOptionsResponse?.data || []) as Array<Record<string, string>>);
  const auxOptions = sanitizeAuxiliarOptions((auxiliarOptionsResponse?.data || []) as Array<Record<string, string>>);

  if (isDiferenciaCambio) {
    return (
      <div className="space-y-3">
        <DiferenciaCambioPanel
          empresas={empresas}
          tipoAsientos={tipoAsientos}
          accountOptions={accountOptions}
          auxOptions={auxOptions}
          defaultEmpresa={defaultEmpresa}
          defaultPeriodo={currentYear}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operaciones"
        title="Registraciones"
        description="Accesos de carga para ventas, compras y movimientos financieros operativos."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <a
            key={action.id}
            id={action.id}
            href={`/registraciones?section=${action.id}#${action.id}`}
            className="card scroll-mt-28 p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700">{action.area}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
          </a>
        ))}
      </section>
    </div>
  );
}
