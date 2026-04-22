import { MigrationsWorkspace } from '@/components/migraciones/migrations-workspace';
import { PageHeader } from '@/components/ui/page-header';
import { getSessionUser } from '@/lib/auth-server';
import { getScopedEmpresas } from '@/lib/empresas-server';

function normalizeEmpresaOption(item: Record<string, string>) {
  const value = String(item.Cod_Empresa || item.cod_empresa || '').trim();
  const label = String(item.Des_Empresa || item.des_empresa || value).trim();

  return {
    value,
    label: value && label && value !== label ? `${value} - ${label}` : label || value,
  };
}

export default async function Page() {
  const [sessionUser, empresasResponse] = await Promise.all([getSessionUser(), getScopedEmpresas()]);
  const empresas = (empresasResponse?.data || [])
    .map(normalizeEmpresaOption)
    .filter((item) => item.value && item.label);
  const defaultPeriodo = String(new Date().getFullYear());

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Modulo operativo"
        title="Migraciones"
        description="El menu de migraciones ahora tambien entra por el frontend de Next.js. Desde aqui puedes elegir Asientos, Ventas o Compras y abrir el proceso heredado correspondiente."
      />

      <MigrationsWorkspace
        empresas={empresas}
        defaultPeriodo={defaultPeriodo}
        username={sessionUser?.username || ''}
        userId={sessionUser?.id}
      />
    </div>
  );
}
