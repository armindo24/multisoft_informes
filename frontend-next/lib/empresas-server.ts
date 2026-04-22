import 'server-only';

import { getEmpresasByUser } from '@/lib/api';
import { getSessionUser } from '@/lib/auth-server';

type EmpresaEnvelope = {
  data: Array<Record<string, string>>;
} | null;

export async function getScopedEmpresas(base: 'Integrado' | 'Sueldo' = 'Integrado'): Promise<EmpresaEnvelope> {
  const sessionUser = await getSessionUser();

  if (!sessionUser?.id) {
    return { data: [] };
  }

  const response = await getEmpresasByUser(sessionUser.id, base);

  if (Array.isArray(response?.data)) {
    return response;
  }

  return { data: [] };
}
