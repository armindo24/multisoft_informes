import { NextResponse } from 'next/server';
import { getMayorCuentaAuxDet } from '@/lib/api';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const empresa = String(searchParams.get('empresa') || '');
    const periodo = String(searchParams.get('periodo') || '');
    const fechad = String(searchParams.get('fechad') || '');
    const fechah = String(searchParams.get('fechah') || '');
    const tipoasiento = String(searchParams.get('tipoasiento') || 'NINGUNO');
    const cuenta = String(searchParams.get('cuenta') || '');
    const path = String(searchParams.get('path') || '');

    if (!empresa || !periodo || !fechad || !fechah || !cuenta || !path) {
      return NextResponse.json({ ok: false, message: 'Faltan parametros para mayor de auxiliares.' }, { status: 400 });
    }

    const response = await getMayorCuentaAuxDet({
      empresa,
      periodo,
      fechad,
      fechah,
      tipoasiento,
      cuenta,
      path,
    });

    return NextResponse.json(
      {
        ok: true,
        data: Array.isArray(response) ? response : [],
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=30',
        },
      },
    );
  } catch (error) {
    console.error('Mayor cuenta aux detail load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar el detalle del mayor auxiliar.' }, { status: 500 });
  }
}
