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
    <section aria-label="Contexto del informe" className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-xs font-semibold text-cyan-700">Contexto del informe</h2>
          <p className="text-[11px] text-slate-400">Generado: {generatedAt}</p>
        </div>
        <dl className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 lg:justify-end">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex min-w-0 max-w-full items-center gap-1.5 text-xs">
                <Icon aria-hidden="true" className="h-3 w-3 shrink-0 text-cyan-700" />
                <dt className="shrink-0 text-slate-500">{item.label}:</dt>
                <dd className="truncate font-medium text-slate-800" title={item.value}>{item.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
