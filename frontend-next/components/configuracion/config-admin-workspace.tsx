'use client';

import { ExternalLink, ShieldCheck, Users, UserSquare2, Database, Mail, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DbConfigPanel } from '@/components/configuracion/db-config-panel';
import { EmailConfigPanel } from '@/components/configuracion/email-config-panel';
import { BrandingConfigPanel } from '@/components/configuracion/branding-config-panel';
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
    id: 'marca-corporativa',
    title: 'Marca Corporativa',
    description: 'Logo, nombre comercial y favicon por empresa para que el cliente pueda gestionar su propia identidad visual.',
    legacyHref: `${LEGACY_BASE_URL}/custom_permissions/db_config/`,
    legacyLabel: 'Abrir marca corporativa',
    icon: ImageIcon,
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
    : adminItems.filter((item) => item.id !== 'grupos' && item.id !== 'usuarios-conectados' && item.id !== 'marca-corporativa');

  const [activeId, setActiveId] = useState(visibleItems[0]?.id || adminItems[0].id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeId]);

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
          className={activeItem.id === 'usuarios' ? 'card scroll-mt-28 border-slate-200 p-4 sm:p-5' : 'card scroll-mt-28 border-cyan-200 p-6 shadow-[0_0_0_1px_rgba(8,145,178,0.12)] transition'}
        >
          {activeItem.aliases?.map((alias) => <div key={alias} id={alias} className="scroll-mt-28" />)}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700">
                <ActiveIcon className="h-4 w-4" />
              </span>
              <div>
                <h1 className="flex flex-wrap items-center gap-x-2 text-base font-semibold text-slate-900">
                  <span className="font-normal text-slate-500">Configuración</span>
                  <span aria-hidden="true" className="font-normal text-slate-300">/</span>
                  {activeItem.title}
                </h1>
                {activeItem.id !== 'usuarios' ? <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{activeItem.description}</p> : null}
              </div>
            </div>

            {!activeItem.migrated ? (
              <a
                href={activeItem.legacyHref}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <ExternalLink className="h-4 w-4" />
                {activeItem.legacyLabel}
              </a>
            ) : null}
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

          {activeItem.id === 'marca-corporativa' ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <BrandingConfigPanel />
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
            <div className="mt-3 border-t border-slate-200 pt-3">
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
