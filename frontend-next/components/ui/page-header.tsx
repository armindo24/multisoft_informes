import { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
