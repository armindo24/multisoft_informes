import 'server-only';

import { cache } from 'react';
import { validateNextSession } from '@/lib/pg-auth';
import { cookies } from 'next/headers';

import { AUTH_COOKIE, SessionUser } from '@/lib/auth';

type StoredSessionUser = SessionUser & {
  isSuperuser?: boolean;
  groups?: string[];
  sessionKey?: string;
};

export const getSessionUser = cache(async (): Promise<StoredSessionUser | null> => {
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
    const sessionKey = String(parsed.sessionKey || '').trim();
    if (!sessionKey || !Number.isInteger(numericId) || numericId <= 0 || !await validateNextSession(sessionKey, numericId)) return null;

    return {
      id: Number.isFinite(numericId) && numericId > 0 ? numericId : undefined,
      username: String(parsed.username || '').trim(),
      role: String(parsed.role || '').trim(),
      displayName: String(parsed.displayName || parsed.username || '').trim(),
      isSuperuser: Boolean(parsed.isSuperuser),
      groups: Array.isArray(parsed.groups)
        ? parsed.groups.map((item) => String(item || '').trim()).filter(Boolean)
        : [],
      sessionKey: String(parsed.sessionKey || '').trim() || undefined,
    };
  } catch {
    return null;
  }
});
