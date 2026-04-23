'use client';

import { ArrowDownAZ, ArrowUpAZ, FileDown, FileSpreadsheet, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { exportRowsToExcel, exportRowsToPdf } from '@/components/ui/export-utils';

export type DataColumn<T extends Record<string, unknown>> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge';
  className?: string;
  align?: 'left' | 'right' | 'center';
  badgeMap?: Record<string, string>;
};

function getValue(row: Record<string, unknown>, key: string) {
  return row[key];
}

function safeString(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function safeNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatValue(value: unknown, type: DataColumn<Record<string, unknown>>['type']) {
  if (type === 'currency') return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(safeNumber(value));
  if (type === 'number') return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 2 }).format(safeNumber(value));
  if (type === 'date') return safeString(value).slice(0, 10);
  return safeString(value) || '-';
}

function compareValues(a: unknown, b: unknown, type: DataColumn<Record<string, unknown>>['type']) {
  if (type === 'currency' || type === 'number') return safeNumber(a) - safeNumber(b);
  if (type === 'date') return safeString(a).localeCompare(safeString(b));
  return safeString(a).localeCompare(safeString(b), 'es', { sensitivity: 'base' });
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  columns,
  rows,
  emptyMessage = 'No hay datos para mostrar con los filtros actuales.',
  exportName = 'reporte',
  pageSizeOptions = [10, 25, 50],
  initialPageSize = 10,
}: {
  title: string;
  subtitle?: string;
  columns: Array<DataColumn<T>>;
  rows: T[];
  emptyMessage?: string;
  exportName?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string>(String(columns.find((column) => column.sortable)?.key || columns[0]?.key || ''));
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const normalizedColumns = columns as Array<DataColumn<Record<string, unknown>>>;

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter((row) =>
      normalizedColumns.some((column) => safeString(getValue(row, String(column.key))).toLowerCase().includes(normalizedQuery)),
    );
  }, [rows, normalizedColumns, query]);

  const sortedRows = useMemo(() => {
    const activeColumn = normalizedColumns.find((column) => String(column.key) === sortKey);
    if (!activeColumn) return filteredRows;

    return [...filteredRows].sort((left, right) => {
      const result = compareValues(getValue(left, String(activeColumn.key)), getValue(right, String(activeColumn.key)), activeColumn.type);
      return sortDirection === 'asc' ? result : -result;
    });
  }, [filteredRows, normalizedColumns, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const exportRows = useMemo(
    () =>
      sortedRows.map((row) =>
        Object.fromEntries(
          normalizedColumns.map((column) => [column.header, formatValue(getValue(row, String(column.key)), column.type)]),
        ),
      ),
    [normalizedColumns, sortedRows],
  );

  function toggleSort(column: DataColumn<Record<string, unknown>>) {
    if (!column.sortable) return;
    const key = String(column.key);
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  }

  function exportExcel() {
    const headers = normalizedColumns.map((column) => column.header);
    exportRowsToExcel({
      title,
      subtitle,
      filename: exportName,
      headers,
      rows: exportRows.map((row) => headers.map((header) => row[header])),
    });
  }

  function exportPdf() {
    const headers = normalizedColumns.map((column) => column.header);
    exportRowsToPdf({
      title,
      subtitle,
      headers,
      rows: exportRows.map((row) => headers.map((header) => row[header])),
    });
  }

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar en la tabla"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400"
              />
            </label>

            <div className="flex items-center gap-2">
              <button type="button" onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100">
                <FileSpreadsheet className="size-4" /> Excel
              </button>
              <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 transition hover:bg-rose-100">
                <FileDown className="size-4" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-10 text-sm text-slate-500">{emptyMessage}</div>
      ) : (
        <>
          <div className="max-h-[72vh] overflow-auto">
            <table className="min-w-[920px] divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-[1] bg-slate-50 text-left text-slate-600 shadow-[0_1px_0_#e2e8f0]">
                <tr>
                  {normalizedColumns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-4 py-3 font-semibold ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${column.className || ''}`}
                    >
                      <button
                        type="button"
                        disabled={!column.sortable}
                        onClick={() => toggleSort(column)}
                        className={`inline-flex items-center gap-1 ${column.sortable ? 'cursor-pointer hover:text-slate-900' : 'cursor-default'} ${column.align === 'right' ? 'ml-auto' : ''}`}
                      >
                        <span>{column.header}</span>
                        {column.sortable ? sortKey === String(column.key) ? (
                          sortDirection === 'asc' ? <ArrowDownAZ className="size-4" /> : <ArrowUpAZ className="size-4" />
                        ) : (
                          <ArrowDownAZ className="size-4 opacity-30" />
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedRows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/80">
                    {normalizedColumns.map((column) => {
                      const value = getValue(row, String(column.key));
                      const content = column.type === 'badge' ? (
                        <span className={`badge ${column.badgeMap?.[safeString(value)] || 'bg-slate-100 text-slate-700'}`}>
                          {safeString(value) || '-'}
                        </span>
                      ) : (
                        formatValue(value, column.type)
                      );

                      return (
                        <td
                          key={String(column.key)}
                          className={`px-4 py-2.5 align-top text-slate-700 ${column.align === 'right' ? 'text-right tabular-nums' : column.align === 'center' ? 'text-center' : 'text-left'} ${column.className || ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div>
              Mostrando <span className="font-semibold text-slate-900">{paginatedRows.length ? (safePage - 1) * pageSize + 1 : 0}-{Math.min(safePage * pageSize, sortedRows.length)}</span> de <span className="font-semibold text-slate-900">{sortedRows.length}</span> registros
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2">
                <span>Filas</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage <= 1} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50">
                Anterior
              </button>
              <span className="px-2">Página {safePage} de {totalPages}</span>
              <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50">
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
