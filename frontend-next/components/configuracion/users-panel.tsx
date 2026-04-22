'use client';

import { Plus, Save, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { SessionUser } from '@/lib/auth';

type AdminGroupRecord = {
  id: number;
  name: string;
};

type AdminUserDetail = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  isStaff: boolean;
  dateJoined: string | null;
  groups: number[];
};

type Payload = {
  users: AdminUserDetail[];
  groups: AdminGroupRecord[];
  permissions?: {
    canManageAllUsers?: boolean;
    canCreateUsers?: boolean;
    canEditPermissions?: boolean;
    currentUserId?: number;
  };
};

type FormState = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  groups: number[];
  password: string;
};

const emptyForm: FormState = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isActive: true,
  isSuperuser: false,
  groups: [],
  password: '',
};

type UsersPanelProps = {
  currentUser: SessionUser | null;
};

export function UsersPanel({ currentUser }: UsersPanelProps) {
  const [users, setUsers] = useState<AdminUserDetail[]>([]);
  const [groups, setGroups] = useState<AdminGroupRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | 'new'>('new');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [permissions, setPermissions] = useState({
    canManageAllUsers: false,
    canCreateUsers: false,
    canEditPermissions: false,
    currentUserId: currentUser?.id,
  });

  function prepareNewUser() {
    if (!permissions.canCreateUsers) {
      return;
    }
    setSelectedUserId('new');
    setForm(emptyForm);
    setMessage(null);
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await fetch('/api/config/users', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: Payload; message?: string };

      if (!response.ok || !payload.ok || !payload.data) {
        setMessage({ type: 'error', text: payload.message || 'No se pudo cargar usuarios.' });
        setLoading(false);
        return;
      }

      setUsers(payload.data.users);
      setGroups(payload.data.groups);
      setPermissions({
        canManageAllUsers: Boolean(payload.data.permissions?.canManageAllUsers),
        canCreateUsers: Boolean(payload.data.permissions?.canCreateUsers),
        canEditPermissions: Boolean(payload.data.permissions?.canEditPermissions),
        currentUserId: payload.data.permissions?.currentUserId || currentUser?.id,
      });

      if (payload.data.users[0]) {
        selectUser(payload.data.users[0], payload.data.groups);
        setSelectedUserId(payload.data.users[0].id);
      }

      setLoading(false);
    }

    void load();
  }, []);

  function selectUser(user: AdminUserDetail | null, availableGroups = groups) {
    if (!user) {
      setForm(emptyForm);
      return;
    }

    setForm({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      isSuperuser: user.isSuperuser,
      groups: user.groups.filter((groupId) => availableGroups.some((group) => group.id === groupId)),
      password: '',
    });
  }

  const selectedUser = useMemo(
    () => (selectedUserId === 'new' ? null : users.find((user) => user.id === selectedUserId) || null),
    [selectedUserId, users],
  );

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) => {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').toLowerCase();
      return user.username.toLowerCase().includes(normalized) || fullName.includes(normalized) || user.email.toLowerCase().includes(normalized);
    });
  }, [query, users]);

  function toggleGroup(groupId: number) {
    setForm((current) => ({
      ...current,
      groups: current.groups.includes(groupId)
        ? current.groups.filter((item) => item !== groupId)
        : [...current.groups, groupId],
    }));
  }

  async function save() {
    if (!permissions.canCreateUsers && selectedUserId === 'new') {
      setMessage({ type: 'error', text: 'No tienes permiso para crear usuarios.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/config/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: {
        saved?: AdminUserDetail;
        users?: AdminUserDetail[];
        groups?: AdminGroupRecord[];
        permissions?: Payload['permissions'];
      };
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data?.users || !payload.data?.groups) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo guardar el usuario.' });
      setSaving(false);
      return;
    }

    setUsers(payload.data.users);
    setGroups(payload.data.groups);
    setPermissions((current) => ({
      ...current,
      canManageAllUsers: Boolean(payload.data?.permissions?.canManageAllUsers ?? current.canManageAllUsers),
      canCreateUsers: Boolean(payload.data?.permissions?.canCreateUsers ?? current.canCreateUsers),
      canEditPermissions: Boolean(payload.data?.permissions?.canEditPermissions ?? current.canEditPermissions),
      currentUserId: payload.data?.permissions?.currentUserId || current.currentUserId,
    }));
    if (payload.data.saved) {
      setSelectedUserId(payload.data.saved.id);
      selectUser(payload.data.saved, payload.data.groups);
    }
    setMessage({ type: 'success', text: 'Usuario guardado correctamente.' });
    setSaving(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Usuarios</h3>
          {permissions.canCreateUsers ? (
            <button
              type="button"
              onClick={prepareNewUser}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Agregar usuario
            </button>
          ) : null}
        </div>

        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Buscar usuario</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Usuario, nombre o email"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          />
        </label>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {filteredUsers.map((user) => {
              const active = selectedUserId === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(user.id);
                    selectUser(user);
                    setMessage(null);
                  }}
                  className={[
                    'w-full rounded-2xl border px-4 py-3 text-left transition',
                    active ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:bg-slate-50',
                  ].join(' ')}
                >
                  <p className="font-medium text-slate-900">{user.username}</p>
                  <p className="mt-1 text-sm text-slate-600">{[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Sin nombre'}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white px-2 py-1">{user.email || 'Sin email'}</span>
                    <span className={['rounded-full px-2 py-1', user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'].join(' ')}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {message ? (
          <div className={['rounded-xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
            {message.text}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Edicion</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {selectedUser ? `Editar usuario: ${selectedUser.username}` : 'Nuevo usuario'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {permissions.canManageAllUsers
                ? selectedUser
                  ? 'Actualiza los datos, grupos y estado del usuario seleccionado.'
                  : 'Completa los datos basicos para crear un nuevo usuario dentro del sistema.'
                : 'Aqui solo puedes actualizar tu propio perfil. Los permisos y otros usuarios quedan reservados para el administrador total.'}
            </p>
          </div>

          {permissions.canCreateUsers ? (
            <button
              type="button"
              onClick={prepareNewUser}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-800 transition hover:bg-cyan-50"
            >
              <UserPlus className="h-4 w-4" />
              Nuevo usuario
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : selectedUser ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            <span className="mb-2 block font-medium">Usuario</span>
            <input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          </label>
          <label className="text-sm text-slate-700">
            <span className="mb-2 block font-medium">Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          </label>
          <label className="text-sm text-slate-700">
            <span className="mb-2 block font-medium">Nombre</span>
            <input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          </label>
          <label className="text-sm text-slate-700">
            <span className="mb-2 block font-medium">Apellido</span>
            <input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            <span className="mb-2 block font-medium">{selectedUser ? 'Cambiar contrasena' : 'Contrasena inicial'}</span>
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder={selectedUser ? 'Dejar vacio para mantener actual' : 'Si queda vacio se usara admin'} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              disabled={!permissions.canEditPermissions}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            />
            <span>Usuario activo</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isSuperuser}
              disabled={!permissions.canEditPermissions}
              onChange={(event) => setForm((current) => ({ ...current, isSuperuser: event.target.checked }))}
            />
            <span>Administrador total</span>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">Grupos</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {groups.map((group) => (
              <label key={group.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={form.groups.includes(group.id)} disabled={!permissions.canEditPermissions} onChange={() => toggleGroup(group.id)} />
                <span>{group.name}</span>
              </label>
            ))}
          </div>
          {!permissions.canEditPermissions ? (
            <p className="mt-3 text-sm text-slate-500">Tus grupos se muestran solo como referencia. La asignacion de permisos la realiza un administrador total.</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {saving ? 'Guardando...' : selectedUser ? 'Guardar cambios' : 'Crear usuario'}
          </button>
          {selectedUser ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
              Alta: {selectedUser.dateJoined ? new Date(selectedUser.dateJoined).toLocaleString('es-PY') : '-'}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
