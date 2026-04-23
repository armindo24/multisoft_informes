'use client';

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export type ExportMetaItem = {
  label: string;
  value: unknown;
};

function nowLabel() {
  return new Date().toLocaleString('es-PY');
}

function buildMetaRows(meta?: ExportMetaItem[]) {
  const normalized = [
    ...(meta || []),
    { label: 'Generado', value: nowLabel() },
  ].filter((item) => String(item.value ?? '').trim());

  return normalized
    .map((item) => `<tr><td class="meta-label">${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td></tr>`)
    .join('');
}

function buildCorporateStyles() {
  return `
    <style>
      body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;margin:0;padding:24px;background:#fff;}
      .brand{border-bottom:3px solid #0891b2;padding-bottom:12px;margin-bottom:16px;}
      .brand-kicker{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#0e7490;font-weight:700;}
      h1{font-size:22px;margin:6px 0 4px 0;color:#020617;}
      .subtitle{font-size:12px;color:#475569;line-height:1.5;margin-bottom:14px;}
      .meta{border-collapse:collapse;margin:10px 0 18px 0;font-size:11px;}
      .meta td{border:1px solid #e2e8f0;padding:6px 10px;}
      .meta-label{background:#f8fafc;color:#475569;font-weight:700;min-width:120px;}
      table.report{border-collapse:collapse;width:100%;font-size:11px;}
      table.report th,table.report td{border:1px solid #cbd5e1;padding:6px 8px;vertical-align:top;}
      table.report th{background:#eaf2f8;color:#0f172a;text-align:left;font-weight:700;}
      table.report tr:nth-child(even) td{background:#f8fafc;}
      .footer{margin-top:18px;border-top:1px solid #e2e8f0;padding-top:8px;font-size:10px;color:#64748b;}
      @page{size:auto;margin:14mm;}
    </style>
  `;
}

export function exportRowsToExcel(params: {
  title: string;
  subtitle?: string;
  filename: string;
  headers: string[];
  rows: Array<Array<unknown>>;
  meta?: ExportMetaItem[];
}) {
  const header = params.headers.map((item) => `<th>${escapeHtml(item)}</th>`).join('');
  const body = params.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  const html =
    '<html><head><meta charset="utf-8"><title>Multisoft Reporte</title>' +
    buildCorporateStyles() +
    '</head><body>' +
    '<div class="brand"><div class="brand-kicker">Multisoft</div>' +
    `<h1>${escapeHtml(params.title)}</h1>` +
    (params.subtitle ? `<div class="subtitle">${escapeHtml(params.subtitle)}</div>` : '') +
    '</div>' +
    `<table class="meta"><tbody>${buildMetaRows(params.meta)}</tbody></table>` +
    `<table class="report"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>` +
    '<div class="footer">Reporte generado por Multisoft Informes Gerenciales.</div>' +
    '</body></html>';

  downloadBlob(`${params.filename}.xls`, html, 'application/vnd.ms-excel;charset=utf-8;');
}

export function exportRowsToPdf(params: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: Array<Array<unknown>>;
  meta?: ExportMetaItem[];
}) {
  const header = params.headers.map((item) => `<th>${escapeHtml(item)}</th>`).join('');
  const body = params.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  const popup = window.open('', '_blank', 'width=1200,height=800');
  if (!popup) return;

  popup.document.write(
    '<html><head><meta charset="utf-8"><title>Multisoft Reporte</title>' +
      buildCorporateStyles() +
      `</head><body><div class="brand"><div class="brand-kicker">Multisoft</div><h1>${escapeHtml(params.title)}</h1>${params.subtitle ? `<div class="subtitle">${escapeHtml(params.subtitle)}</div>` : ''}</div><table class="meta"><tbody>${buildMetaRows(params.meta)}</tbody></table><table class="report"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table><div class="footer">Reporte generado por Multisoft Informes Gerenciales.</div></body></html>`,
  );
  popup.document.close();
  popup.focus();
  popup.print();
}
