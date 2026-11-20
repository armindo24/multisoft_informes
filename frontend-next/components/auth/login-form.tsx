'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole, User2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const nextPath = nextParam && nextParam !== '/' ? nextParam : '/dashboard';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, ...(requiresPasswordChange ? { newPassword, confirmPassword } : {}) }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.message || 'No se pudo iniciar sesión.');
        setLoading(false);
        return;
      }

      if (data?.requiresPasswordChange) {
        setRequiresPasswordChange(true);
        setLoading(false);
        return;
      }

      if (data?.limitNotice) {
        window.sessionStorage.setItem('multisoft:login-notice', String(data.limitNotice));
      }

      router.push(nextPath as Route);
      router.refresh();
    } catch {
      setError('No se pudo iniciar sesión. Verifica que el frontend esté levantado.');
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.22)] sm:p-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Acceso seguro</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{requiresPasswordChange ? 'Crear nueva contraseña' : 'Iniciar sesión'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {requiresPasswordChange ? 'Define tu nueva clave para continuar.' : 'Ingresa tus credenciales para acceder a tu entorno gerencial.'}
        </p>
      </div>

      {!requiresPasswordChange ? <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Usuario o correo electrónico</span>
          <div className="flex items-center gap-3 h-12 rounded-xl border border-slate-200 bg-slate-50/60 px-3 transition focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-600/15">
            <User2 className="h-4 w-4 text-slate-500" />
            <input
              required
              className="min-w-0 w-full border-0 bg-transparent text-sm outline-none"
              disabled={requiresPasswordChange}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="usuario@empresa.com"
              autoComplete="username"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Contraseña</span>
          <div className="flex items-center gap-3 h-12 rounded-xl border border-slate-200 bg-slate-50/60 px-3 transition focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-600/15">
            <LockKeyhole className="h-4 w-4 text-slate-500" />
            <input
              type="password"
              required
              className="min-w-0 w-full border-0 bg-transparent text-sm outline-none"
              disabled={requiresPasswordChange}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
            />
          </div>
        </label>
      </div> : null}

      {requiresPasswordChange ? (
        <div className="mt-5 space-y-4">
          <p className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">En tu primer ingreso debes cambiar la contraseña inicial. Usa al menos 8 caracteres y una contraseña diferente.</p>
          <label className="block text-sm font-medium text-slate-700">
            Nueva contraseña
            <input type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Confirmar nueva contraseña
            <input type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" />
          </label>
          <button type="button" disabled={loading} onClick={() => { setRequiresPasswordChange(false); setNewPassword(''); setConfirmPassword(''); setPassword(''); setError(''); }} className="text-sm text-cyan-700">Volver al ingreso</button>
        </div>
      ) : null}

      {!requiresPasswordChange ? <div className="mt-4 flex items-center justify-end text-sm">
        <Link href="/password-reset" className="font-medium text-cyan-700 transition hover:text-cyan-800">
          ¿Olvidó su contraseña?
        </Link>
      </div> : null}

      {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 h-12 w-full rounded-xl bg-[#0c1930] px-4 text-sm font-semibold text-white transition hover:bg-[#152d4e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Ingresando...' : requiresPasswordChange ? 'Guardar contraseña e ingresar' : 'Acceder al panel'}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" /> Acceso corporativo
      </div>
    </form>
  );
}
