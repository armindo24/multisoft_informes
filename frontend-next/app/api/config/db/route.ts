import { NextResponse } from 'next/server';
import { loadDbConfigs, saveDbConfig } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const configs = await loadDbConfigs();
    return NextResponse.json({ ok: true, data: configs });
  } catch (error) {
    console.error('DB config load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar la configuracion de base de datos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const saved = await saveDbConfig({
      dbType: String(body.dbType) as 'postgres' | 'integrado' | 'sueldo',
      dbEngine: String(body.dbEngine) as 'postgres' | 'sqlanywhere',
      disabled: Boolean(body.disabled),
      action: String(body.action || 'save') as 'save' | 'test' | 'reconnect',
      profile: {
        host: String(body.host || ''),
        port: Number(body.port || 0),
        server: String(body.server || ''),
        database: String(body.database || ''),
        username: String(body.username || ''),
        password: String(body.password || ''),
      },
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error('DB config save error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo guardar la configuracion.' },
      { status: 400 },
    );
  }
}
