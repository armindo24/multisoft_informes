import { NextResponse } from 'next/server';
import { getMayorCuentaDet } from '@/lib/api';

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

    if (!empresa || !periodo || !fechad || !fechah || !cuenta) {
      return NextResponse.json({ ok: false, message: 'Faltan parametros para mayor de cuentas.' }, { status: 400 });
    }

    const response = await getMayorCuentaDet({
      empresa,
      periodo,
      fechad,
      fechah,
      tipoasiento,
      cuenta,
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
    console.error('Mayor cuenta detail load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar el detalle del mayor.' }, { status: 500 });
  }
}
