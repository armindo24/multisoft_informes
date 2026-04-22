import 'server-only';

import { cookies } from 'next/headers';

import { AUTH_COOKIE, SessionUser } from '@/lib/auth';

type StoredSessionUser = SessionUser & {
  isSuperuser?: boolean;
  groups?: string[];
};

export async function getSessionUser(): Promise<StoredSessionUser | null> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(AUTH_COOKIE)?.value;

  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<StoredSessionUser> | null;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const numericId = Number(parsed.id);

    return {
      id: Number.isFinite(numericId) && numericId > 0 ? numericId : undefined,
      username: String(parsed.username || '').trim(),
      role: String(parsed.role || '').trim(),
      displayName: String(parsed.displayName || parsed.username || '').trim(),
      isSuperuser: Boolean(parsed.isSuperuser),
      groups: Array.isArray(parsed.groups)
        ? parsed.groups.map((item) => String(item || '').trim()).filter(Boolean)
        : [],
    };
  } catch {
    return null;
  }
}
