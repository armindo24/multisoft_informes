'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole, User2 } from 'lucide-react';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const nextPath = nextParam && nextParam !== '/' ? nextParam : '/dashboard';
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
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
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.message || 'No se pudo iniciar sesión.');
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
      className="w-full max-w-[438px] rounded-[32px] border border-slate-200/80 bg-white px-8 py-9 shadow-[0_30px_80px_rgba(3,10,28,0.35)]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Acceso seguro</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Ingresar al panel</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Accede a tu entorno gerencial con credenciales protegidas y una experiencia pensada para operación diaria.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Usuario</span>
          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(15,23,42,0.08)]">
            <User2 className="h-4 w-4 text-slate-500" />
            <input
              className="w-full border-0 bg-transparent text-sm outline-none"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Contraseña</span>
          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(15,23,42,0.08)]">
            <LockKeyhole className="h-4 w-4 text-amber-500" />
            <input
              type="password"
              className="w-full border-0 bg-transparent text-sm outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
            />
          </div>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm">
        <Link href="/password-reset" className="font-medium text-cyan-700 transition hover:text-cyan-800">
          ¿Olvidó su contraseña?
        </Link>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 w-full rounded-[18px] bg-[#050b23] px-4 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(2,6,23,0.28)] transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Ingresando...' : 'Acceder al panel'}
      </button>

      {isDevelopment ? (
        <div className="mt-5 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Modo desarrollo: <span className="font-semibold text-slate-700">admin / admin</span>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { value: '24h', label: 'Disponibilidad' },
          { value: '4', label: 'Módulos clave' },
          { value: '100%', label: 'Acceso web' },
        ].map((item) => (
          <div key={item.label} className="rounded-[18px] bg-slate-50 px-3 py-4 text-center">
            <div className="text-[1.7rem] font-bold tracking-tight text-slate-950">{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>
    </form>
  );
}
