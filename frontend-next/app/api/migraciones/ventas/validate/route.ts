import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DJANGO_BASE = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://127.0.0.1:8000';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const response = await fetch(`${DJANGO_BASE}/api/next/migraciones/ventas/validate/`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({ ok: false, message: 'Respuesta invalida del servidor.' }));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo validar el Excel.' },
      { status: 500 },
    );
  }
}
