'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PasswordResetConfirmForm({
  token,
  username,
}: {
  token: string;
  username: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.message || 'No se pudo actualizar la contraseña.');
        setLoading(false);
        return;
      }

      setSuccess(data?.message || 'La contraseña se actualizó correctamente.');
      setLoading(false);
      window.setTimeout(() => {
        router.push('/login' as Route);
        router.refresh();
      }, 1200);
    } catch {
      setError('No se pudo actualizar la contraseña.');
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[438px] rounded-[32px] border border-slate-200/80 bg-white px-8 py-9 shadow-[0_30px_80px_rgba(3,10,28,0.35)]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Contraseña nueva</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Definir acceso</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Restableciendo el acceso de <span className="font-semibold text-slate-800">{username || 'usuario'}</span>. Elige una contraseña nueva para continuar.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Nueva contraseña</span>
          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(15,23,42,0.08)]">
            <LockKeyhole className="h-4 w-4 text-amber-500" />
            <input
              type="password"
              className="w-full border-0 bg-transparent text-sm outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Confirmar contraseña</span>
          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(15,23,42,0.08)]">
            <LockKeyhole className="h-4 w-4 text-amber-500" />
            <input
              type="password"
              className="w-full border-0 bg-transparent text-sm outline-none"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repite la nueva contraseña"
            />
          </div>
        </label>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {success ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 w-full rounded-[18px] bg-[#050b23] px-4 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(2,6,23,0.28)] transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
      </button>

      <div className="mt-5 text-sm">
        <Link href="/login" className="font-medium text-cyan-700 transition hover:text-cyan-800">
          Volver al login
        </Link>
      </div>
    </form>
  );
}
