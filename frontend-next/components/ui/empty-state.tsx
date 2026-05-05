import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

type EmptyStateTone = 'empty' | 'loading' | 'error' | 'info';

const toneClasses: Record<EmptyStateTone, string> = {
  empty: 'border-slate-200 bg-slate-50 text-slate-600',
  loading: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  error: 'border-amber-200 bg-amber-50 text-amber-900',
  info: 'border-cyan-200 bg-cyan-50 text-cyan-900',
};

export function EmptyState({
  title,
  description,
  tone = 'empty',
  action,
}: {
  title: string;
  description?: string;
  tone?: EmptyStateTone;
  action?: React.ReactNode;
}) {
  const Icon = tone === 'loading' ? Loader2 : tone === 'error' ? AlertTriangle : Inbox;

  return (
    <div className={`rounded-2xl border px-4 py-5 text-sm ${toneClasses[tone]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70">
            <Icon className={`h-4 w-4 ${tone === 'loading' ? 'animate-spin' : ''}`} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold">{title}</p>
            {description ? <p className="mt-1 leading-5 opacity-80">{description}</p> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
