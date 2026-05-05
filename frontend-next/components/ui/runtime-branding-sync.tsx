'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    applyFavicon('/favicon.ico');
  }, [empresa]);

  return null;
}
