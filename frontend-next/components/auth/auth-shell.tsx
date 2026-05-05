import { ReactNode } from 'react';
import { SoftwareOwnerMark } from '@/components/ui/software-owner-mark';

export function AuthShell({
  children,
  title = (
    <>
      Informes
      <br />
      gerenciales
      <br />
      <span className="text-slate-300">modernos y</span>
      <br />
      <span className="text-slate-300">escalables</span>
    </>
  ),
  description = 'Plataforma unificada para finanzas, stock, ventas y compras, diseñada para equipos que necesitan control, velocidad y claridad en la toma de decisiones.',
}: {
  children: ReactNode;
  title?: ReactNode;
  description?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#091428]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,180,255,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(76,29,149,0.08),transparent_24%),linear-gradient(135deg,#071122_0%,#0c1730_48%,#0b1430_100%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1240px] gap-14 px-6 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:px-10">
        <section className="max-w-[590px] text-white">
          <SoftwareOwnerMark light />

          <h1 className="mt-8 text-5xl font-semibold leading-[1.06] tracking-[-0.05em] text-white md:text-6xl lg:text-[4.35rem]">
            {title}
          </h1>

          <p className="mt-8 max-w-[560px] text-lg leading-9 text-slate-200/95">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {['Finanzas', 'Stock', 'Ventas', 'Compras'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              'Indicadores en tiempo real',
              'Reportes por módulo',
              'Acceso seguro por usuario',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/8 bg-white/[0.055] px-4 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm"
              >
                <div className="mb-4 h-2 w-11 rounded-full bg-cyan-400" />
                <p className="text-sm leading-7 text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center lg:justify-end">
          {children}
        </div>
      </div>
    </div>
  );
}
