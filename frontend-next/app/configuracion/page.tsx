import { ConfigAdminWorkspace } from '@/components/configuracion/config-admin-workspace';
import { PageHeader } from '@/components/ui/page-header';
import { getSessionUser } from '@/lib/auth-server';

export default async function Page() {
  const sessionUser = await getSessionUser();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Administracion"
        title="Configuracion"
        description="Administra usuarios, grupos, empresas habilitadas, conexiones y parametros de notificacion del sistema."
      />

      <ConfigAdminWorkspace currentUser={sessionUser} />
    </div>
  );
}
