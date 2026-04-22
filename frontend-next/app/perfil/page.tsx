import { redirect } from 'next/navigation';
import { ProfilePanel } from '@/components/auth/profile-panel';
import { PageHeader } from '@/components/ui/page-header';
import { getSessionUser } from '@/lib/auth-server';
import { loadGroupsForAdmin, loadUserCompanyAssignments, loadUserDetailedById } from '@/lib/admin-config';

export default async function PerfilPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser?.id) {
    redirect('/login');
  }

  const [user, allGroups, assignments] = await Promise.all([
    loadUserDetailedById(sessionUser.id),
    loadGroupsForAdmin(),
    loadUserCompanyAssignments(sessionUser.id),
  ]);

  if (!user) {
    redirect('/dashboard');
  }

  const groups = allGroups
    .filter((group) => user.groups.includes(group.id))
    .map((group) => group.name);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta personal"
        title="Mi perfil"
        description="Vista personal para revisar tus accesos actuales, empresas habilitadas y mantener actualizados tus datos sin entrar al panel general de administracion."
      />

      <ProfilePanel initialUser={user} initialGroups={groups} initialAssignments={assignments} />
    </div>
  );
}
