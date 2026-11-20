'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

const LOGIN_PATH = '/login';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function handleLogout() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', keepalive: true });
      if (!response.ok) throw new Error();
      window.location.assign(LOGIN_PATH);
    } catch {
      setError('No se pudo salir. Reintenta.');
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
    <button
      onClick={handleLogout}
      disabled={loading}
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      <LogOut className="h-4 w-4" />
      {loading ? 'Saliendo...' : 'Salir'}
    </button>
    {error ? <span role="alert" className="text-xs text-rose-700">{error}</span> : null}
    </span>
  );
}
