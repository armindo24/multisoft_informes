import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthShell description="Plataforma unificada para finanzas, stock, ventas y compras, diseñada para equipos que necesitan control, velocidad y claridad en la toma de decisiones.">
      <LoginForm />
    </AuthShell>
  );
}
