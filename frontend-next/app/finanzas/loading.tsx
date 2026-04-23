export default function LoadingFinanzas() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-10 w-56 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-3xl animate-pulse rounded bg-slate-200" />
      </div>

      <div className="card grid gap-4 p-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="card p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </section>
    </div>
  );
}
