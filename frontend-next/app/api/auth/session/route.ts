import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { cleanupAbandonedNextSessions } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST() {
  const user = await getSessionUser();
  if (!user?.id) return NextResponse.json({ ok: false }, { status: 401 });
  await cleanupAbandonedNextSessions();
  return NextResponse.json({ ok: true });
}
