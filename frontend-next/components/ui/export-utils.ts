'use client';

import { getBranding } from '@/lib/branding';

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
      .brand-header{display:flex;align-items:center;gap:14px;}
      .brand-logo{height:46px;width:46px;object-fit:contain;border-radius:10px;background:#fff;padding:4px;border:1px solid #dbeafe;}
      .brand-mark{height:46px;width:46px;border-radius:10px;background:#0891b2;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;letter-spacing:0.18em;}
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

function buildBrandBlock(title: string, subtitle?: string) {
  const branding = getBranding();
  const initials = String(branding.clientName || 'MS')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || '')
    .join('');

  const logo = branding.logoUrl
    ? `<img class="brand-logo" src="${escapeHtml(branding.logoUrl)}" alt="${escapeHtml(branding.clientName)}" />`
    : `<div class="brand-mark">${escapeHtml(initials || 'MS')}</div>`;

  return `<div class="brand"><div class="brand-header">${logo}<div><div class="brand-kicker">${escapeHtml(branding.clientName)}</div><h1>${escapeHtml(title)}</h1>${subtitle ? `<div class="subtitle">${escapeHtml(subtitle)}</div>` : ''}</div></div></div>`;
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
    buildBrandBlock(params.title, params.subtitle) +
    `<table class="meta"><tbody>${buildMetaRows(params.meta)}</tbody></table>` +
    `<table class="report"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>` +
    `<div class="footer">Reporte generado por ${escapeHtml(getBranding().appName)}.</div>` +
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
      `</head><body>${buildBrandBlock(params.title, params.subtitle)}<table class="meta"><tbody>${buildMetaRows(params.meta)}</tbody></table><table class="report"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table><div class="footer">Reporte generado por ${escapeHtml(getBranding().appName)}.</div></body></html>`,
  );
  popup.document.close();
  popup.focus();
  popup.print();
}
