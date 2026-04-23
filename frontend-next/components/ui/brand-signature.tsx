import { brandShortName, getBranding } from '@/lib/branding';

export function BrandSignature({
  compact = false,
  light = false,
}: {
  compact?: boolean;
  light?: boolean;
}) {
  const branding = getBranding();
  const hasLogo = Boolean(branding.logoUrl);
  const shortName = brandShortName(branding.clientName);
  const textTone = light ? 'text-white' : 'text-slate-950';
  const subTone = light ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className="flex items-center gap-3">
      {hasLogo ? (
        <img
          src={branding.logoUrl}
          alt={branding.clientName}
          className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} rounded-xl object-contain bg-white/95 p-1 shadow-sm`}
        />
      ) : (
        <div className={`${compact ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base'} flex items-center justify-center rounded-xl bg-cyan-600 font-black tracking-[0.18em] text-white shadow-sm`}>
          {shortName}
        </div>
      )}
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold uppercase tracking-[0.24em] ${light ? 'text-cyan-300' : 'text-cyan-700'}`}>
          {branding.clientName}
        </p>
        <p className={`truncate text-sm ${compact ? 'hidden sm:block' : 'block'} ${subTone}`}>{branding.tagline}</p>
      </div>
    </div>
  );
}
