import type { KPI } from '@/types/dashboard';

const trendClasses: Record<KPI['trend'], string> = {
  up: 'bg-emerald-100 text-emerald-700',
  down: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-700',
};

function isNumericValue(value: string) {
  return /^[\d\s.,-]+$/.test(String(value || '').trim());
}

export function KpiCard({ item }: { item: KPI }) {
  const numericValue = isNumericValue(item.value);

  return (
    <div className="card p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-2.5">
        <p className="min-w-0 text-[13px] leading-5 text-slate-500">{item.title}</p>
        <span className={`badge max-w-[96px] shrink-0 whitespace-normal break-words px-2 py-1 text-right text-xs leading-tight ${trendClasses[item.trend]}`}>
          {item.change}
        </span>
      </div>
      <p
        className={`mt-2 min-w-0 break-words font-bold leading-[1.08] text-slate-900 ${
          numericValue
            ? 'text-[clamp(1rem,1.05vw,1.34rem)]'
            : 'text-[clamp(1.05rem,1.35vw,1.65rem)]'
        }`}
      >
        {item.value}
      </p>
    </div>
  );
}
