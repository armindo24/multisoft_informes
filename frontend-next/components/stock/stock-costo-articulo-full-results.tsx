'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getStockCostoArticuloFull,
  getStockCostoArticuloFullAsyncResult,
  getStockCostoArticuloFullAsyncStatus,
  startStockCostoArticuloFullAsync,
} from '@/lib/api';
import { StockCostoArticuloFullRow } from '@/types/stock';
import { StockCostoArticuloFullTable } from './stock-costo-articulo-full-table';

type Props = {
  empresa: string;
  articulo: string;
  tipo: string;
  estado: string;
  fechad: string;
  fechah: string;
  calcular_empresa: string;
  ecuacion_mat: string;
  submitted: boolean;
};

export function StockCostoArticuloFullResults(props: Props) {
  const [rows, setRows] = useState<StockCostoArticuloFullRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [progress, setProgress] = useState(14);
  const [phase, setPhase] = useState('Preparando consulta');

  const fechaBase = props.fechad || props.fechah || '';
  const periodInfo = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaBase)) {
      return {
        periodo: '',
        anho: '',
      };
    }
    const [year, month] = fechaBase.split('-');
    return {
      periodo: `${year}${month}`,
      anho: year,
    };
  }, [fechaBase]);

  useEffect(() => {
    if (!props.submitted || !props.empresa) {
      setRows([]);
      setWarning('');
      setLoading(false);
      setProgress(14);
      setPhase('Preparando consulta');
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setWarning('');
      setRows([]);
      setProgress(14);
      setPhase(props.ecuacion_mat === 'S' ? 'Iniciando proceso en segundo plano' : 'Consultando datos del informe');

      if (props.ecuacion_mat === 'S') {
        const start = await startStockCostoArticuloFullAsync({
          empresa: props.empresa,
          articulo: props.articulo,
          tipo: props.tipo,
          estado: props.estado,
          fechad: props.fechad,
          fechah: props.fechah,
          calcular_empresa: props.calcular_empresa,
          ecuacion_mat: props.ecuacion_mat,
          periodo: periodInfo.periodo,
          anho: periodInfo.anho,
          fecha_inicio_desde: props.fechad,
          fecha_inicio_hasta: props.fechah,
          fecha_fin_desde: props.fechad,
          fecha_fin_hasta: props.fechah,
          recalcular: props.ecuacion_mat === 'S' ? 'S' : undefined,
        });

        const jobId = String(start?.data?.job_id || '');
        if (!jobId) {
          if (!cancelled) {
            setWarning('No se pudo iniciar el proceso de Ecuacion BC materiales.');
            setLoading(false);
          }
          return;
        }

        while (!cancelled) {
          const status = await getStockCostoArticuloFullAsyncStatus(props.empresa, jobId);
          const job = status?.data || {};
          const statusValue = String(job.status || '');
          const nextProgress = Number(job.progress ?? 0);
          const statusLabel =
            String(job.stage_label || job.current_stage_label || job.current_stage || job.status_label || '').trim();

          if (!cancelled) {
            setProgress(Number.isFinite(nextProgress) && nextProgress > 0 ? Math.min(98, nextProgress) : 72);
            setPhase(statusLabel || (statusValue === 'done' ? 'Armando resultado final' : 'Procesando informe'));
          }

          if (statusValue === 'done') {
            const result = await getStockCostoArticuloFullAsyncResult(props.empresa, jobId);
            if (!cancelled) {
              setRows(((result?.data || []) as StockCostoArticuloFullRow[]) ?? []);
              setProgress(100);
              setPhase('Informe generado correctamente');
              setLoading(false);
            }
            return;
          }

          if (statusValue === 'error') {
            if (!cancelled) {
              setWarning(String(job.error || 'El proceso de Ecuacion BC materiales finalizo con error.'));
              setLoading(false);
            }
            return;
          }

          await new Promise((resolve) => window.setTimeout(resolve, 1400));
        }

        return;
      }

      const response = await getStockCostoArticuloFull({
        empresa: props.empresa,
        articulo: props.articulo,
        tipo: props.tipo,
        estado: props.estado,
        fechad: props.fechad,
        fechah: props.fechah,
        calcular_empresa: props.calcular_empresa,
        ecuacion_mat: props.ecuacion_mat,
        periodo: periodInfo.periodo,
        anho: periodInfo.anho,
        fecha_inicio_desde: props.fechad,
        fecha_inicio_hasta: props.fechah,
        fecha_fin_desde: props.fechad,
        fecha_fin_hasta: props.fechah,
        recalcular: props.ecuacion_mat === 'S' ? 'S' : undefined,
      });

      if (!cancelled) {
        if (!response) {
          setWarning('No se pudo consultar el API de costo articulo full. Verifica que Node y la base integrada esten levantados.');
          setRows([]);
        } else {
          setRows(((response.data || []) as StockCostoArticuloFullRow[]) ?? []);
          setProgress(100);
          setPhase('Informe generado correctamente');
        }
        setLoading(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    props.articulo,
    props.calcular_empresa,
    props.ecuacion_mat,
    props.empresa,
    props.estado,
    props.fechad,
    props.fechah,
    props.submitted,
    props.tipo,
    periodInfo.anho,
    periodInfo.periodo,
  ]);

  return (
    <>
      {warning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</div>
      ) : null}

      <StockCostoArticuloFullTable
        rows={rows}
        empresa={props.empresa}
        fechad={props.fechad}
        fechah={props.fechah}
        ecuacionMat={props.ecuacion_mat === 'S'}
      />

      {loading ? (
        <div className="pointer-events-none fixed right-6 top-24 z-40 w-full max-w-sm">
          <div className="rounded-2xl border border-cyan-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Procesando stock</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{phase}</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-100">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
