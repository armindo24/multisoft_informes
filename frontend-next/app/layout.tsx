import './globals.css';
import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/app-shell';
import { RuntimeBrandingSync } from '@/components/ui/runtime-branding-sync';
import { getSessionUser } from '@/lib/auth-server';
import { getBranding } from '@/lib/branding';

const branding = getBranding();
export const metadata: Metadata = {
  title: `${branding.appName} | ${branding.tagline}`,
  description: `Plataforma corporativa de reportes para ${branding.clientName}.`,
  icons: {
    icon: branding.faviconUrl || '/brand-fallback.svg',
    shortcut: branding.faviconUrl || '/brand-fallback.svg',
    apple: branding.faviconUrl || '/brand-fallback.svg',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sessionUser = await getSessionUser();

  return (
    <html lang="es">
      <body>
        <RuntimeBrandingSync />
        <AppShell user={sessionUser}>{children}</AppShell>
      </body>
    </html>
  );
}
