'use client';

import { Database, RefreshCcw, Save, PlugZap } from 'lucide-react';
import { useEffect, useState } from 'react';

type DbType = 'postgres' | 'integrado' | 'sueldo';
type DbEngine = 'postgres' | 'sqlanywhere';

type EngineProfile = {
  host: string;
  port: number;
  server: string;
  database: string;
  username: string;
  password: string;
};

type DbConfigRecord = {
  dbType: DbType;
  dbEngine: DbEngine;
  disabled: boolean;
  updatedAt: string | null;
  activeProfile: EngineProfile;
  engineSettings: Record<DbEngine, EngineProfile>;
  status?: {
    enabled?: boolean;
    reason?: string;
    engine?: string;
    configured_engine?: string;
  } | null;
};

const typeLabels: Record<DbType, string> = {
  postgres: 'Postgres (Django)',
  integrado: 'Integrado',
  sueldo: 'Sueldo',
};

function emptyProfile(engine: DbEngine): EngineProfile {
  return {
    host: '',
    port: engine === 'postgres' ? 5432 : 2638,
    server: '',
    database: '',
    username: '',
    password: '',
  };
}

export function DbConfigPanel() {
  const [configs, setConfigs] = useState<Record<DbType, DbConfigRecord> | null>(null);
  const [selectedType, setSelectedType] = useState<DbType>('postgres');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<'save' | 'test' | 'reconnect' | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setMessage(null);

      const response = await fetch('/api/config/db', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: DbConfigRecord[]; message?: string };

      if (!response.ok || !payload.ok || !payload.data) {
        setMessage({ type: 'error', text: payload.message || 'No se pudo cargar la configuracion de base de datos.' });
        setLoading(false);
        return;
      }

      const mapped = payload.data.reduce((acc, item) => {
        acc[item.dbType] = item;
        return acc;
      }, {} as Record<DbType, DbConfigRecord>);

      setConfigs(mapped);
      setLoading(false);
    }

    void load();
  }, []);

  function updateSelected(patch: Partial<DbConfigRecord>) {
    setConfigs((current) => {
      if (!current) return current;
      return {
        ...current,
        [selectedType]: {
          ...current[selectedType],
          ...patch,
        },
      };
    });
  }

  function updateProfile(patch: Partial<EngineProfile>) {
    setConfigs((current) => {
      if (!current) return current;
      const selected = current[selectedType];
      const nextProfile = { ...selected.activeProfile, ...patch };
      return {
        ...current,
        [selectedType]: {
          ...selected,
          activeProfile: nextProfile,
          engineSettings: {
            ...selected.engineSettings,
            [selected.dbEngine]: nextProfile,
          },
        },
      };
    });
  }

  function handleEngineChange(value: DbEngine) {
    setConfigs((current) => {
      if (!current) return current;
      const selected = current[selectedType];
      return {
        ...current,
        [selectedType]: {
          ...selected,
          dbEngine: value,
          activeProfile: selected.engineSettings[value] || emptyProfile(value),
        },
      };
    });
  }

  function resetSelectedConfig() {
    setConfigs((current) => {
      if (!current) return current;
      const selected = current[selectedType];
      const engine = selected.dbEngine;
      return {
        ...current,
        [selectedType]: {
          ...selected,
          disabled: false,
          activeProfile: emptyProfile(engine),
          engineSettings: {
            ...selected.engineSettings,
            [engine]: emptyProfile(engine),
          },
        },
      };
    });
    setMessage(null);
  }

  async function submit(action: 'save' | 'test' | 'reconnect') {
    if (!configs) return;

    const selected = configs[selectedType];
    setSubmitting(action);
    setMessage(null);

    const response = await fetch('/api/config/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dbType: selected.dbType,
        dbEngine: selected.dbEngine,
        disabled: selected.disabled,
        action,
        ...selected.activeProfile,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; data?: DbConfigRecord; message?: string };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo procesar la configuracion.' });
      setSubmitting(null);
      return;
    }

    setConfigs((current) => current ? { ...current, [payload.data!.dbType]: payload.data! } : current);
    setMessage({
      type: 'success',
      text:
        action === 'test'
          ? 'Conexion verificada correctamente.'
          : action === 'reconnect'
            ? 'Reconectado correctamente.'
            : 'Configuracion guardada correctamente.',
    });
    setSubmitting(null);
  }

  const selected = configs?.[selectedType];
  const statusText = selected?.status
    ? selected.status.enabled === false
      ? `Con incidencia${selected.status.reason ? `: ${selected.status.reason}` : ''}`
      : `Activa${selected.status.engine ? ` (${selected.status.engine})` : ''}`
    : 'Sin estado';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['postgres', 'integrado', 'sueldo'] as DbType[]).map((dbType) => (
          <button
            key={dbType}
            type="button"
            onClick={() => setSelectedType(dbType)}
            className={[
              'rounded-xl border px-4 py-2 text-sm font-medium transition',
              selectedType === dbType ? 'border-cyan-300 bg-cyan-50 text-cyan-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            {typeLabels[dbType]}
          </button>
        ))}
      </div>

      {message ? (
        <div className={['rounded-xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
          {message.text}
        </div>
      ) : null}

      {!selected || loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">Cargando configuracion de base de datos...</div>
      ) : (
        <div className="grid gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Conexion activa</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {typeLabels[selectedType]}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Prepara una nueva configuracion, valida la conexion y aplica cambios sobre la base seleccionada.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetSelectedConfig}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-800 transition hover:bg-cyan-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Nueva configuracion
              </button>
              <button
                type="button"
                onClick={() => void submit('test')}
                disabled={submitting !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-60"
              >
                <PlugZap className="h-4 w-4" />
                {submitting === 'test' ? 'Probando...' : 'Probar conexion'}
              </button>
              <button
                type="button"
                onClick={() => void submit('save')}
                disabled={submitting !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {submitting === 'save' ? 'Guardando...' : 'Guardar configuracion'}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="mb-2 block font-medium text-slate-900">Motor</span>
              <select
                value={selected.dbEngine}
                disabled={selected.dbType === 'postgres'}
                onChange={(event) => handleEngineChange(event.target.value as DbEngine)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <option value="postgres">PostgreSQL</option>
                <option value="sqlanywhere">Sybase SQL Anywhere</option>
              </select>
            </label>

            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="mb-2 block font-medium text-slate-900">Estado actual</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Database className="h-4 w-4 text-cyan-700" />
                <span>{statusText}</span>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={selected.disabled}
                onChange={(event) => updateSelected({ disabled: event.target.checked })}
              />
              <span>Deshabilitar conexion para esta base</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Host</span>
              <input value={selected.activeProfile.host} onChange={(event) => updateProfile({ host: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Puerto</span>
              <input type="number" value={selected.activeProfile.port} onChange={(event) => updateProfile({ port: Number(event.target.value || 0) })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Servidor</span>
              <input value={selected.activeProfile.server} onChange={(event) => updateProfile({ server: event.target.value })} disabled={selected.dbEngine === 'postgres'} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 disabled:bg-slate-100" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Base de datos</span>
              <input value={selected.activeProfile.database} onChange={(event) => updateProfile({ database: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Usuario</span>
              <input value={selected.activeProfile.username} onChange={(event) => updateProfile({ username: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Contrasena</span>
              <input type="password" value={selected.activeProfile.password} onChange={(event) => updateProfile({ password: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void submit('save')} disabled={submitting !== null} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {submitting === 'save' ? 'Guardando...' : 'Guardar configuracion'}
            </button>
            <button type="button" onClick={() => void submit('test')} disabled={submitting !== null} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-60">
              {submitting === 'test' ? 'Probando...' : 'Probar conexion'}
            </button>
            {(selected.dbType === 'integrado' || selected.dbType === 'sueldo') ? (
              <button type="button" onClick={() => void submit('reconnect')} disabled={submitting !== null} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 disabled:opacity-60">
                {submitting === 'reconnect' ? 'Reconectando...' : 'Reconectar'}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
