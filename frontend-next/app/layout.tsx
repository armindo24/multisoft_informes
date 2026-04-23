import './globals.css';
import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/app-shell';
import { getSessionUser } from '@/lib/auth-server';
import { getBranding } from '@/lib/branding';

const branding = getBranding();
export const metadata: Metadata = {
  title: `${branding.appName} | ${branding.tagline}`,
  description: `Plataforma corporativa de reportes para ${branding.clientName}.`,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sessionUser = await getSessionUser();

  return (
    <html lang="es">
      <body>
        <AppShell user={sessionUser}>{children}</AppShell>
      </body>
    </html>
  );
}
