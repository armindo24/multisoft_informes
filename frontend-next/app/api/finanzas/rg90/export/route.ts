import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth-server';

export const runtime = 'nodejs';

const NODE_API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion expirada.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const upstreamUrl = `${NODE_API_BASE}/finanzas/rg90/export?${searchParams.toString()}`;
    const response = await fetch(upstreamUrl, { cache: 'no-store' });
    const payload = (await response.json().catch(() => null)) as {
      data?: {
        filename?: string;
        rowCount?: number;
        content?: string;
      };
      message?: string;
    } | null;

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: payload?.message || 'No se pudo generar RG90.' },
        { status: response.status },
      );
    }

    const data = payload?.data || {};
    return NextResponse.json({
      ok: true,
      data: {
        filename: String(data.filename || ''),
        rowCount: Number(data.rowCount || 0),
        content: String(data.content || ''),
      },
    });
  } catch (error) {
    console.error('RG90 export proxy error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo generar RG90.' },
      { status: 500 },
    );
  }
}
