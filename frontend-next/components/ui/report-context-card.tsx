import { CalendarDays, Coins, Factory, UserRound } from 'lucide-react';

type ReportContextCardProps = {
  empresa: string;
  periodo: string;
  rango: string;
  moneda: string;
  usuario: string;
};

export function ReportContextCard({ empresa, periodo, rango, moneda, usuario }: ReportContextCardProps) {
  const generatedAt = new Date().toLocaleString('es-PY');
  const items = [
    { label: 'Empresa', value: empresa, icon: Factory },
    { label: 'Periodo', value: `${periodo} · ${rango}`, icon: CalendarDays },
    { label: 'Moneda', value: moneda, icon: Coins },
    { label: 'Usuario', value: usuario, icon: UserRound },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Contexto del informe</p>
          <p className="mt-1 text-sm text-slate-500">Generado: {generatedAt}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-700" />
                  {item.label}
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900" title={item.value}>{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
