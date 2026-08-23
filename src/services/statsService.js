function toDate(value) {
  if (!value) return null;
  if (typeof value === 'string') return new Date(value);
  if (value.toDate) return value.toDate();
  return null;
}

function averageResolutionHours(reports) {
  const resolved = reports.filter((r) => r.status === 'resolved' && r.capturedAt && r.resolvedAt);
  if (resolved.length === 0) return null;

  const totalMs = resolved.reduce((sum, r) => {
    const start = toDate(r.capturedAt);
    const end = toDate(r.resolvedAt);
    if (!start || !end) return sum;
    return sum + (end.getTime() - start.getTime());
  }, 0);

  return totalMs / resolved.length / (1000 * 60 * 60);
}

function reportsPerDay(reports, days = 14) {
  const buckets = new Map();
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const r of reports) {
    const date = toDate(r.capturedAt);
    if (!date) continue;
    const key = date.toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

function topReporters(reports, limit = 5) {
  const counts = new Map();
  for (const r of reports) {
    if (!r.reporterEmail) continue;
    counts.set(r.reporterEmail, (counts.get(r.reporterEmail) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([email, count]) => ({ email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function computeStats(reports) {
  const total = reports.length;
  const byStatus = {
    reported: reports.filter((r) => r.status === 'reported').length,
    acknowledged: reports.filter((r) => r.status === 'acknowledged').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };
  const urgentActive = reports.filter(
    (r) => r.priority === 'urgent' && r.status !== 'resolved',
  ).length;
  const urgentTotal = reports.filter((r) => r.priority === 'urgent').length;

  return {
    total,
    byStatus,
    urgentActive,
    urgentTotal,
    avgResolutionHours: averageResolutionHours(reports),
    dailyActivity: reportsPerDay(reports),
    topReporters: topReporters(reports),
  };
}
