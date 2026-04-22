import { ConfigAdminWorkspace } from '@/components/configuracion/config-admin-workspace';
import { PageHeader } from '@/components/ui/page-header';
import { getSessionUser } from '@/lib/auth-server';

export default async function Page() {
  const sessionUser = await getSessionUser();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Modulo administrativo"
        title="Configuracion"
        description="La navegacion ya recupera la estructura historica del menu Admin. Cada opcion responde al hash de la URL y te deja abrir el modulo real heredado mientras seguimos migrando la funcionalidad al frontend nuevo."
      />

      <ConfigAdminWorkspace currentUser={sessionUser} />
    </div>
  );
}
