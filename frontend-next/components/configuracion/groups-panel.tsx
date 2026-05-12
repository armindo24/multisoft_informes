'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Save, ShieldCheck, Trash2, Users } from 'lucide-react';

type AdminGroupDetail = {
  id: number;
  name: string;
  userCount: number;
  permissionsCount: number;
};

type Payload = {
  groups: AdminGroupDetail[];
};

const emptyForm = {
  name: '',
};

export function GroupsPanel() {
  const [groups, setGroups] = useState<AdminGroupDetail[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | 'new'>('new');
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function prepareNewGroup() {
    setSelectedGroupId('new');
    setForm(emptyForm);
    setMessage(null);
  }

  useEffect(() => {
    void loadGroups();
  }, []);

  async function loadGroups() {
    setLoading(true);
    const response = await fetch('/api/config/groups', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: Payload; message?: string };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo cargar grupos.' });
      setLoading(false);
      return;
    }

    const loadedGroups = payload.data.groups || [];
    setGroups(loadedGroups);
    if (loadedGroups[0]) {
      setSelectedGroupId(loadedGroups[0].id);
      setForm({ name: loadedGroups[0].name });
    } else {
      setSelectedGroupId('new');
      setForm(emptyForm);
    }
    setLoading(false);
  }

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return groups;
    return groups.filter((group) => group.name.toLowerCase().includes(normalized));
  }, [groups, query]);

  const selectedGroup = useMemo(
    () => (selectedGroupId === 'new' ? null : groups.find((group) => group.id === selectedGroupId) || null),
    [groups, selectedGroupId],
  );

  async function save() {
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/config/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedGroup?.id,
        name: form.name,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: { saved?: AdminGroupDetail; groups?: AdminGroupDetail[] }; message?: string };

    if (!response.ok || !payload.ok || !payload.data?.groups) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo guardar el grupo.' });
      setSaving(false);
      return;
    }

    setGroups(payload.data.groups);
    if (payload.data.saved) {
      setSelectedGroupId(payload.data.saved.id);
      setForm({ name: payload.data.saved.name });
    }
    setMessage({ type: 'success', text: 'Grupo guardado correctamente.' });
    setSaving(false);
  }

  async function deleteSelectedGroup() {
    if (!selectedGroup || deleting) return;

    const confirmed = window.confirm(`Eliminar el grupo "${selectedGroup.name}"? Esta accion no se puede deshacer.`);
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    const response = await fetch('/api/config/groups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedGroup.id }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: { groups?: AdminGroupDetail[] }; message?: string };

    if (!response.ok || !payload.ok || !payload.data?.groups) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo eliminar el grupo.' });
      setDeleting(false);
      return;
    }

    const nextGroups = payload.data.groups;
    setGroups(nextGroups);
    if (nextGroups[0]) {
      setSelectedGroupId(nextGroups[0].id);
      setForm({ name: nextGroups[0].name });
    } else {
      prepareNewGroup();
    }
    setMessage({ type: 'success', text: 'Grupo eliminado correctamente.' });
    setDeleting(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Grupos</h3>
          <button
            type="button"
            onClick={prepareNewGroup}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            Agregar grupo
          </button>
        </div>

        <button
          type="button"
          onClick={() => void loadGroups()}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={['h-4 w-4', loading ? 'animate-spin' : ''].join(' ')} />
          Recargar grupos
        </button>

        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Buscar grupo</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre del grupo"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          />
        </label>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {filteredGroups.map((group) => {
              const active = selectedGroupId === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setForm({ name: group.name });
                    setMessage(null);
                  }}
                  className={[
                    'w-full rounded-2xl border px-4 py-3 text-left transition',
                    active ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:bg-slate-50',
                  ].join(' ')}
                >
                  <p className="font-medium text-slate-900">{group.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white px-2 py-1">{group.userCount} usuarios</span>
                    <span className="rounded-full bg-white px-2 py-1">{group.permissionsCount} permisos</span>
                  </div>
                </button>
              );
            })}
            {filteredGroups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                {groups.length === 0
                  ? 'No se recibieron grupos desde PostgreSQL. Usa Recargar grupos o revisa el servicio Next si acabas de actualizar.'
                  : 'No hay grupos que coincidan con la busqueda.'}
              </div>
            ) : null}
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
              {selectedGroup ? `Editar grupo: ${selectedGroup.name}` : 'Nuevo grupo'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {selectedGroup ? 'Actualiza el nombre y revisa el alcance actual del grupo seleccionado.' : 'Crea un grupo nuevo para organizar usuarios y permisos del sistema.'}
            </p>
          </div>

          <button
            type="button"
            onClick={prepareNewGroup}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-800 transition hover:bg-cyan-50"
          >
            <Plus className="h-4 w-4" />
            Nuevo grupo
          </button>

          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : selectedGroup ? 'Guardar cambios' : 'Crear grupo'}
          </button>

          {selectedGroup ? (
            <button
              type="button"
              onClick={() => void deleteSelectedGroup()}
              disabled={deleting || saving || selectedGroup.userCount > 0}
              title={selectedGroup.userCount > 0 ? 'Quita primero los usuarios asignados a este grupo.' : 'Eliminar grupo'}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? 'Eliminando...' : 'Eliminar grupo'}
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="text-sm text-slate-700">
            <span className="mb-2 block font-medium">Nombre del grupo</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ name: event.target.value })}
              placeholder="Ejemplo: Gerencia"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            />
          </label>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-slate-900">
                <Users className="h-4 w-4" />
                <span className="font-medium">Usuarios asignados</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{selectedGroup?.userCount ?? 0}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-medium">Permisos vinculados</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{selectedGroup?.permissionsCount ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Guardando...' : selectedGroup ? 'Guardar cambios' : 'Crear grupo'}
          </button>
          {selectedGroup ? (
            <button
              type="button"
              onClick={() => void deleteSelectedGroup()}
              disabled={deleting || saving || selectedGroup.userCount > 0}
              title={selectedGroup.userCount > 0 ? 'Quita primero los usuarios asignados a este grupo.' : 'Eliminar grupo'}
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar grupo'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
