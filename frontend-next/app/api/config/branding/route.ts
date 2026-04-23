import { NextResponse } from 'next/server';
import { loadBrandingConfig, loadBrandingConfigs, saveBrandingConfig } from '@/lib/admin-config';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const empresa = String(searchParams.get('empresa') || '').trim();

    if (empresa) {
      const config = await loadBrandingConfig(empresa);
      return NextResponse.json({ ok: true, data: config });
    }

    const configs = await loadBrandingConfigs();
    return NextResponse.json({ ok: true, data: configs });
  } catch (error) {
    console.error('Branding config load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar la marca corporativa.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const saved = await saveBrandingConfig({
      empresa: String(body.empresa || 'GLOBAL'),
      clientName: String(body.clientName || ''),
      tagline: String(body.tagline || ''),
      logoUrl: String(body.logoUrl || ''),
      faviconUrl: String(body.faviconUrl || ''),
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error('Branding config save error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo guardar la marca corporativa.' },
      { status: 400 },
    );
  }
}
