'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Bell, ChevronRight, Menu, Search, X } from 'lucide-react';

import { LogoutButton } from '@/components/ui/logout-button';
import { BrandSignature } from '@/components/ui/brand-signature';
import { SoftwareOwnerMark } from '@/components/ui/software-owner-mark';
import type { SessionUser } from '@/lib/auth';
import { navigation, type NavigationItem } from '@/lib/navigation';

type NotificationSummary = {
  activeSessions: number;
  companyCount: number;
  hasRecoveryEmail: boolean;
  pendingTasks: number;
  unreadNotifications: number;
  overdueTasks: number;
  dueTodayTasks: number;
};

const NOTIFICATION_SUMMARY_EVENT = 'multisoft:notification-summary-updated';

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getSectionKey(moduleHref: string, sectionLabel: string) {
  return `${moduleHref}::${sectionLabel}`;
}

function normalizeGroupName(value: string) {
  return String(value || '').trim().toLowerCase();
}

function canAccessItem(item: NavigationItem, user: SessionUser | null) {
  if (!user) return false;
  if (item.href === '/dashboard') return true;
  if (user.isSuperuser) return true;

  const groups = new Set((user.groups || []).map(normalizeGroupName));
  const path = item.href.toLowerCase();

  if (path.startsWith('/finanzas')) return groups.has('finanzas');
  if (path.startsWith('/ventas')) return groups.has('ventas');
  if (path.startsWith('/compras')) return groups.has('compras');
  if (path.startsWith('/stock')) return groups.has('stock');
  if (path.startsWith('/migraciones')) return groups.has('migraciones');
  if (path.startsWith('/configuracion')) return groups.has('admin') || groups.has('configuracion');

  return true;
}

function profileSubtitle(user: SessionUser | null) {
  if (!user) return 'Sin sesion';
  if (user.isSuperuser) return 'Administrador total';
  if (user.groups?.length) return user.groups.join(' · ');
  return 'Perfil basico';
}

function isStandaloneAllowedPath(pathname: string) {
  return pathname === '/perfil' || pathname.startsWith('/perfil/') || pathname === '/notificaciones' || pathname.startsWith('/notificaciones/');
}

