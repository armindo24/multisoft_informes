import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const upstream = new URL(`${API_BASE}/registraciones/diferencia-cambio/consultar`);

    for (const [key, value] of searchParams.entries()) {
      upstream.searchParams.set(key, value);
    }

    const response = await fetch(upstream.toString(), { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: payload?.message || 'No se pudo consultar diferencia de cambio.' },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, data: payload?.data || { rows: [] } });
  } catch (error) {
    console.error('Diferencia cambio proxy error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo consultar diferencia de cambio.' }, { status: 500 });
  }
}
