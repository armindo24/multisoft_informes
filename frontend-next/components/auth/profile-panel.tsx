'use client';

import { Save, ShieldCheck, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';

type ProfileUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  dateJoined: string | null;
};

type UserCompanyAssignment = {
  empresa: string;
  db: 'Integrado' | 'Sueldo';
};

type ProfilePanelProps = {
  initialUser: ProfileUser;
  initialGroups: string[];
  initialAssignments: UserCompanyAssignment[];
};

export function ProfilePanel({ initialUser, initialGroups, initialAssignments }: ProfilePanelProps) {
  const [form, setForm] = useState({
    username: initialUser.username,
    firstName: initialUser.firstName,
    lastName: initialUser.lastName,
    email: initialUser.email,
    password: '',
  });
  const [groups, setGroups] = useState(initialGroups);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [dateJoined, setDateJoined] = useState(initialUser.dateJoined);
  const [isActive, setIsActive] = useState(initialUser.isActive);
  const [isSuperuser, setIsSuperuser] = useState(initialUser.isSuperuser);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displayName = useMemo(() => {
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();
    return fullName || form.username;
  }, [form.firstName, form.lastName, form.username]);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: {
        user?: ProfileUser;
        groups?: string[];
        assignments?: UserCompanyAssignment[];
      };
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data?.user) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo guardar el perfil.' });
      setSaving(false);
      return;
    }

    setForm({
      username: payload.data.user.username,
      firstName: payload.data.user.firstName,
      lastName: payload.data.user.lastName,
      email: payload.data.user.email,
      password: '',
    });
    setGroups(payload.data.groups || []);
    setAssignments(payload.data.assignments || []);
    setDateJoined(payload.data.user.dateJoined);
    setIsActive(payload.data.user.isActive);
    setIsSuperuser(payload.data.user.isSuperuser);
    setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className={['rounded-2xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Mi perfil</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{displayName}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Desde aqui puedes actualizar tus datos personales y mantener tu acceso al sistema sin entrar al panel general de usuarios.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Usuario</span>
              <input
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Nombre</span>
              <input
                value={form.firstName}
                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Apellido</span>
              <input
                value={form.lastName}
                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700 md:col-span-2">
              <span className="mb-2 block font-medium">Nueva contrasena</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Dejar vacio para mantener la actual"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              />
            </label>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Acceso</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Estado</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{isActive ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Nivel</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{isSuperuser ? 'Administrador total' : 'Usuario con permisos asignados'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Alta</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{dateJoined ? new Date(dateJoined).toLocaleString('es-PY') : '-'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldCheck className="h-4 w-4 text-cyan-700" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Grupos asignados</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {groups.length ? groups.map((group) => (
                <span key={group} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800">
                  {group}
                </span>
              )) : (
                <p className="text-sm text-slate-500">No hay grupos asignados.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Empresas habilitadas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {assignments.length ? assignments.map((assignment) => (
                <span key={`${assignment.db}-${assignment.empresa}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                  {assignment.empresa} · {assignment.db}
                </span>
              )) : (
                <p className="text-sm text-slate-500">No hay empresas asignadas a este usuario.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
