import { NextResponse } from 'next/server';

import { requestPasswordReset } from '@/lib/password-reset';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const identity = String(body?.identity || '').trim();

  if (!identity) {
    return NextResponse.json(
      { ok: false, message: 'Ingresa tu usuario o email para continuar.' },
      { status: 400 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    await requestPasswordReset(identity, origin);

    return NextResponse.json({
      ok: true,
      message: 'Si el usuario existe y tiene un email configurado, enviamos un enlace de recuperación.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo enviar el correo de recuperación.' },
      { status: 500 },
    );
  }
}
