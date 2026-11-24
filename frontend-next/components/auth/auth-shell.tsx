import { ReactNode } from 'react';
import { BarChart3, Boxes, ShoppingCart, Wallet } from 'lucide-react';
import { SoftwareOwnerMark } from '@/components/ui/software-owner-mark';

export function AuthShell({
  children,
  title = (
    <>
      Informes
      <br />
      Gerenciales
    </>
  ),
  subtitle,
  description = 'Consulta y analiza las finanzas, ventas, compras y stock de tu empresa.',
}: {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: string;
  description?: string;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#091428]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,180,255,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(76,29,149,0.08),transparent_24%),linear-gradient(135deg,#071122_0%,#0c1730_48%,#0b1430_100%)]" />

      <main className="relative mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-12">
        <section className="max-w-[590px] text-white">
          <SoftwareOwnerMark light />

          <p className="hidden sm:block mt-8 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 lg:mt-14">Inteligencia para tu gestión</p>
          <h1 className="hidden sm:block mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>

          {subtitle ? <p className="mt-4 hidden max-w-[440px] text-xl font-medium leading-8 text-cyan-300 sm:block">{subtitle}</p> : null}

          <p className="hidden sm:block mt-5 max-w-[440px] text-base leading-7 text-slate-300">
            {description}
          </p>

          <div className="mt-7 hidden sm:flex flex-wrap gap-x-6 gap-y-4 border-t border-white/10 pt-6 lg:mt-10">
            {[{ name: 'Finanzas', Icon: Wallet }, { name: 'Ventas', Icon: BarChart3 }, { name: 'Compras', Icon: ShoppingCart }, { name: 'Stock', Icon: Boxes }].map(({ name, Icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 text-sm text-slate-300"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-cyan-400" />{name}
              </span>
            ))}
          </div>

        </section>

        <div className="flex justify-center lg:justify-end">
          {children}
        </div>
      </main>
      <footer className="relative px-6 pb-5 text-center text-xs text-slate-400">© MultiSoft · Informes Gerenciales</footer>
    </div>
  );
}
