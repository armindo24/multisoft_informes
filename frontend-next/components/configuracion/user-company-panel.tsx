'use client';

import { Building2, RefreshCcw, Save, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type AdminUserRecord = {
  id: number;
  username: string;
  displayName: string;
  isActive: boolean;
};

type CompanyAccessOption = {
  key: string;
  empresa: string;
  label: string;
  db: 'Integrado' | 'Sueldo';
};

type UserCompanyAssignment = {
  empresa: string;
  db: 'Integrado' | 'Sueldo';
};

type LoadPayload = {
  users: AdminUserRecord[];
  options: CompanyAccessOption[];
  assignments: UserCompanyAssignment[];
};

function assignmentKey(item: UserCompanyAssignment) {
  return `${item.empresa}-${item.db}`;
}

export function UserCompanyPanel() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [options, setOptions] = useState<CompanyAccessOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [assignmentCache, setAssignmentCache] = useState<Record<number, string[]>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedUser = users.find((user) => user.id === selectedUserId) || null;

  function resetAssignmentSelection() {
    setQuery('');
    setSelectedValues([]);
    setMessage(null);
  }

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      const response = await fetch('/api/config/user-company', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: LoadPayload; message?: string };

      if (!response.ok || !payload.ok || !payload.data) {
        setMessage({ type: 'error', text: payload.message || 'No se pudo cargar la asignacion de empresas.' });
        setLoading(false);
        return;
      }

      setUsers(payload.data.users);
      setOptions(payload.data.options);

      const firstUserId = payload.data.users[0]?.id || 0;
      setSelectedUserId(firstUserId);
      const initialAssignments = payload.data.assignments.map(assignmentKey);
      setSelectedValues(initialAssignments);
      if (firstUserId) {
        setAssignmentCache({ [firstUserId]: initialAssignments });
      }
      setLoading(false);
    }

    void loadInitial();
  }, []);

  async function loadAssignments(userId: number) {
    const cached = assignmentCache[userId];
    if (cached) {
      setSelectedValues(cached);
      return;
    }

    setLoadingAssignments(true);
    const response = await fetch(`/api/config/user-company?userId=${userId}`, { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: LoadPayload; message?: string };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo cargar las empresas del usuario.' });
      setLoadingAssignments(false);
      return;
    }

    const nextAssignments = payload.data.assignments.map(assignmentKey);
    setSelectedValues(nextAssignments);
    setAssignmentCache((current) => ({ ...current, [userId]: nextAssignments }));
    setLoadingAssignments(false);
  }

  function warmAssignments(userId: number) {
    if (!userId || assignmentCache[userId] || loadingAssignments) {
      return;
    }

    void loadAssignments(userId);
  }

  const groupedOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const visibleOptions = normalized
      ? options.filter((item) => item.label.toLowerCase().includes(normalized) || item.empresa.toLowerCase().includes(normalized))
      : options;

    return {
      Integrado: visibleOptions.filter((item) => item.db === 'Integrado'),
      Sueldo: visibleOptions.filter((item) => item.db === 'Sueldo'),
    };
  }, [options, query]);

  const selectedOptionLabels = useMemo(() => (
    options
      .filter((item) => selectedValues.includes(item.key))
      .map((item) => item.label)
  ), [options, selectedValues]);

  function toggleValue(value: string) {
    setSelectedValues((current) => (
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    ));
  }

  async function handleSave() {
    if (!selectedUserId) {
      setMessage({ type: 'error', text: 'Seleccione un usuario.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/config/user-company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUserId,
        values: selectedValues,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };

    if (!response.ok || !payload.ok) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo guardar la asignacion de empresas.' });
      setSaving(false);
      return;
    }

    setAssignmentCache((current) => ({ ...current, [selectedUserId]: [...selectedValues] }));
    setMessage({ type: 'success', text: 'Asignacion de empresas guardada correctamente.' });
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className={['rounded-xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">Buscar empresa</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Codigo o descripcion"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">Cargando usuarios y empresas...</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Asignacion</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {selectedUser ? `Empresas para ${selectedUser.username}` : 'Asignacion de empresas'}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Selecciona un usuario y arma una nueva combinacion de empresas habilitadas por sistema.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetAssignmentSelection}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-800 transition hover:bg-cyan-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Nueva asignacion
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Guardando...' : 'Guardar asignacion'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Buscar empresa</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Codigo o descripcion"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">Usuario</span>
            <select
              value={selectedUserId}
              onChange={(event) => {
                const userId = Number(event.target.value || 0);
                setSelectedUserId(userId);
                setSelectedValues([]);
                setMessage(null);
                if (userId) {
                  void loadAssignments(userId);
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} {user.displayName !== user.username ? `· ${user.displayName}` : ''} {user.isActive ? '' : '(Inactivo)'}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Empresas asignadas</p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedUser ? `Usuario actual: ${selectedUser.username}` : 'Selecciona un usuario para continuar.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                onMouseEnter={() => warmAssignments(selectedUserId)}
                onFocus={() => warmAssignments(selectedUserId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Building2 className="h-4 w-4" />
                Elegir empresas
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedOptionLabels.length > 0 ? (
                selectedOptionLabels.map((label) => (
                  <span key={label} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm text-cyan-900">
                    {label}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">Todavia no hay empresas seleccionadas para este usuario.</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setSelectedValues([])} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
              Limpiar seleccion
            </button>
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar asignacion'}
            </button>
          </div>
        </div>
      )}

      {pickerOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Asignacion de Empresas</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">
                  {selectedUser ? `Elegir empresas para ${selectedUser.username}` : 'Elegir empresas'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-6 py-5">
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Buscar empresa</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Codigo o descripcion"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                />
              </label>

              {loadingAssignments ? (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                  Actualizando asignaciones del usuario en segundo plano...
                </div>
              ) : null}

              <div className="grid gap-4 xl:grid-cols-2">
                {(['Integrado', 'Sueldo'] as const).map((db) => (
                  <section key={db} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{db}</h3>
                    <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                      {groupedOptions[db].length === 0 ? (
                        <p className="text-sm text-slate-500">No hay empresas disponibles para este sistema.</p>
                      ) : (
                        groupedOptions[db].map((option) => {
                          const checked = selectedValues.includes(option.key);

                          return (
                            <label key={option.key} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                              <input type="checkbox" checked={checked} onChange={() => toggleValue(option.key)} className="mt-1" />
                              <span>{option.label}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
              >
                Confirmar seleccion
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
