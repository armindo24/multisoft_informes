'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eraser, Loader2, Upload } from 'lucide-react';

type EmpresaOption = {
  value: string;
  label: string;
};

type ValidationSummary = {
  total_rows?: number;
  valid_rows?: number;
  error_rows?: number;
};

type ValidationRow = Record<string, unknown>;

type ValidationResult = {
  summary?: ValidationSummary;
  preview_rows?: ValidationRow[];
  errors?: string[];
  cleaned_rows?: ValidationRow[];
};

export function AsientosMigrationPanel({
  empresas,
  defaultPeriodo,
  username,
  userId,
}: {
  empresas: EmpresaOption[];
  defaultPeriodo: string;
  username: string;
  userId?: number;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [empresa, setEmpresa] = useState(empresas[0]?.value || '');
  const [periodo, setPeriodo] = useState(defaultPeriodo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationOk, setValidationOk] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [migrationProcess, setMigrationProcess] = useState<string[]>([]);

  const previewRows = validationResult?.preview_rows || [];
  const cleanedRows = validationResult?.cleaned_rows || [];
  const summary = validationResult?.summary || {};

  function resetAll() {
    setValidationResult(null);
    setValidationOk(false);
    setMessage('');
    setErrorMessage('');
    setMigrationProcess([]);
    setSelectedFile(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  async function handleValidate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!empresa) {
      setErrorMessage('Selecciona una empresa.');
      return;
    }

    if (!periodo.trim()) {
      setErrorMessage('Selecciona un periodo.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Adjunta un archivo Excel para validar.');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');
    setMessage('');
    setMigrationProcess([]);

    try {
      const formData = new FormData();
      formData.set('empresa', empresa);
      formData.set('periodo', periodo);
      formData.set('archivo_excel', selectedFile);

      const response = await fetch('/api/migraciones/asientos/validate', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        validation_ok?: boolean;
        message?: string;
        data?: ValidationResult;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'No se pudo validar el Excel.');
      }

      setValidationResult(data.data || null);
      setValidationOk(Boolean(data.validation_ok));
      setMessage(String(data.message || 'Validacion completada.'));
    } catch (error) {
      setValidationResult(null);
      setValidationOk(false);
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo validar el Excel.');
    } finally {
      setIsValidating(false);
    }
  }

  async function handleMigrate() {
    if (!validationOk || !cleanedRows.length) {
      setErrorMessage('Primero valida un archivo sin errores.');
      return;
    }

    setIsMigrating(true);
    setErrorMessage('');
    setMessage('');
    setMigrationProcess([]);

    try {
      const response = await fetch('/api/migraciones/asientos/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresa,
          periodo,
          rows: cleanedRows,
          username,
          user_id: userId,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        process?: string[];
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'No se pudo migrar el archivo.');
      }

      setMessage(String(data.message || 'Migracion finalizada correctamente.'));
      setMigrationProcess(Array.isArray(data.process) ? data.process : []);
      setValidationResult(null);
      setValidationOk(false);
      setSelectedFile(null);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo migrar el archivo.');
    } finally {
      setIsMigrating(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Carga de Excel</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Formato esperado: Cod_Empresa, TipoAsiento, NroCompr, NroTransaccion, Linea, CodPlanCta, CodPlanAux,
            Concepto, DbCr, Importe, ImporteME, Fecha.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Eraser className="h-4 w-4" />
            Limpiar pantalla
          </button>
          <button
            type="button"
            onClick={handleMigrate}
            disabled={!validationOk || isMigrating}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isMigrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Migrar
          </button>
        </div>
      </div>

      <form onSubmit={handleValidate} className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,180px)_minmax(0,1.2fr)_auto]">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Empresa</span>
          <select
            value={empresa}
            onChange={(event) => setEmpresa(event.target.value)}
            disabled={validationOk || isValidating || isMigrating}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
          >
            <option value="">Seleccione...</option>
            {empresas.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Periodo</span>
          <input
            value={periodo}
            onChange={(event) => setPeriodo(event.target.value)}
            disabled={validationOk || isValidating || isMigrating}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
            inputMode="numeric"
            maxLength={4}
            placeholder="2026"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Archivo Excel</span>
          <input
            ref={fileRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            disabled={isValidating || isMigrating}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isValidating || isMigrating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
          >
            {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Validar Excel
          </button>
        </div>
      </form>

      {message ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {errorMessage}
        </div>
      ) : null}

      {(isMigrating || migrationProcess.length > 0) ? (
        <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm text-cyan-900">
          <div className="flex items-center gap-2 font-medium">
            {isMigrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {isMigrating ? 'Migrando asientos. Por favor espere...' : 'Proceso de migracion'}
          </div>
          {migrationProcess.length ? (
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {migrationProcess.map((item, index) => (
                <li key={`${index}-${item}`}>{item}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}

      {validationResult ? (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total filas</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.total_rows || 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Filas validas</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.valid_rows || 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Filas con error</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.error_rows || 0}</p>
            </div>
          </div>

          {Array.isArray(validationResult.errors) && validationResult.errors.length ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                Observaciones detectadas
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800">
                {validationResult.errors.map((item, index) => (
                  <li key={`${index}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Fila</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Empresa</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">TipoAsiento</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">NroCompr</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">NroTransaccion</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Cuenta</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Concepto</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Estado</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {previewRows.length ? (
                  previewRows.slice(0, 30).map((row, index) => (
                    <tr key={`${row.fila || index}-${row.codplancta || index}`}>
                      <td className="px-3 py-2">{String(row.fila || '')}</td>
                      <td className="px-3 py-2">{String(row.cod_empresa || '')}</td>
                      <td className="px-3 py-2">{String(row.tipoasiento || '')}</td>
                      <td className="px-3 py-2">{String(row.nrocompr || '')}</td>
                      <td className="px-3 py-2">{String(row.nrotransaccion || '')}</td>
                      <td className="px-3 py-2">{String(row.codplancta || '')}</td>
                      <td className="px-3 py-2">{String(row.concepto || '')}</td>
                      <td className="px-3 py-2">{String(row.estado || '')}</td>
                      <td className="px-3 py-2">{String(row.detalle_error || '')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-slate-500">
                      No hay filas de vista previa para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
