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
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500">{item.title}</p>
          <p
            className={`mt-3 overflow-hidden whitespace-nowrap font-bold leading-tight text-slate-900 ${
              numericValue
                ? 'text-[clamp(0.84rem,1.08vw,1.42rem)] tracking-[-0.08em]'
                : 'text-[clamp(1rem,1.55vw,1.85rem)] tracking-[-0.04em]'
            }`}
          >
            {item.value}
          </p>
        </div>
        <span className={`badge max-w-[82px] shrink-0 whitespace-normal break-words px-2 py-1 text-right text-xs leading-tight ${trendClasses[item.trend]}`}>
          {item.change}
        </span>
      </div>
    </div>
  );
}
