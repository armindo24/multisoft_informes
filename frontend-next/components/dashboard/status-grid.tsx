import { getIntegradoStatus, getSueldoStatus } from '@/lib/api';
import { getScopedEmpresas } from '@/lib/empresas-server';

export async function StatusGrid() {
  const [integrado, sueldo, empresas] = await Promise.all([
    getIntegradoStatus(),
    getSueldoStatus(),
    getScopedEmpresas(),
  ]);

  const cards = [
    {
      title: 'Base integrado',
      value: integrado ? ((integrado as { enabled?: boolean }).enabled ? 'Conectada' : 'Con incidencia') : 'Sin respuesta',
      detail: integrado ? JSON.stringify(integrado) : 'No se pudo consultar el estado del motor integrado.',
    },
    {
      title: 'Base sueldo',
      value: sueldo ? ((sueldo as { enabled?: boolean }).enabled ? 'Conectada' : 'Con incidencia') : 'Sin respuesta',
      detail: sueldo ? JSON.stringify(sueldo) : 'No se pudo consultar el estado de RRHH.',
    },
    {
      title: 'Empresas disponibles',
      value: empresas?.data?.length ? String(empresas.data.length) : '0',
      detail: empresas?.data?.length
        ? empresas.data.slice(0, 5).map((item) => item.des_empresa || item.cod_empresa || 'Empresa').join(', ')
        : 'No se encontraron empresas o el API no respondió.',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="card p-5">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
          <p className="mt-3 text-xs leading-5 text-slate-500">{card.detail}</p>
        </div>
      ))}
    </div>
  );
}
