'use client';

import { useState } from 'react';

type SoftwareOwnerMarkProps = {
  compact?: boolean;
  light?: boolean;
};

export function SoftwareOwnerMark({ compact = false, light = false }: SoftwareOwnerMarkProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex min-w-0 items-center gap-3">
      {logoFailed ? (
        <div
          className={[
            'flex shrink-0 items-center justify-center rounded-xl bg-cyan-600 font-black tracking-[0.12em] text-white shadow-sm',
            compact ? 'h-9 w-9 text-sm' : 'h-12 w-12 text-base',
          ].join(' ')}
        >
          M
        </div>
      ) : (
        <div
          className={[
            'flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/95 px-2 shadow-sm',
            compact ? 'h-9 max-w-[118px]' : 'h-12 max-w-[170px]',
          ].join(' ')}
        >
          <img
            src="/multisoft-logo.png"
            alt="Multisoft"
            onError={() => setLogoFailed(true)}
            className="max-h-full w-auto max-w-full object-contain"
          />
        </div>
      )}
      <div className="min-w-0">
        <p
          className={[
            'truncate font-semibold uppercase',
            compact ? 'text-[0.72rem] leading-4 tracking-[0.18em]' : 'text-sm tracking-[0.24em]',
            light ? 'text-cyan-300' : 'text-cyan-700',
          ].join(' ')}
        >
          Multisoft
        </p>
        <p
          className={[
            compact ? 'text-xs leading-4' : 'text-sm',
            light ? 'text-slate-300' : 'text-slate-500',
          ].join(' ')}
        >
          Informes Gerenciales
        </p>
      </div>
    </div>
  );
}
