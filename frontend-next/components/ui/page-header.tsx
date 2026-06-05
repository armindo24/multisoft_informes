import { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-soft lg:flex-row lg:items-center lg:justify-between ${compact ? 'gap-2 px-4 py-2.5 sm:px-5' : 'gap-3 px-4 py-3.5 sm:px-5'}`}>
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700">{eyebrow}</p> : null}
        <h1 className={`${compact ? 'mt-0 text-[1.35rem] sm:text-[1.6rem]' : 'mt-0.5 text-[1.55rem] sm:text-[1.85rem]'} font-bold tracking-tight text-slate-900`}>{title}</h1>
        <p className={`${compact ? 'mt-0.5 max-w-none whitespace-nowrap text-[13px] leading-5' : 'mt-1 max-w-3xl text-sm leading-6'} text-slate-600`}>{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
