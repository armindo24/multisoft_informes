'use client';

import { ExternalLink, Rocket, Settings2, ShieldCheck, Users, UserSquare2, Database, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DbConfigPanel } from '@/components/configuracion/db-config-panel';
import { EmailConfigPanel } from '@/components/configuracion/email-config-panel';
import { UserCompanyPanel } from '@/components/configuracion/user-company-panel';
import { ActiveSessionsPanel } from '@/components/configuracion/active-sessions-panel';
import { UsersPanel } from '@/components/configuracion/users-panel';
import { GroupsPanel } from '@/components/configuracion/groups-panel';
import type { SessionUser } from '@/lib/auth';

type AdminItem = {
  id: string;
  aliases?: string[];
  title: string;
  description: string;
  legacyHref: string;
  legacyLabel: string;
  icon: typeof Users;
  migrated?: boolean;
};

const LEGACY_BASE_URL = 'http://10.0.0.22:8000';

const adminItems: AdminItem[] = [
  {
    id: 'usuarios',
    title: 'Usuarios',
    description: 'Gestion de usuarios del sistema, perfiles internos y permisos basicos del nuevo frontend.',
    legacyHref: `${LEGACY_BASE_URL}/admin/auth/user/`,
    legacyLabel: 'Abrir usuarios en Django Admin',
    icon: Users,
    migrated: true,
  },
  {
    id: 'grupos',
    title: 'Grupos',
    description: 'Organizacion de permisos por grupo para replicar la estructura administrativa actual.',
    legacyHref: `${LEGACY_BASE_URL}/admin/auth/group/`,
    legacyLabel: 'Abrir grupos en Django Admin',
    icon: ShieldCheck,
    migrated: true,
  },
  {
    id: 'asignacion-empresas',
    aliases: ['asignacion-'],
    title: 'Asignacion de Empresas',
    description: 'Relacion entre usuarios y empresas habilitadas, siguiendo la logica del sistema anterior.',
    legacyHref: `${LEGACY_BASE_URL}/custom_permissions/asignar_empresa_usuario/`,
    legacyLabel: 'Abrir asignacion de empresas',
    icon: UserSquare2,
    migrated: true,
  },
  {
    id: 'usuarios-conectados',
    aliases: ['usuarios-'],
    title: 'Usuarios Conectados',
    description: 'Vista preparada para monitorear sesiones activas y actividad reciente de acceso.',
    legacyHref: `${LEGACY_BASE_URL}/custom_permissions/active_sessions/`,
    legacyLabel: 'Abrir usuarios conectados',
    icon: Users,
    migrated: true,
  },
  {
    id: 'configuracion-base-datos',
    aliases: ['configuracion-base-datosconectados'],
    title: 'Configuracion de Base de Datos',
    description: 'Punto de entrada para revisar motores, conexiones y parametros del backend conectado.',
    legacyHref: `${LEGACY_BASE_URL}/custom_permissions/db_config/`,
    legacyLabel: 'Abrir configuracion de base de datos',
    icon: Database,
    migrated: true,
  },
  {
    id: 'configuracion-email',
    title: 'Configuracion de Email',
    description: 'Seccion reservada para SMTP, remitentes y pruebas de notificaciones del sistema.',
    legacyHref: `${LEGACY_BASE_URL}/custom_permissions/email_config/`,
    legacyLabel: 'Abrir configuracion de email',
    icon: Mail,
    migrated: true,
  },
];

function normalizeHash(hash: string) {
  return hash.replace(/^#/, '').trim().toLowerCase();
}

function resolveActiveId(hash: string) {
  const normalized = normalizeHash(hash);
  if (!normalized) return adminItems[0].id;

  const match = adminItems.find((item) => item.id === normalized || item.aliases?.includes(normalized));
  return match?.id || adminItems[0].id;
}

type ConfigAdminWorkspaceProps = {
  currentUser: SessionUser | null;
};

export function ConfigAdminWorkspace({ currentUser }: ConfigAdminWorkspaceProps) {
  const visibleItems = currentUser?.isSuperuser
    ? adminItems
    : adminItems.filter((item) => item.id !== 'grupos' && item.id !== 'usuarios-conectados');

  const [activeId, setActiveId] = useState(visibleItems[0]?.id || adminItems[0].id);

  useEffect(() => {
    function syncFromHash() {
      const resolved = resolveActiveId(window.location.hash);
      const isAllowed = visibleItems.some((item) => item.id === resolved);
      setActiveId(isAllowed ? resolved : visibleItems[0]?.id || adminItems[0].id);
    }

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [visibleItems]);

  const activeItem = visibleItems.find((item) => item.id === activeId) || visibleItems[0] || adminItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <section className="space-y-4">
      <div className="space-y-4">
        <article
          id={activeItem.id}
          className="card scroll-mt-28 border-cyan-200 p-6 shadow-[0_0_0_1px_rgba(8,145,178,0.12)] transition"
        >
          {activeItem.aliases?.map((alias) => <div key={alias} id={alias} className="scroll-mt-28" />)}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                <ActiveIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Admin</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{activeItem.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{activeItem.description}</p>
              </div>
            </div>

            {activeItem.migrated ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">
                <Rocket className="h-4 w-4" />
                Modulo migrado en Next
              </div>
            ) : (
              <a
                href={activeItem.legacyHref}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <ExternalLink className="h-4 w-4" />
                {activeItem.legacyLabel}
              </a>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 text-slate-800">
              <Settings2 className="h-4 w-4" />
              <span className="font-medium">{activeItem.migrated ? 'Panel activo en Next.js' : 'Acceso preparado'}</span>
            </div>
            <p className="mt-2 leading-6">
              {activeItem.migrated
                ? 'Esta opcion ya funciona dentro del frontend nuevo. El enlace heredado pasa a ser opcional y ya no ocupa el foco principal de la pantalla.'
                : 'Esta opcion ya responde al hash de la URL y te deja abrir el modulo real heredado mientras seguimos migrando la funcionalidad al frontend nuevo.'}
            </p>
          </div>

          {activeItem.id === 'configuracion-base-datos' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <DbConfigPanel />
            </div>
          ) : null}

          {activeItem.id === 'configuracion-email' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <EmailConfigPanel />
            </div>
          ) : null}

          {activeItem.id === 'asignacion-empresas' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <UserCompanyPanel />
            </div>
          ) : null}

          {activeItem.id === 'usuarios-conectados' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <ActiveSessionsPanel />
            </div>
          ) : null}

          {activeItem.id === 'usuarios' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <UsersPanel currentUser={currentUser} />
            </div>
          ) : null}

          {activeItem.id === 'grupos' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <GroupsPanel />
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
