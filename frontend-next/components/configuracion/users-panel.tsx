'use client';

import { Plus, Save, Trash2, Search, ShieldCheck, KeyRound, UserRound } from 'lucide-react';
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
  maxSessionsPerUser: number;
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
  maxSessionsPerUser: number;
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
  maxSessionsPerUser: 3,
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
  const [deleting, setDeleting] = useState(false);
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
      maxSessionsPerUser: user.maxSessionsPerUser || 3,
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

  async function deleteSelectedUser() {
    if (!selectedUser || !permissions.canManageAllUsers) return;
    if (selectedUser.id === permissions.currentUserId) {
      setMessage({ type: 'error', text: 'No puedes eliminar tu propio usuario conectado.' });
      return;
    }

    const confirmed = window.confirm(`Eliminar el usuario "${selectedUser.username}"? Esta accion no se puede deshacer.`);
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    const response = await fetch('/api/config/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedUser.id }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: {
        users?: AdminUserDetail[];
        groups?: AdminGroupRecord[];
        permissions?: Payload['permissions'];
      };
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data?.users || !payload.data?.groups) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo eliminar el usuario.' });
      setDeleting(false);
      return;
    }

    setUsers(payload.data.users);
    setGroups(payload.data.groups);
    if (payload.data.permissions) {
      setPermissions({
        canManageAllUsers: Boolean(payload.data.permissions.canManageAllUsers),
        canCreateUsers: Boolean(payload.data.permissions.canCreateUsers),
        canEditPermissions: Boolean(payload.data.permissions.canEditPermissions),
        currentUserId: payload.data.permissions.currentUserId || currentUser?.id,
      });
    }

    if (payload.data.users[0]) {
      setSelectedUserId(payload.data.users[0].id);
      selectUser(payload.data.users[0], payload.data.groups);
    } else {
      setSelectedUserId('new');
      setForm(emptyForm);
    }

    setMessage({ type: 'success', text: 'Usuario eliminado correctamente.' });
    setDeleting(false);
  }

  const inputClass = 'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/10 disabled:bg-slate-50 disabled:text-slate-500';
  const busy = saving || deleting || loading;

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]">
      <aside className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Directorio <span className="ml-1 text-xs font-normal text-slate-500">({users.length})</span></h3>
            {permissions.canCreateUsers ? <button type="button" disabled={busy} onClick={prepareNewUser} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"><Plus className="h-3.5 w-3.5" />Nuevo</button> : null}
          </div>
          <label className="relative mt-4 block">
            <span className="sr-only">Buscar usuario</span>
            <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario, nombre o correo" className={inputClass + ' pl-9'} />
          </label>
          <p className="mt-2 text-xs text-slate-500">{query ? `${filteredUsers.length} resultado(s)` : `${users.filter((user) => user.isActive).length} activos`}</p>
        </div>
        <div className="max-h-[250px] overflow-y-auto p-2 lg:max-h-[600px]">
          {loading ? <div className="space-y-2 p-2">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-slate-200/60" />)}</div> : filteredUsers.length === 0 ? <p className="px-3 py-8 text-center text-sm text-slate-500">{query ? 'No se encontraron usuarios.' : 'No hay usuarios disponibles.'}</p> : filteredUsers.map((user) => (
            <button key={user.id} type="button" disabled={saving || deleting} aria-pressed={selectedUserId === user.id} onClick={() => { setSelectedUserId(user.id); selectUser(user); setMessage(null); }} className={['mb-1 flex w-full min-w-0 items-start gap-3 rounded-lg border p-3 text-left transition disabled:opacity-50', selectedUserId === user.id ? 'border-cyan-200 bg-cyan-50' : 'border-transparent hover:bg-white'].join(' ')}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold uppercase text-slate-600">{user.username.slice(0, 2)}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-slate-900">{user.username}</span><span title={user.isActive ? 'Activo' : 'Inactivo'} className={['h-2 w-2 shrink-0 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-slate-300'].join(' ')} /><span className="sr-only">{user.isActive ? 'Activo' : 'Inactivo'}</span></span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Sin nombre'}</span>
                <span className="mt-1 block truncate text-xs text-slate-400">{user.email || 'Sin correo'}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <form className="min-w-0" onSubmit={(event) => { event.preventDefault(); void save(); }}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold text-slate-900">{selectedUser ? selectedUser.username : 'Nuevo usuario'}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{permissions.canManageAllUsers ? 'Gestiona el perfil, la seguridad y los permisos de acceso.' : 'Actualiza tus datos personales y tu contraseña.'}</p>
          </div>
          {selectedUser ? <span className={['rounded-full px-2.5 py-1 text-xs font-medium', selectedUser.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'].join(' ')}>{selectedUser.isActive ? 'Activo' : 'Inactivo'}</span> : null}
        </div>
        {message ? <div role={message.type === 'error' ? 'alert' : 'status'} className={['mb-4 rounded-lg border px-4 py-3 text-sm', message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>{message.text}</div> : null}
        <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
          <section>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800"><UserRound className="h-4 w-4 text-cyan-700" />Datos del usuario</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-600"><span className="mb-1.5 block">Usuario <span className="text-cyan-700">*</span></span><input required autoComplete="off" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className={inputClass} /></label>
              <label className="text-xs font-medium text-slate-600"><span className="mb-1.5 block">Correo electrónico</span><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className={inputClass} /></label>
              <label className="text-xs font-medium text-slate-600"><span className="mb-1.5 block">Nombre</span><input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className={inputClass} /></label>
              <label className="text-xs font-medium text-slate-600"><span className="mb-1.5 block">Apellido</span><input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className={inputClass} /></label>
            </div>
          </section>
          <section className="border-t border-slate-100 pt-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800"><KeyRound className="h-4 w-4 text-cyan-700" />Seguridad y acceso</h4>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
              <label className="text-xs font-medium text-slate-600"><span className="mb-1.5 block">{selectedUser ? 'Nueva contraseña' : 'Contraseña inicial'}</span><input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder={selectedUser ? 'Dejar vacío para mantener la actual' : 'Si queda vacío se usará admin'} className={inputClass} /></label>
              <label className="text-xs font-medium text-slate-600"><span className="mb-1.5 block">Sesiones permitidas</span><input type="number" min={1} max={20} value={form.maxSessionsPerUser} disabled={!permissions.canEditPermissions} onChange={(event) => setForm((current) => ({ ...current, maxSessionsPerUser: Number(event.target.value || 1) }))} className={inputClass} /></label>
            </div>
            {!selectedUser ? <p className="mt-3 rounded-lg bg-cyan-50 px-3 py-2 text-xs leading-5 text-cyan-800">En el primer ingreso, el usuario deberá elegir una nueva contraseña antes de acceder al panel.</p> : null}
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 rounded-lg bg-slate-50 px-3 py-3">
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="h-4 w-4 accent-cyan-700" checked={form.isActive} disabled={!permissions.canEditPermissions} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />Usuario activo</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="h-4 w-4 accent-cyan-700" checked={form.isSuperuser} disabled={!permissions.canEditPermissions} onChange={(event) => setForm((current) => ({ ...current, isSuperuser: event.target.checked }))} />Administrador total</label>
            </div>
          </section>
          <section className="border-t border-slate-100 pt-4">
            <div className="mb-3 flex items-center justify-between gap-2"><h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800"><ShieldCheck className="h-4 w-4 text-cyan-700" />Grupos y permisos</h4><span className="text-xs text-slate-500">{form.groups.length} seleccionados</span></div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => <label key={group.id} className={['flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm', form.groups.includes(group.id) ? 'border-cyan-200 bg-cyan-50 text-cyan-900' : 'border-slate-200 text-slate-600'].join(' ')}><input type="checkbox" className="h-4 w-4 shrink-0 accent-cyan-700" checked={form.groups.includes(group.id)} disabled={!permissions.canEditPermissions} onChange={() => toggleGroup(group.id)} /><span className="break-words">{group.name}</span></label>)}
            </div>
            {groups.length === 0 ? <p className="text-xs text-slate-500">No hay grupos disponibles.</p> : null}
            {!permissions.canEditPermissions ? <p className="mt-3 text-xs text-slate-500">Los permisos y los grupos son administrados por un administrador total.</p> : null}
          </section>
        </fieldset>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div>{selectedUser && permissions.canManageAllUsers && selectedUser.id !== permissions.currentUserId ? <button type="button" onClick={() => void deleteSelectedUser()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-4 w-4" />{deleting ? 'Eliminando...' : 'Eliminar usuario'}</button> : selectedUser?.dateJoined ? <span className="text-xs text-slate-400">Alta: {new Date(selectedUser.dateJoined).toLocaleDateString('es-PY')}</span> : null}</div>
          <button type="submit" disabled={busy || (!selectedUser && !permissions.canCreateUsers)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Guardando...' : selectedUser ? 'Guardar cambios' : 'Crear usuario'}</button>
        </div>
      </form>
    </div>
  );
}
