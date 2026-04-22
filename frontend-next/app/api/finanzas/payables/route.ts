import { NextResponse } from 'next/server';
import { getCuentasPagar } from '@/lib/api';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const empresa = String(searchParams.get('empresa') || '');
    const periodo = String(searchParams.get('periodo') || '');
    const comprasStart = String(searchParams.get('compras_start') || '');
    const comprasEnd = String(searchParams.get('compras_end') || '');

    if (!empresa || !periodo || !comprasStart || !comprasEnd) {
      return NextResponse.json({ ok: false, message: 'Faltan parametros para cuentas por pagar.' }, { status: 400 });
    }

    const response = await getCuentasPagar({
      empresa,
      periodo,
      compras_start: comprasStart,
      compras_end: comprasEnd,
    });

    return NextResponse.json({
      ok: true,
      data: Array.isArray(response?.data) ? response.data : [],
    });
  } catch (error) {
    console.error('Payables async load error:', error);
    return NextResponse.json({ ok: false, message: 'No se pudo cargar cuentas por pagar.' }, { status: 500 });
  }
}
