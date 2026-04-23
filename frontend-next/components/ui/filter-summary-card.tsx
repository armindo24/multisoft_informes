type FilterItem = {
  label: string;
  value: string;
};

export function FilterSummaryCard({
  title = 'Filtros aplicados',
  items,
}: {
  title?: string;
  items: FilterItem[];
}) {
  const visibleItems = items.filter((item) => String(item.value || '').trim());

  if (!visibleItems.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">{title}</p>
          <p className="mt-1 text-sm text-slate-500">Resumen rapido de los criterios usados para generar este informe.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleItems.map((item) => (
            <div key={`${item.label}-${item.value}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{item.label}:</span> {item.value}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
