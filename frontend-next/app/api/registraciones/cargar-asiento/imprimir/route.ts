import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';

function readableError(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const data = value as Record<string, unknown>;
    return readableError(data.message) || readableError(data.error) || readableError(data.data) || JSON.stringify(value);
  }
  return String(value);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const upstream = new URL(`${API_BASE}/registraciones/cargar-asiento/imprimir`);

    for (const [key, value] of searchParams.entries()) {
      upstream.searchParams.set(key, value);
    }

    const response = await fetch(upstream.toString(), { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: readableError(payload?.message) || readableError(payload?.error) || readableError(payload?.data?.message) || readableError(payload?.data?.error) || readableError(payload?.data) || 'No se pudo preparar la impresion del asiento.' },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, data: payload?.data || payload });
  } catch (error) {
    console.error('Cargar asiento imprimir proxy error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo preparar la impresion del asiento.' }, { status: 500 });
  }
}
