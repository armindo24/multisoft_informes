import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const response = await fetch(`${API_BASE}/registraciones/diferencia-cambio/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: payload?.message || payload?.error || 'No se pudo grabar el asiento.' },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, data: payload?.data || payload });
  } catch (error) {
    console.error('Diferencia cambio guardar proxy error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo grabar el asiento.' }, { status: 500 });
  }
}
