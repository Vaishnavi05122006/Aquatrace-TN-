import { useEffect, useMemo, useState } from 'react';
import { subscribeToReports } from '../services/reportsService';
import { computeStats } from '../services/statsService';
import ActivityChart from '../components/ActivityChart';
import AppHeader from '../components/AppHeader';

export default function StatsPage() {
  const [reports, setReports] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToReports(setReports, (err) => {
      console.error('Reports subscription failed:', err);
      setLoadError('Could not load reports. Check your connection and try refreshing.');
    });
    return unsubscribe;
  }, []);

  const stats = useMemo(() => computeStats(reports), [reports]);

  return (
    <div style={styles.pageWrapper}>
      <AppHeader urgentCount={stats.urgentActive} />

      {loadError ? (
        <p style={styles.errorBanner}>{loadError}</p>
      ) : (
        <div style={styles.page}>
          <div style={styles.cardGrid}>
            <StatCard label="Total reports" value={stats.total} />
            <StatCard label="Reported" value={stats.byStatus.reported} accent="amber" />
            <StatCard label="Acknowledged" value={stats.byStatus.acknowledged} accent="amber" />
            <StatCard label="Resolved" value={stats.byStatus.resolved} accent="teal" />
            <StatCard label="Active urgent" value={stats.urgentActive} accent="red" />
            <StatCard
              label="Avg. resolution time"
              value={
                stats.avgResolutionHours == null
                  ? '—'
                  : stats.avgResolutionHours < 1
                    ? `${Math.round(stats.avgResolutionHours * 60)}m`
                    : `${stats.avgResolutionHours.toFixed(1)}h`
              }
            />
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Reports filed — last 14 days</h2>
            {stats.total === 0 ? (
              <p style={styles.emptyText}>No reports yet.</p>
            ) : (
              <ActivityChart data={stats.dailyActivity} />
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Most active reporters</h2>
            {stats.topReporters.length === 0 ? (
              <p style={styles.emptyText}>No reports yet.</p>
            ) : (
              <div style={styles.reporterList}>
                {stats.topReporters.map((r, i) => (
                  <div key={r.email} style={styles.reporterRow}>
                    <span style={styles.reporterRank}>{i + 1}</span>
                    <span style={styles.reporterEmail}>{r.email}</span>
                    <span style={styles.reporterCount}>{r.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentColor = {
    amber: 'var(--color-amber)',
    teal: 'var(--color-teal)',
    red: 'var(--color-red)',
  }[accent];

  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardValue, color: accentColor || 'var(--color-text)' }}>
        {value}
      </div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  page: {
    padding: 'var(--space-5)',
    overflowY: 'auto',
    flex: 1,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-6)',
  },
  card: {
    background: 'var(--color-panel)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
  },
  cardValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
  },
  section: {
    marginBottom: 'var(--space-6)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 'var(--space-3)',
    color: 'var(--color-text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  emptyText: {
    color: 'var(--color-text-dim)',
    fontSize: 13,
  },
  reporterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  reporterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    background: 'var(--color-panel)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-2) var(--space-3)',
  },
  reporterRank: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--color-text-dim)',
    width: 16,
  },
  reporterEmail: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
  },
  reporterCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--color-amber)',
    fontWeight: 700,
  },
  errorBanner: {
    margin: 'var(--space-5)',
    background: 'rgba(214, 95, 95, 0.12)',
    border: '1px solid var(--color-red)',
    color: 'var(--color-red)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-3)',
    fontSize: 13,
  },
};
