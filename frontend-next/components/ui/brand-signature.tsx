'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { brandShortName, getBranding, type BrandingConfig } from '@/lib/branding';

type BrandingApiRecord = {
  empresa: string;
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
};

export function BrandSignature({
  compact = false,
  light = false,
  empresa,
}: {
  compact?: boolean;
  light?: boolean;
  empresa?: string;
}) {
  const searchParams = useSearchParams();
  const globalBranding = useMemo(() => getBranding(), []);
  const [branding, setBranding] = useState<BrandingConfig>(globalBranding);
  const empresaParam = String(empresa || searchParams.get('empresa') || '').trim().toUpperCase();

  useEffect(() => {
    if (!empresaParam) {
      setBranding(globalBranding);
      return;
    }

    let cancelled = false;

    async function loadBranding() {
      const response = await fetch(`/api/config/branding?empresa=${encodeURIComponent(empresaParam)}`, {
        cache: 'no-store',
      }).catch(() => null);

      if (!response || cancelled) {
        setBranding(globalBranding);
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        data?: BrandingApiRecord | null;
      };

      if (cancelled) return;

      if (!payload.ok || !payload.data) {
        setBranding(globalBranding);
        return;
      }

      setBranding({
        appName: globalBranding.appName,
        clientName: payload.data.clientName || globalBranding.clientName,
        tagline: payload.data.tagline || globalBranding.tagline,
        logoUrl: payload.data.logoUrl || globalBranding.logoUrl,
        faviconUrl: payload.data.faviconUrl || globalBranding.faviconUrl,
      });
    }

    void loadBranding();

    return () => {
      cancelled = true;
    };
  }, [empresaParam, globalBranding]);

  const hasLogo = Boolean(branding.logoUrl);
  const shortName = brandShortName(branding.clientName);
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
