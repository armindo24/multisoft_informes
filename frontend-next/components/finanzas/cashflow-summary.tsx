export function CashflowSummary({
  saldos,
  movimientos,
  descuentos,
  bancos,
}: {
  saldos: Array<Record<string, unknown>>;
  movimientos: Array<Record<string, unknown>>;
  descuentos: Array<Record<string, unknown>>;
  bancos: Array<Record<string, unknown>>;
}) {
  function money(value: number) {
    return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(value || 0);
  }

  function num(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
  }

  const ingresos = movimientos
    .filter((item) => String(item.Tipo || item.tipo || '').toUpperCase() === 'I')
    .reduce((acc, item) => acc + num(item.Total || item.total), 0);

  const egresos = movimientos
    .filter((item) => String(item.Tipo || item.tipo || '').toUpperCase() === 'E')
    .reduce((acc, item) => acc + num(item.Total || item.total), 0);

  const saldoInicial = saldos.reduce((acc, item) => acc + num(item.Saldo || item.saldo), 0);
  const saldoBancos = bancos.reduce((acc, item) => acc + num(item.Saldo || item.saldo), 0);
  const totalDescuentos = descuentos.reduce((acc, item) => acc + num(item.importe || item.Importe || item.Total || item.total), 0);
  const saldoFinal = saldoInicial + ingresos - egresos - totalDescuentos;

  const cards = [
    { title: 'Saldo inicial', value: money(saldoInicial), helper: `${saldos.length} registros bancarios` },
    { title: 'Ingresos', value: money(ingresos), helper: `${movimientos.filter((item) => String(item.Tipo || item.tipo || '').toUpperCase() === 'I').length} movimientos` },
    { title: 'Egresos', value: money(egresos), helper: `${movimientos.filter((item) => String(item.Tipo || item.tipo || '').toUpperCase() === 'E').length} movimientos` },
    { title: 'Saldo final estimado', value: money(saldoFinal), helper: `Bancos al cierre: ${money(saldoBancos)}` },
  ];

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-slate-900">Flujo de caja mensual</h2>
      <p className="mt-1 text-sm text-slate-500">Resumen gerencial del corte mensual usando el endpoint actual de flowcash.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.helper}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
