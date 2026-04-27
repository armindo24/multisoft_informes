'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { brandShortName, getBranding, resolveBrandAssetUrl, type BrandingConfig } from '@/lib/branding';

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
  const [isWideLogo, setIsWideLogo] = useState(false);
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

  useEffect(() => {
    setIsWideLogo(false);
  }, [branding.logoUrl]);

  const hasLogo = Boolean(branding.logoUrl);
  const shortName = brandShortName(branding.clientName);
  const subTone = light ? 'text-slate-300' : 'text-slate-500';
  const logoContainerClass = hasLogo
    ? compact
      ? isWideLogo
        ? 'h-10 max-w-[180px] px-2.5'
        : 'h-10 max-w-[140px] px-2'
      : isWideLogo
        ? 'h-14 max-w-[260px] px-3'
        : 'h-12 max-w-[180px] px-3'
    : '';

  return (
    <div className="flex items-center gap-3">
      {hasLogo ? (
        <div
          className={[
            'flex items-center overflow-hidden rounded-xl bg-white/95 shadow-sm',
            logoContainerClass,
          ].join(' ')}
        >
          <img
            src={resolveBrandAssetUrl(branding.logoUrl)}
            alt={branding.clientName}
            onLoad={(event) => {
              const image = event.currentTarget;
              const width = Number(image.naturalWidth || 0);
              const height = Number(image.naturalHeight || 0);
              if (!width || !height) return;
              setIsWideLogo(width / height >= 2.15);
            }}
            className="max-h-full w-auto max-w-full object-contain"
          />
        </div>
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
