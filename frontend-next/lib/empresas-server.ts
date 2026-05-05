import 'server-only';

import { getEmpresasByUser } from '@/lib/api';
import { loadBrandingConfigs, loadUserCompanyAssignments } from '@/lib/admin-config';
import { getSessionUser } from '@/lib/auth-server';

type EmpresaEnvelope = {
  data: Array<Record<string, string>>;
} | null;

export function getEmpresaCode(item: Record<string, string>) {
  return String(
    item.cod_empresa ||
      item.Cod_Empresa ||
      item.codigo ||
      item.Codigo ||
      item.id ||
      item.value ||
      '',
  ).trim().toUpperCase();
}

function orderEmpresasByAssignments(
  empresas: Array<Record<string, string>>,
  assignments: Awaited<ReturnType<typeof loadUserCompanyAssignments>>,
  base: 'Integrado' | 'Sueldo',
) {
  const assignedCodes = Array.from(new Set(
    assignments
      .filter((item) => item.db === base)
      .map((item) => String(item.empresa || '').trim().toUpperCase())
      .filter(Boolean),
  ));

  if (!assignedCodes.length || !empresas.length) return empresas;

  const byCode = new Map<string, Record<string, string>>();
  for (const item of empresas) {
    const code = getEmpresaCode(item);
    if (code && !byCode.has(code)) {
      byCode.set(code, item);
    }
  }

  const orderedCodes = new Set<string>();
  const ordered = assignedCodes
    .map((code) => {
      const item = byCode.get(code);
      if (item) orderedCodes.add(code);
      return item;
    })
    .filter(Boolean) as Array<Record<string, string>>;

  const remaining = empresas.filter((item) => !orderedCodes.has(getEmpresaCode(item)));
  return [...ordered, ...remaining];
}

export async function getScopedEmpresas(base: 'Integrado' | 'Sueldo' = 'Integrado'): Promise<EmpresaEnvelope> {
  const sessionUser = await getSessionUser();

  if (!sessionUser?.id) {
    return { data: [] };
  }

  const [response, assignments] = await Promise.all([
    getEmpresasByUser(sessionUser.id, base),
    loadUserCompanyAssignments(sessionUser.id).catch(() => []),
  ]);

  if (Array.isArray(response?.data)) {
    return {
      ...response,
      data: orderEmpresasByAssignments(response.data, assignments, base),
    };
  }

  return { data: [] };
}

export async function getPrimaryScopedEmpresa(base: 'Integrado' | 'Sueldo' = 'Integrado') {
  const sessionUser = await getSessionUser();
  if (sessionUser?.id) {
    const assignments = await loadUserCompanyAssignments(sessionUser.id).catch(() => []);
    const baseAssignments = assignments.filter((item) => item.db === base && String(item.empresa || '').trim());
    const brandedCompanies = await loadBrandingConfigs()
      .then((items) => new Set(items.filter((item) => item.logoUrl).map((item) => item.empresa)))
      .catch(() => new Set<string>());

    const firstAssigned = baseAssignments.find((item) => brandedCompanies.has(String(item.empresa || '').trim().toUpperCase()))
      || baseAssignments[0];
    const assignedEmpresa = firstAssigned ? String(firstAssigned.empresa || '').trim().toUpperCase() : '';
    if (assignedEmpresa) return assignedEmpresa;
  }

  const response = await getScopedEmpresas(base);
  const first = response?.data?.[0];
  const empresa = first ? getEmpresaCode(first) : '';
  return empresa || null;
}
