import { NextResponse } from 'next/server';
import { loadGroupsDetailed, saveAdminGroup } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const groups = await loadGroupsDetailed();
    return NextResponse.json({ ok: true, data: { groups } });
  } catch (error) {
    console.error('Groups config load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar grupos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const saved = await saveAdminGroup({
      id: body.id ? Number(body.id) : undefined,
      name: String(body.name || ''),
    });

    const groups = await loadGroupsDetailed();
    return NextResponse.json({ ok: true, data: { saved, groups } });
  } catch (error) {
    console.error('Groups config save error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo guardar el grupo.' },
      { status: 400 },
    );
  }
}
