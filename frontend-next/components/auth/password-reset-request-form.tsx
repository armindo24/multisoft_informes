'use client';

import Link from 'next/link';
import { Mail, UserRound } from 'lucide-react';
import { useState } from 'react';

export function PasswordResetRequestForm() {
  const [identity, setIdentity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.message || 'No se pudo procesar la solicitud.');
        setLoading(false);
        return;
      }

      setSuccess(data?.message || 'Revisa tu correo para continuar.');
      setLoading(false);
    } catch {
      setError('No se pudo enviar el correo de recuperación.');
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[438px] rounded-[32px] border border-slate-200/80 bg-white px-8 py-9 shadow-[0_30px_80px_rgba(3,10,28,0.35)]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Recuperación segura</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Recuperar acceso</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Ingresa tu usuario o email. Si existe una cuenta activa, enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Usuario o email</span>
          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(15,23,42,0.08)]">
            <UserRound className="h-4 w-4 text-slate-500" />
            <input
              className="w-full border-0 bg-transparent text-sm outline-none"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              placeholder="admin o usuario@dominio.com"
            />
          </div>
        </label>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {success ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#050b23] px-4 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(2,6,23,0.28)] transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mail className="h-4 w-4" />
        {loading ? 'Enviando enlace...' : 'Enviar recuperación'}
      </button>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link href="/login" className="font-medium text-cyan-700 transition hover:text-cyan-800">
          Volver al login
        </Link>
        <span className="text-slate-400">Validez del enlace: 60 minutos</span>
      </div>
    </form>
  );
}
