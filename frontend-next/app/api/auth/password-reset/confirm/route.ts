import { NextResponse } from 'next/server';

import { consumePasswordResetToken } from '@/lib/password-reset';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token || '').trim();
  const password = String(body?.password || '');

  try {
    await consumePasswordResetToken(token, password);
    return NextResponse.json({
      ok: true,
      message: 'La contraseña se actualizó correctamente.',
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.' },
      { status: 400 },
    );
  }
}
