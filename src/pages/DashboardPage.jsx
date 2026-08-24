import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  acknowledgeReport,
  deleteReport,
  reopenReport,
  resolveReport,
  subscribeToReports,
} from '../services/reportsService';
import MapView from '../components/MapView';
import ReportCard from '../components/ReportCard';
import AppHeader from '../components/AppHeader';

const FILTERS = [
  { key: 'active', label: 'Active', match: (r) => r.status !== 'resolved' },
  { key: 'reported', label: 'Reported', match: (r) => r.status === 'reported' },
  { key: 'acknowledged', label: 'Acknowledged', match: (r) => r.status === 'acknowledged' },
  { key: 'resolved', label: 'Resolved', match: (r) => r.status === 'resolved' },
  { key: 'all', label: 'All', match: () => true },
];

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [reports, setReports] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [filterKey, setFilterKey] = useState('active');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToReports(setReports, (err) => {
      console.error('Reports subscription failed:', err);
      setLoadError('Could not load reports. Check your connection and try refreshing.');
    });
    return unsubscribe;
  }, []);

  const activeFilter = FILTERS.find((f) => f.key === filterKey) ?? FILTERS[0];
  const filteredReports = useMemo(() => {
    const matched = reports.filter(activeFilter.match);
    return [...matched].sort((a, b) => {
      const aUrgent = a.priority === 'urgent' && a.status !== 'resolved';
      const bUrgent = b.priority === 'urgent' && b.status !== 'resolved';
      if (aUrgent === bUrgent) return 0;
      return aUrgent ? -1 : 1;
    });
  }, [reports, activeFilter]);

  const counts = useMemo(() => {
    const c = {};
    for (const f of FILTERS) c[f.key] = reports.filter(f.match).length;
    return c;
  }, [reports]);

  const urgentCount = useMemo(
    () => reports.filter((r) => r.priority === 'urgent' && r.status !== 'resolved').length,
    [reports],
  );

  return (
    <div style={styles.page}>
      <AppHeader urgentCount={urgentCount} />

      <div style={styles.filterBar}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterKey(f.key)}
            style={{
              ...styles.filterTab,
              ...(filterKey === f.key ? styles.filterTabActive : {}),
            }}
          >
            {f.label}
            <span style={styles.filterCount}>{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div style={styles.body}>
        <div style={styles.mapPane}>
          <MapView
            reports={filteredReports}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div style={styles.logPane}>
          {loadError && <p style={styles.errorBanner}>{loadError}</p>}

          {!loadError && filteredReports.length === 0 && (
            <div style={styles.emptyState}>
              <p style={styles.emptyTitle}>No reports here</p>
              <p style={styles.emptyBody}>
                {filterKey === 'active'
                  ? 'Nothing waiting on the water right now.'
                  : 'Nothing matches this filter yet.'}
              </p>
            </div>
          )}

          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              role={role}
              selected={report.id === selectedId}
              onSelect={setSelectedId}
              onAcknowledge={(id) => acknowledgeReport(id, user.uid)}
              onResolve={(id, notes) => resolveReport(id, user.uid, notes)}
              onReopen={reopenReport}
              onDelete={deleteReport}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  filterBar: {
    display: 'flex',
    gap: 'var(--space-2)',
    padding: 'var(--space-3) var(--space-5)',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-panel)',
    overflowX: 'auto',
  },
  filterTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    background: 'none',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-dim)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 12px',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  filterTabActive: {
    borderColor: 'var(--color-amber)',
    color: 'var(--color-text)',
  },
  filterCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    background: 'var(--color-bg)',
    borderRadius: 10,
    padding: '1px 6px',
  },
  body: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
  },
  mapPane: {
    flex: 2,
    minWidth: 0,
  },
  logPane: {
    flex: 1,
    minWidth: 320,
    maxWidth: 420,
    overflowY: 'auto',
    padding: 'var(--space-4)',
    borderLeft: '1px solid var(--color-border)',
  },
  errorBanner: {
    background: 'rgba(214, 95, 95, 0.12)',
    border: '1px solid var(--color-red)',
    color: 'var(--color-red)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-3)',
    fontSize: 13,
  },
  emptyState: {
    textAlign: 'center',
    padding: 'var(--space-6) var(--space-3)',
  },
  emptyTitle: {
    fontWeight: 700,
    margin: '0 0 var(--space-1) 0',
  },
  emptyBody: {
    color: 'var(--color-text-dim)',
    fontSize: 13,
    margin: 0,
  },
};
