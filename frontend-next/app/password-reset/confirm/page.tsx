import Link from 'next/link';

import { AuthShell } from '@/components/auth/auth-shell';
import { PasswordResetConfirmForm } from '@/components/auth/password-reset-confirm-form';
import { inspectPasswordResetToken } from '@/lib/password-reset';

export default async function PasswordResetConfirmPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const token = String(params.token || '').trim();
  const inspection = await inspectPasswordResetToken(token);

  return (
    <AuthShell
      title={
        <>
          Nueva
          <br />
          contraseña
          <br />
          <span className="text-slate-300">para volver</span>
          <br />
          <span className="text-slate-300">a ingresar</span>
        </>
      }
      description="El enlace de recuperación te permite definir una contraseña nueva sin salir del frontend actual."
    >
      {inspection.valid ? (
        <PasswordResetConfirmForm token={token} username={inspection.username} />
      ) : (
        <div className="w-full max-w-[438px] rounded-[32px] border border-slate-200/80 bg-white px-8 py-9 shadow-[0_30px_80px_rgba(3,10,28,0.35)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Enlace no disponible</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Recuperación vencida</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            El enlace ya no está disponible o venció. Solicita uno nuevo desde la pantalla de acceso.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/password-reset" className="inline-flex items-center rounded-[18px] bg-[#050b23] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Solicitar nuevo enlace
            </Link>
            <Link href="/login" className="inline-flex items-center rounded-[18px] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Volver al login
            </Link>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
