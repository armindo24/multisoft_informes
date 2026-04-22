import { AuthShell } from '@/components/auth/auth-shell';
import { PasswordResetRequestForm } from '@/components/auth/password-reset-request-form';

export default function PasswordResetPage() {
  return (
    <AuthShell
      title={
        <>
          Recuperación
          <br />
          de acceso
          <br />
          <span className="text-slate-300">con correo</span>
          <br />
          <span className="text-slate-300">seguro</span>
        </>
      }
      description="Envía un enlace de recuperación al correo del usuario para volver a ingresar sin intervención manual del administrador."
    >
      <PasswordResetRequestForm />
    </AuthShell>
  );
}
