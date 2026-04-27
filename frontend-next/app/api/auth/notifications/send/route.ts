import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { sendDirectUserNotification } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion no valida.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const result = await sendDirectUserNotification({
      actorUserId: sessionUser.id,
      targetUserId: Number(body.targetUserId || 0),
      title: String(body.title || ''),
      message: String(body.message || ''),
      href: String(body.href || ''),
      sendEmail: Boolean(body.sendEmail),
    });

    const successMessage = result.emailSent
      ? 'Aviso enviado por bandeja y correo.'
      : result.emailWarning
        ? `Aviso enviado por bandeja. Correo omitido: ${result.emailWarning}`
        : 'Aviso enviado correctamente.';

    return NextResponse.json({
      ok: true,
      message: successMessage,
      data: {
        emailSent: result.emailSent,
        emailWarning: result.emailWarning,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo enviar el aviso.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
