'use client';

import { LogOut } from 'lucide-react';

const LOGIN_PATH = '/login';

export function LogoutButton() {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.assign(LOGIN_PATH);
  }

  return (
    <button
      onClick={handleLogout}
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      <LogOut className="h-4 w-4" />
      Salir
    </button>
  );
}
