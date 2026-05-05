'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getBranding } from '@/lib/branding';

type BrandingApiRecord = {
  empresa: string;
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
};

function ensureIconLink(rel: string, href: string) {
  let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function applyFavicon(href: string) {
  ensureIconLink('icon', href);
  ensureIconLink('shortcut icon', href);
  ensureIconLink('apple-touch-icon', href);
}

export function RuntimeBrandingSync({ empresa }: { empresa?: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const globalBranding = getBranding();
    const globalFavicon = globalBranding.faviconUrl || '/brand-fallback.svg';
    const empresaParam = String(searchParams.get('empresa') || empresa || '').trim();

    if (!empresaParam) {
      applyFavicon(globalFavicon);
      return;
    }

    let cancelled = false;

    async function loadBranding() {
      const response = await fetch(`/api/config/branding?empresa=${encodeURIComponent(empresaParam)}`, {
        cache: 'no-store',
      }).catch(() => null);

      if (!response || cancelled) {
        applyFavicon(globalFavicon);
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        data?: BrandingApiRecord | null;
      };

      if (cancelled) return;

      const favicon = payload.ok && payload.data?.faviconUrl ? payload.data.faviconUrl : globalFavicon;

      applyFavicon(favicon);
    }

    void loadBranding();

    return () => {
      cancelled = true;
    };
  }, [empresa, searchParams]);

  return null;
}
