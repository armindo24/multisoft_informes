'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { brandShortName, getBranding, getLogoBackgroundClasses, resolveBrandAssetUrl, type BrandingConfig } from '@/lib/branding';

type BrandingApiRecord = {
  empresa: string;
  scope?: string;
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  logoBackground: 'auto' | 'light' | 'dark';
};

function toBrandingConfig(record: BrandingApiRecord | null | undefined, fallback: BrandingConfig): BrandingConfig {
  return {
    appName: fallback.appName,
    clientName: record?.clientName || fallback.clientName,
    tagline: record?.tagline || fallback.tagline,
    logoUrl: record?.logoUrl || fallback.logoUrl,
    faviconUrl: record?.faviconUrl || fallback.faviconUrl,
    logoBackground: record?.logoBackground || fallback.logoBackground,
  };
}

function pickDefaultBranding(records: BrandingApiRecord[]) {
  const globalRecord = records.find((item) => String(item.empresa || '').toUpperCase() === 'GLOBAL');
  if (globalRecord?.logoUrl) return globalRecord;
  return records.find((item) => item.logoUrl) || globalRecord || records[0] || null;
}

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
    let cancelled = false;

    async function loadBranding() {
      const url = empresaParam
        ? `/api/config/branding?empresa=${encodeURIComponent(empresaParam)}`
        : '/api/config/branding';
      const response = await fetch(url, {
        cache: 'no-store',
      }).catch(() => null);

      if (!response || cancelled) {
        setBranding(globalBranding);
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        data?: BrandingApiRecord | BrandingApiRecord[] | null;
      };

      if (cancelled) return;

      if (!payload.ok || !payload.data) {
        setBranding(globalBranding);
        return;
      }

      const record = Array.isArray(payload.data)
        ? pickDefaultBranding(payload.data)
        : payload.data;
      setBranding(toBrandingConfig(record, globalBranding));
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
  const isSidebarMode = light && !compact;
  const isSidebarWideLogo = isSidebarMode && isWideLogo;
  const subTone = light ? 'text-slate-300' : 'text-slate-500';
  const logoBackgroundClass = getLogoBackgroundClasses(branding.logoBackground, light);
  const logoContainerClass = hasLogo
    ? compact
      ? isWideLogo
        ? 'h-10 max-w-[180px] px-2.5'
        : 'h-10 max-w-[140px] px-2'
      : isSidebarMode
        ? isWideLogo
          ? 'h-10 max-w-[118px] px-2'
          : 'h-9 max-w-[84px] px-2'
        : isWideLogo
          ? 'h-14 max-w-[260px] px-3'
          : 'h-12 max-w-[180px] px-3'
    : '';

  return (
    <div className="flex min-w-0 items-center gap-3">
      {hasLogo ? (
        <div
          className={[
            'flex items-center justify-center overflow-hidden rounded-xl shadow-sm',
            logoBackgroundClass,
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
      <div className={isSidebarMode ? 'min-w-0 flex-1' : compact ? 'hidden min-w-0 min-[480px]:block' : 'min-w-0'}>
        <p
          className={[
            isSidebarMode
              ? 'truncate text-[0.82rem] leading-4 tracking-[0.1em]'
              : 'truncate text-sm tracking-[0.24em]',
            'font-semibold uppercase',
            light ? 'text-cyan-300' : 'text-cyan-700',
          ].join(' ')}
          title={branding.clientName}
        >
          {branding.clientName}
        </p>
        <p
          className={[
            compact ? 'hidden sm:block' : 'block',
            isSidebarMode
              ? isSidebarWideLogo
                ? 'line-clamp-2 text-[0.78rem] leading-4'
                : 'line-clamp-2 text-[0.82rem] leading-4'
              : 'truncate text-sm',
            subTone,
          ].join(' ')}
          title={branding.tagline}
        >
          {branding.tagline}
        </p>
      </div>
    </div>
  );
}
