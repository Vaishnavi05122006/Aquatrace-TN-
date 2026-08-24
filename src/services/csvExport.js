function csvEscape(value) {
  if (value == null) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toDateString(value) {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value.toDate?.() ?? null;
  return date ? date.toISOString() : '';
}

const COLUMNS = [
  { header: 'Report ID', get: (r) => r.id },
  { header: 'Status', get: (r) => r.status },
  { header: 'Priority', get: (r) => r.priority || 'normal' },
  { header: 'Net Type', get: (r) => r.netType || 'unknown' },
  { header: 'Latitude', get: (r) => r.latitude },
  { header: 'Longitude', get: (r) => r.longitude },
  { header: 'Reporter Email', get: (r) => r.reporterEmail },
  { header: 'Captured At', get: (r) => toDateString(r.capturedAt) },
  { header: 'Synced At', get: (r) => toDateString(r.syncedAt) },
  { header: 'Resolved At', get: (r) => toDateString(r.resolvedAt) },
  { header: 'Resolved By', get: (r) => r.resolvedBy || '' },
  { header: 'Notes', get: (r) => r.notes || '' },
];

export function reportsToCsv(reports) {
  const header = COLUMNS.map((c) => csvEscape(c.header)).join(',');
  const rows = reports.map((r) => COLUMNS.map((c) => csvEscape(c.get(r))).join(','));
  return [header, ...rows].join('\r\n');
}

export function downloadReportsCsv(reports, filenamePrefix = 'aquatrace-reports') {
  const csv = reportsToCsv(reports);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  link.download = `${filenamePrefix}-${timestamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