export function AppShell({
  children,
  user,
  empresa,
}: {
  children: React.ReactNode;
  user: SessionUser | null;
  empresa?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [notificationSummary, setNotificationSummary] = useState<NotificationSummary | null>(null);
  const [loginNotice, setLoginNotice] = useState('');
  const [resolvedEmpresa, setResolvedEmpresa] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const routeEmpresa = String(searchParams.get('empresa') || '').trim().toUpperCase();
  const effectiveEmpresa = routeEmpresa || String(empresa || resolvedEmpresa || '').trim().toUpperCase() || undefined;

  const visibleNavigation = useMemo(
    () => navigation.filter((item) => canAccessItem(item, user)),
    [user],
  );

  const notificationCount = useMemo(() => {
    if (!notificationSummary) return 0;

    let total = 0;
    total += notificationSummary.unreadNotifications || 0;
    total += notificationSummary.overdueTasks || 0;
    if (notificationSummary.activeSessions > 1) total += 1;
    if (!notificationSummary.hasRecoveryEmail) total += 1;
    if (notificationSummary.companyCount === 0) total += 1;
    if ((notificationSummary.dueTodayTasks || 0) > 0) total += 1;
    return total;
  }, [notificationSummary]);

  const notificationBadgeClass = useMemo(() => {
    if (!notificationSummary) return 'bg-rose-500 text-white';
    if ((notificationSummary.overdueTasks || 0) > 0) return 'bg-rose-500 text-white';
    if (notificationSummary.activeSessions > 1) return 'bg-rose-500 text-white';
    if ((notificationSummary.dueTodayTasks || 0) > 0) return 'bg-amber-400 text-slate-950';
    if (!notificationSummary.hasRecoveryEmail || notificationSummary.companyCount === 0) {
      return 'bg-amber-400 text-slate-950';
    }
    return 'bg-cyan-500 text-white';
  }, [notificationSummary]);

  const notificationTooltip = useMemo(() => {
    if (!notificationSummary || notificationCount === 0) {
      return 'Sin alertas nuevas';
    }
    if ((notificationSummary.overdueTasks || 0) > 0) {
      return `${notificationCount} alerta(s): ${notificationSummary.overdueTasks} tarea(s) vencida(s)`;
    }
    if ((notificationSummary.dueTodayTasks || 0) > 0) {
      return `${notificationCount} alerta(s): ${notificationSummary.dueTodayTasks} tarea(s) vencen hoy`;
    }
    if ((notificationSummary.unreadNotifications || 0) > 0) {
      return `${notificationCount} alerta(s): ${notificationSummary.unreadNotifications} notificacion(es) sin leer`;
    }

    if (notificationSummary.activeSessions > 1) {
      return `${notificationCount} alerta(s): revisa tus sesiones activas`;
    }

    if (!notificationSummary.hasRecoveryEmail && notificationSummary.companyCount === 0) {
      return `${notificationCount} alerta(s): falta correo de recuperacion y empresas asignadas`;
    }

    if (!notificationSummary.hasRecoveryEmail) {
      return `${notificationCount} alerta(s): falta correo de recuperacion`;
    }

    if (notificationSummary.companyCount === 0) {
      return `${notificationCount} alerta(s): sin empresas asignadas`;
    }

    return `${notificationCount} alerta(s) de cuenta`;
  }, [notificationCount, notificationSummary]);

  useEffect(() => {
    if (pathname === '/login' || pathname.startsWith('/password-reset')) return;
    if (!user?.id) return;
    if (routeEmpresa || empresa || resolvedEmpresa) return;

    let cancelled = false;

    async function loadEmpresa() {
      const response = await fetch('/api/auth/empresa', { cache: 'no-store' }).catch(() => null);
      if (!response || cancelled) return;

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        data?: { empresa?: string | null };
      };

      if (cancelled || !payload.ok) return;

      const nextEmpresa = String(payload.data?.empresa || '').trim().toUpperCase();
      if (nextEmpresa) {
        setResolvedEmpresa(nextEmpresa);
      }
    }

    void loadEmpresa();

    return () => {
      cancelled = true;
    };
  }, [empresa, pathname, resolvedEmpresa, routeEmpresa, user?.id]);

  useEffect(() => {
    const activeItem = visibleNavigation.find((item) => isActivePath(pathname, item.href));
    if (!activeItem?.sections?.length) return;

    const activeKeys = activeItem.sections.map((section) => getSectionKey(activeItem.href, section.label));
    const hasOpenSection = activeKeys.some((key) => openSections[key]);
    if (hasOpenSection) return;

    setOpenSections((current) => ({
      ...current,
      [activeKeys[0]]: true,
    }));
  }, [pathname, openSections, visibleNavigation]);

  useEffect(() => {
    if (pathname === '/login' || pathname.startsWith('/password-reset')) return;
    if (isStandaloneAllowedPath(pathname)) return;
    if (!visibleNavigation.length) return;

    const allowed = visibleNavigation.some((item) => isActivePath(pathname, item.href));
    if (!allowed) {
      router.replace('/dashboard');
    }
  }, [pathname, router, visibleNavigation]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/login' || pathname.startsWith('/password-reset')) return;
    const notice = window.sessionStorage.getItem('multisoft:login-notice') || '';
    if (!notice) return;

    setLoginNotice(notice);
    window.sessionStorage.removeItem('multisoft:login-notice');
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    if (pathname === '/login' || pathname.startsWith('/password-reset')) return;

    let cancelled = false;

    async function loadNotifications() {
      const response = await fetch('/api/auth/notifications', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        data?: {
          summary?: NotificationSummary;
        };
      };

      if (cancelled || !response.ok || !payload.ok || !payload.data?.summary) {
        return;
      }

      setNotificationSummary(payload.data.summary);
    }

    void loadNotifications();

    function handleSummaryEvent(event: Event) {
      const customEvent = event as CustomEvent<NotificationSummary>;
      if (!customEvent.detail || cancelled) return;
      setNotificationSummary(customEvent.detail);
    }

    window.addEventListener(NOTIFICATION_SUMMARY_EVENT, handleSummaryEvent as EventListener);

    return () => {
      cancelled = true;
      window.removeEventListener(NOTIFICATION_SUMMARY_EVENT, handleSummaryEvent as EventListener);
    };
  }, [pathname, user]);

  if (pathname === '/login' || pathname.startsWith('/password-reset')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[284px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-800 bg-slate-950 text-slate-100 lg:block">
          <div className="sticky top-0 flex h-screen flex-col overflow-y-auto px-3 py-4">
            <div className="px-2 pb-4">
              <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <SoftwareOwnerMark compact light />
              </div>
              <h1 className="mt-2.5 text-[1.7rem] font-black leading-tight text-white">Panel ejecutivo</h1>
              <p className="mt-2 max-w-[17rem] text-[0.92rem] leading-5 text-slate-400">
                Acceso ejecutivo a informes, indicadores y consultas operativas.
              </p>
            </div>

            <nav className="flex-1 space-y-2">
              {visibleNavigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;

                return (
                  <div
                    key={item.href}
                    className={[
                      'overflow-hidden rounded-[1.4rem] border transition',
                      active ? 'border-cyan-500/30 bg-slate-900 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]' : 'border-transparent bg-transparent',
                    ].join(' ')}
                  >
                    <a
                      href={item.href}
                      className={[
                        'group flex items-center gap-3 rounded-[1.2rem] px-4 py-2.5 text-sm font-semibold transition',
                        active ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex h-9 w-9 items-center justify-center rounded-xl border transition',
                          active ? 'border-white/15 bg-white/10' : 'border-slate-800 bg-slate-900 text-slate-300 group-hover:border-slate-700',
                        ].join(' ')}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.sections?.length ? (
                        <ChevronRight className={['h-4 w-4 transition', active ? 'rotate-90 text-white' : 'text-slate-500'].join(' ')} />
                      ) : null}
                    </a>

                    {active && item.sections?.length ? (
                      <div className="space-y-3 px-3 pb-3 pt-3">
                        {item.sections.map((section) => {
                          const sectionKey = getSectionKey(item.href, section.label);
                          const isOpen = Boolean(openSections[sectionKey]);
                          const hasSectionLabel = Boolean(section.label.trim());

                          return (
                            <div key={section.label} className="rounded-2xl border border-slate-800 bg-slate-900/70">
                              {hasSectionLabel ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenSections((current) => ({
                                      ...current,
                                      [sectionKey]: !current[sectionKey],
                                    }))
                                  }
                                  className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                                >
                                  <p className="text-sm font-semibold text-slate-100">{section.label}</p>
                                  <ChevronRight className={['h-4 w-4 text-cyan-300 transition', isOpen ? 'rotate-90' : 'rotate-0'].join(' ')} />
                                </button>
                              ) : null}
                              {isOpen ? (
                                <div className={hasSectionLabel ? 'border-t border-slate-800 py-1' : 'py-1'}>
                                  {section.items.map((subItem) => (
                                    subItem.disabled ? (
                                      <div
                                        key={`${section.label}-${subItem.label}`}
                                        className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-slate-500"
                                      >
                                        <span>{subItem.label}</span>
                                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                          Proximo
                                        </span>
                                      </div>
                                    ) : (
                                      <a
                                        key={`${section.label}-${subItem.label}`}
                                        href={subItem.href}
                                        className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                                      >
                                        <span>{subItem.label}</span>
                                      </a>
                                    )
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="mt-3 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="text-sm font-semibold text-white">Acceso actual</p>
              <p className="mt-1.5 leading-5">
                {user?.groups?.length
                  ? `Modulos habilitados: ${user.groups.join(', ')}`
                  : 'No hay grupos asignados para este usuario.'}
              </p>
            </div>
          </div>
        </aside>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar menu"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="relative z-10 flex h-full w-[min(86vw,340px)] flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 px-3 py-4 text-slate-100 shadow-2xl">
              <div className="flex items-start justify-between gap-3 px-2 pb-4">
                <div>
                  <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <SoftwareOwnerMark compact light />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Panel ejecutivo</p>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar menu"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {visibleNavigation.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.href}
                      className={[
                        'overflow-hidden rounded-[1.4rem] border transition',
                        active ? 'border-cyan-500/30 bg-slate-900 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]' : 'border-transparent bg-transparent',
                      ].join(' ')}
                    >
                      <a
                        href={item.href}
                        onClick={() => {
                          if (!item.sections?.length) setMobileNavOpen(false);
                        }}
                        className={[
                          'group flex items-center gap-3 rounded-[1.2rem] px-4 py-2.5 text-sm font-semibold transition',
                          active ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex h-9 w-9 items-center justify-center rounded-xl border transition',
                            active ? 'border-white/15 bg-white/10' : 'border-slate-800 bg-slate-900 text-slate-300 group-hover:border-slate-700',
                          ].join(' ')}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.sections?.length ? (
                          <ChevronRight className={['h-4 w-4 transition', active ? 'rotate-90 text-white' : 'text-slate-500'].join(' ')} />
                        ) : null}
                      </a>

                      {active && item.sections?.length ? (
                        <div className="space-y-3 px-3 pb-3 pt-3">
                          {item.sections.map((section) => {
                            const sectionKey = getSectionKey(item.href, section.label);
                            const isOpen = Boolean(openSections[sectionKey]);
                            const hasSectionLabel = Boolean(section.label.trim());

                            return (
                              <div key={section.label} className="rounded-2xl border border-slate-800 bg-slate-900/70">
                                {hasSectionLabel ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenSections((current) => ({
                                        ...current,
                                        [sectionKey]: !current[sectionKey],
                                      }))
                                    }
                                    className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                                  >
                                    <p className="text-sm font-semibold text-slate-100">{section.label}</p>
                                    <ChevronRight className={['h-4 w-4 text-cyan-300 transition', isOpen ? 'rotate-90' : 'rotate-0'].join(' ')} />
                                  </button>
                                ) : null}
                                {isOpen ? (
                                  <div className={hasSectionLabel ? 'border-t border-slate-800 py-1' : 'py-1'}>
                                    {section.items.map((subItem) => (
                                      subItem.disabled ? (
                                        <div
                                          key={`${section.label}-${subItem.label}`}
                                          className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-slate-500"
                                        >
                                          <span>{subItem.label}</span>
                                          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                            Proximo
                                          </span>
                                        </div>
                                      ) : (
                                        <a
                                          key={`${section.label}-${subItem.label}`}
                                          href={subItem.href}
                                          onClick={() => setMobileNavOpen(false)}
                                          className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                                        >
                                          <span>{subItem.label}</span>
                                        </a>
                                      )
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>
            </aside>
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex items-center justify-between gap-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Abrir menu"
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <BrandSignature compact empresa={effectiveEmpresa} />
                </div>
                <LogoutButton />
              </div>

              <div className="flex items-center gap-3 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 lg:min-w-[340px]">
                <div className="hidden shrink-0 lg:block">
                  <BrandSignature compact empresa={effectiveEmpresa} />
                </div>
                <Search className="h-4 w-4 shrink-0" />
                <span className="truncate">Buscar cliente, articulo, comprobante o proveedor</span>
              </div>
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/notificaciones"
                  title={notificationTooltip}
                  aria-label={notificationTooltip}
                  className="relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/40"
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 ? (
                    <span className={['absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold shadow-sm', notificationBadgeClass].join(' ')}>
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  ) : null}
                  <span className="sr-only">{notificationTooltip}</span>
                </Link>
                <Link href="/perfil" className="block max-w-[300px] rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/40">
                  <p className="truncate font-semibold text-slate-900">{user?.displayName || user?.username || 'Usuario'}</p>
                  <p className="truncate text-slate-500">{profileSubtitle(user)}</p>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1536px]">
              {loginNotice ? (
                <div className="mb-4 flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
                  <p className="leading-6">{loginNotice}</p>
                  <button
                    type="button"
                    onClick={() => setLoginNotice('')}
                    className="rounded-lg p-1 text-amber-800 transition hover:bg-amber-100"
                    aria-label="Cerrar aviso"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
