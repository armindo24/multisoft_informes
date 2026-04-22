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

export function exportRowsToExcel(params: {
  title: string;
  subtitle?: string;
  filename: string;
  headers: string[];
  rows: Array<Array<unknown>>;
}) {
  const header = params.headers.map((item) => `<th>${escapeHtml(item)}</th>`).join('');
  const body = params.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  const html =
    '<html><head><meta charset="utf-8"><title>Exportacion</title></head><body>' +
    `<h1>${escapeHtml(params.title)}</h1>` +
    (params.subtitle ? `<div>${escapeHtml(params.subtitle)}</div>` : '') +
    `<table border="1"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>` +
    '</body></html>';

  downloadBlob(`${params.filename}.xls`, html, 'application/vnd.ms-excel;charset=utf-8;');
}

export function exportRowsToPdf(params: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: Array<Array<unknown>>;
}) {
  const header = params.headers.map((item) => `<th>${escapeHtml(item)}</th>`).join('');
  const body = params.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('');

  const popup = window.open('', '_blank', 'width=1200,height=800');
  if (!popup) return;

  popup.document.write(
    '<html><head><meta charset="utf-8"><title>Reporte</title>' +
      '<style>body{font-family:Arial,sans-serif;padding:24px;}table{border-collapse:collapse;width:100%;font-size:12px;}th,td{border:1px solid #cbd5e1;padding:6px 8px;vertical-align:top;}th{background:#e2e8f0;text-align:left;}h1{font-size:22px;margin:0 0 8px 0;}.meta{margin-bottom:16px;color:#475569;}</style>' +
      `</head><body><h1>${escapeHtml(params.title)}</h1>${params.subtitle ? `<div class="meta">${escapeHtml(params.subtitle)}</div>` : ''}<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`,
  );
  popup.document.close();
  popup.focus();
  popup.print();
}
