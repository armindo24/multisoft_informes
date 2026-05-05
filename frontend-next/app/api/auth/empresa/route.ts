import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { getPrimaryScopedEmpresa } from '@/lib/empresas-server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return NextResponse.json({ ok: false, message: 'Sesion expirada.' }, { status: 401 });
    }

    const empresa = await getPrimaryScopedEmpresa('Integrado');

    return NextResponse.json({ ok: true, data: { empresa } });
  } catch (error) {
    console.error('Error loading user empresa:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo resolver la empresa asignada.' }, { status: 500 });
  }
}
