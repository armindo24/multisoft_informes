import path from 'node:path';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
]);

async function pathExists(target: string) {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveUploadDir() {
  if (process.env.BRANDING_UPLOAD_DIR) {
    return process.env.BRANDING_UPLOAD_DIR;
  }

  const linuxAssetsDir = '/opt/multisoft/assets';
  if (await pathExists(linuxAssetsDir)) {
    return linuxAssetsDir;
  }

  return path.join(process.cwd(), 'public', 'assets');
}

function sanitizeSegment(value: string) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'global';
}

function detectExtension(file: File) {
  const filename = String(file.name || '').trim();
  const explicitExt = path.extname(filename).replace('.', '').toLowerCase();
  if (explicitExt) return explicitExt;

  switch (file.type) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/svg+xml':
      return 'svg';
    case 'image/x-icon':
    case 'image/vnd.microsoft.icon':
      return 'ico';
    default:
      return 'bin';
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const empresa = sanitizeSegment(String(formData.get('empresa') || 'GLOBAL'));
    const kindRaw = String(formData.get('kind') || 'logo').trim().toLowerCase();
    const kind = kindRaw === 'favicon' ? 'favicon' : 'logo';
    const uploaded = formData.get('file');

    if (!(uploaded instanceof File)) {
      return NextResponse.json({ ok: false, message: 'Seleccione un archivo para subir.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(uploaded.type)) {
      return NextResponse.json({ ok: false, message: 'El archivo debe ser una imagen PNG, JPG, WEBP, SVG o ICO.' }, { status: 400 });
    }

    if (uploaded.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: 'El archivo supera el limite de 5 MB.' }, { status: 400 });
    }

    const uploadDir = await resolveUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const extension = detectExtension(uploaded);
    const filename = `${empresa}-${kind}-${Date.now()}.${extension}`;
    const destination = path.join(uploadDir, filename);
    const bytes = Buffer.from(await uploaded.arrayBuffer());
    await writeFile(destination, bytes);

    const baseUrl = String(process.env.NEXT_PUBLIC_BRANDING_ASSET_BASE_URL || '/assets').replace(/\/$/, '');
    return NextResponse.json({
      ok: true,
      data: {
        filename,
        url: `${baseUrl}/${filename}`,
      },
    });
  } catch (error) {
    console.error('Branding upload error:', error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'No se pudo subir el archivo.' },
      { status: 500 },
    );
  }
}
