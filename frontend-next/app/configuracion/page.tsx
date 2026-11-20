import { ConfigAdminWorkspace } from '@/components/configuracion/config-admin-workspace';
import { getSessionUser } from '@/lib/auth-server';

export default async function Page() {
  const sessionUser = await getSessionUser();

  return (
    <div>
      <ConfigAdminWorkspace currentUser={sessionUser} />
    </div>
  );
}
