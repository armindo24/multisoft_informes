import './globals.css';
import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/app-shell';
import { RuntimeBrandingSync } from '@/components/ui/runtime-branding-sync';
import { getSessionUser } from '@/lib/auth-server';
import { getBranding } from '@/lib/branding';
import { getPrimaryScopedEmpresa } from '@/lib/empresas-server';

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
  let empresaAsignada: string | undefined = undefined;
  if (sessionUser?.id) {
    try {
      empresaAsignada = (await getPrimaryScopedEmpresa('Integrado')) || undefined;
    } catch (error) {
      /* ignore and fallback to global branding */
    }
  }

  return (
    <html lang="es">
      <body>
        <RuntimeBrandingSync empresa={empresaAsignada} />
        <AppShell user={sessionUser} empresa={empresaAsignada}>{children}</AppShell>
      </body>
    </html>
  );
}
