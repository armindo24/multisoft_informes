'use client';

import type { BrandingConfig } from '@/lib/branding';
import { getBranding } from '@/lib/branding';

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

export type ExportBrandingOverride = Partial<BrandingConfig>;

function resolveBranding(override?: ExportBrandingOverride) {
  const base = getBranding();
  return {
    ...base,
    ...(override || {}),
  };
}

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
      .pdf-cover{min-height:88vh;display:flex;flex-direction:column;justify-content:space-between;padding:24px 0 8px 0;}
      .pdf-cover-main{display:flex;flex-direction:column;gap:24px;}
      .cover-header{display:flex;align-items:center;gap:18px;}
      .cover-logo{height:72px;width:72px;object-fit:contain;border-radius:18px;background:#fff;padding:8px;border:1px solid #dbeafe;}
      .cover-mark{height:72px;width:72px;border-radius:18px;background:#0891b2;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;letter-spacing:0.2em;font-size:24px;}
      .cover-kicker{font-size:12px;letter-spacing:5px;text-transform:uppercase;color:#0e7490;font-weight:700;}
      .cover-client{font-size:15px;color:#334155;font-weight:700;margin-top:6px;}
      .cover-tagline{font-size:13px;color:#64748b;margin-top:4px;}
      .cover-title{font-size:30px;line-height:1.08;margin:0;color:#020617;}
      .cover-subtitle{font-size:14px;line-height:1.6;color:#475569;max-width:760px;}
      .cover-meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:8px;}
      .cover-meta-card{border:1px solid #dbeafe;border-radius:14px;padding:14px 16px;background:linear-gradient(180deg,#f8fcff 0%,#ffffff 100%);}
      .cover-meta-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#0891b2;font-weight:700;margin-bottom:8px;}
      .cover-meta-value{font-size:15px;color:#0f172a;font-weight:700;line-height:1.35;}
      .cover-footer{display:flex;justify-content:space-between;gap:16px;border-top:1px solid #cbd5e1;padding-top:14px;color:#64748b;font-size:11px;}
      .page-break{break-before:page;page-break-before:always;}
      .footer{margin-top:18px;border-top:1px solid #e2e8f0;padding-top:8px;font-size:10px;color:#64748b;}
      @page{size:auto;margin:14mm;}
    </style>
  `;
}

function buildBrandBlock(title: string, subtitle?: string, override?: ExportBrandingOverride) {
  const branding = resolveBranding(override);
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

function buildPdfCover(title: string, subtitle?: string, meta?: ExportMetaItem[], override?: ExportBrandingOverride) {
  const branding = resolveBranding(override);
  const initials = String(branding.clientName || 'MS')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || '')
    .join('');

  const logo = branding.logoUrl
    ? `<img class="cover-logo" src="${escapeHtml(branding.logoUrl)}" alt="${escapeHtml(branding.clientName)}" />`
    : `<div class="cover-mark">${escapeHtml(initials || 'MS')}</div>`;

  const metaCards = [
    ...(meta || []),
    { label: 'Generado', value: nowLabel() },
  ]
    .filter((item) => String(item.value ?? '').trim())
    .map(
      (item) =>
        `<div class="cover-meta-card"><div class="cover-meta-label">${escapeHtml(item.label)}</div><div class="cover-meta-value">${escapeHtml(item.value)}</div></div>`,
    )
    .join('');

  return `
    <section class="pdf-cover">
      <div class="pdf-cover-main">
        <div class="cover-header">
          ${logo}
          <div>
            <div class="cover-kicker">${escapeHtml(branding.appName)}</div>
            <div class="cover-client">${escapeHtml(branding.clientName)}</div>
            <div class="cover-tagline">${escapeHtml(branding.tagline)}</div>
          </div>
        </div>
        <div>
          <h1 class="cover-title">${escapeHtml(title)}</h1>
          ${subtitle ? `<div class="cover-subtitle">${escapeHtml(subtitle)}</div>` : ''}
        </div>
        <div class="cover-meta-grid">${metaCards}</div>
      </div>
      <div class="cover-footer">
        <div>Documento corporativo generado por ${escapeHtml(branding.appName)}.</div>
        <div>${escapeHtml(branding.clientName)}</div>
      </div>
    </section>
  `;
}

export function exportRowsToExcel(params: {
  title: string;
  subtitle?: string;
  filename: string;
  headers: string[];
  rows: Array<Array<unknown>>;
  meta?: ExportMetaItem[];
  branding?: ExportBrandingOverride;
}) {
  const header = params.headers.map((item) => `<th>${escapeHtml(item)}</th>`).join('');
  const body = params.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  const html =
    '<html><head><meta charset="utf-8"><title>Multisoft Reporte</title>' +
    buildCorporateStyles() +
    '</head><body>' +
    buildBrandBlock(params.title, params.subtitle, params.branding) +
    `<table class="meta"><tbody>${buildMetaRows(params.meta)}</tbody></table>` +
    `<table class="report"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>` +
    `<div class="footer">Reporte generado por ${escapeHtml(resolveBranding(params.branding).appName)}.</div>` +
    '</body></html>';

  downloadBlob(`${params.filename}.xls`, html, 'application/vnd.ms-excel;charset=utf-8;');
}

export function exportRowsToPdf(params: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: Array<Array<unknown>>;
  meta?: ExportMetaItem[];
  branding?: ExportBrandingOverride;
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
      `</head><body>${buildPdfCover(params.title, params.subtitle, params.meta, params.branding)}<div class="page-break">${buildBrandBlock(params.title, params.subtitle, params.branding)}<table class="meta"><tbody>${buildMetaRows(params.meta)}</tbody></table><table class="report"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table><div class="footer">Reporte generado por ${escapeHtml(resolveBranding(params.branding).appName)}.</div></div></body></html>`,
  );
  popup.document.close();
  popup.focus();
  popup.print();
}
