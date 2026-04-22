import { NextResponse } from 'next/server';
import { loadEmailConfig, saveEmailConfig } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const config = await loadEmailConfig();
    return NextResponse.json({ ok: true, data: config });
  } catch (error) {
    console.error('Email config load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar la configuracion de email.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const saved = await saveEmailConfig({
      action: String(body.action || 'save') as 'save' | 'test',
      testEmail: String(body.testEmail || ''),
      enabled: Boolean(body.enabled),
      host: String(body.host || ''),
      port: Number(body.port || 25),
      fromName: String(body.fromName || ''),
      fromEmail: String(body.fromEmail || ''),
      replyToName: String(body.replyToName || ''),
      replyToEmail: String(body.replyToEmail || ''),
      envelopeFrom: String(body.envelopeFrom || ''),
      useSsl: Boolean(body.useSsl),
      useTls: Boolean(body.useTls),
      useAuth: Boolean(body.useAuth),
      username: String(body.username || ''),
      password: String(body.password || ''),
      updatedAt: null,
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error('Email config save error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo guardar la configuracion de email.' },
      { status: 400 },
    );
  }
}
