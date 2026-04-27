import path from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function pathExists(target: string) {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveAssetsDir() {
  if (process.env.BRANDING_UPLOAD_DIR) {
    return process.env.BRANDING_UPLOAD_DIR;
  }

  const linuxAssetsDir = '/opt/multisoft/assets';
  if (await pathExists(linuxAssetsDir)) {
    return linuxAssetsDir;
  }

  return path.join(process.cwd(), 'public', 'assets');
}

function detectContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.ico') return 'image/x-icon';
  return 'application/octet-stream';
}

function sanitizeSegments(parts: string[]) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .filter((part) => part !== '.' && part !== '..' && !part.includes('\\') && !part.includes('/'));
}

export async function GET(_: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await context.params;
    const parts = sanitizeSegments(Array.isArray(params.path) ? params.path : []);
    if (!parts.length) {
      return NextResponse.json({ ok: false, message: 'Archivo no encontrado.' }, { status: 404 });
    }

    const assetsDir = await resolveAssetsDir();
    const target = path.join(assetsDir, ...parts);
    const relative = path.relative(assetsDir, target);

    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
      return NextResponse.json({ ok: false, message: 'Ruta invalida.' }, { status: 400 });
    }

    const file = await readFile(target).catch(() => null);
    if (!file) {
      return NextResponse.json({ ok: false, message: 'Archivo no encontrado.' }, { status: 404 });
    }

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': detectContentType(target),
        'Cache-Control': 'public, max-age=604800',
      },
    });
  } catch (error) {
    console.error('Branding asset read error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar el archivo.' }, { status: 500 });
  }
}
