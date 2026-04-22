import './globals.css';
import type { Metadata } from 'next';

import { AppShell } from '@/components/layout/app-shell';
import { getSessionUser } from '@/lib/auth-server';

export const metadata: Metadata = {
  title: 'Multisoft Informes | Frontend Next.js',
  description: 'Base frontend moderna para el sistema de informes gerenciales.',
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
