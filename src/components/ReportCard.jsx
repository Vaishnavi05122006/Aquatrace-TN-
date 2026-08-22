
import { useState } from 'react';
import StatusDot from './StatusDot';

const STATUS_LABEL = {
  reported: 'Reported',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
};

function formatTimestamp(value) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value.toDate?.() ?? null;
  if (!date) return '—';
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReportCard({
  report,
  selected,
  role,
  onSelect,
  onAcknowledge,
  onResolve,
  onReopen,
  onDelete,
}) {
  const [showPhoto, setShowPhoto] = useState(false);
  const [notes, setNotes] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);

  const canAct = role === 'diver' || role === 'admin';

  return (
    <div
      onClick={() => onSelect(report.id)}
      style={{
        ...styles.card,
        borderColor: selected ? 'var(--color-amber)' : 'var(--color-border)',
      }}
    >
      <div style={styles.headerRow}>
        <div style={styles.statusRow}>
          <StatusDot status={report.status} />
          <span style={styles.statusLabel}>{STATUS_LABEL[report.status] || report.status}</span>
        </div>
        <span style={styles.timestamp}>{formatTimestamp(report.capturedAt)}</span>
      </div>

      <div style={styles.coords}>
        {report.latitude?.toFixed(5)}, {report.longitude?.toFixed(5)}
      </div>

      <div style={styles.reporter}>{report.reporterEmail}</div>

      {report.photoBase64 && (
        <button
          style={styles.photoToggle}
          onClick={(e) => {
            e.stopPropagation();
            setShowPhoto((v) => !v);
          }}
        >
          {showPhoto ? 'Hide photo' : 'View photo'}
        </button>
      )}
      {showPhoto && report.photoBase64 && (
        <img
          src={`data:image/jpeg;base64,${report.photoBase64}`}
          alt="Ghost net sighting evidence"
          style={styles.photo}
        />
      )}

      {report.notes && (
        <p style={styles.notes}>
          <strong>Notes:</strong> {report.notes}
        </p>
      )}

      {canAct && (
        <div style={styles.actions} onClick={(e) => e.stopPropagation()}>
          {report.status === 'reported' && (
            <button style={styles.actionBtn} onClick={() => onAcknowledge(report.id)}>
              Acknowledge
            </button>
          )}

          {report.status === 'acknowledged' && !showResolveForm && (
            <button style={styles.actionBtn} onClick={() => setShowResolveForm(true)}>
              Mark resolved
            </button>
          )}

          {showResolveForm && (
            <div style={styles.resolveForm}>
              <textarea
                placeholder="Resolution notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={styles.textarea}
                rows={2}
              />
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  style={styles.actionBtnPrimary}
                  onClick={() => {
                    onResolve(report.id, notes);
                    setShowResolveForm(false);
                  }}
                >
                  Confirm resolved
                </button>
                <button style={styles.actionBtnGhost} onClick={() => setShowResolveForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {report.status !== 'reported' && !showResolveForm && (
            <button style={styles.actionBtnGhost} onClick={() => onReopen(report.id)}>
              Reopen
            </button>
          )}

          {role === 'admin' && (
            <button
              style={styles.deleteBtn}
              onClick={() => {
                if (window.confirm('Permanently delete this report?')) {
                  onDelete(report.id);
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--color-panel)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3)',
    marginBottom: 'var(--space-3)',
    cursor: 'pointer',
    transition: 'border-color 120ms ease',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-2)',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: 'var(--color-text-dim)',
  },
  timestamp: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--color-text-dim)',
  },
  coords: {
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    marginBottom: 'var(--space-1)',
  },
  reporter: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
    marginBottom: 'var(--space-2)',
  },
  photoToggle: {
    background: 'none',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-dim)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    fontSize: 11,
    marginBottom: 'var(--space-2)',
  },
  photo: {
    width: '100%',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 'var(--space-2)',
    display: 'block',
  },
  notes: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
    margin: '0 0 var(--space-2) 0',
  },
  actions: {
    display: 'flex',
    gap: 'var(--space-2)',
    flexWrap: 'wrap',
    marginTop: 'var(--space-2)',
    paddingTop: 'var(--space-2)',
    borderTop: '1px solid var(--color-border)',
  },
  actionBtn: {
    background: 'var(--color-amber)',
    color: '#1A1206',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700,
  },
  actionBtnPrimary: {
    background: 'var(--color-teal)',
    color: '#0B1D26',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700,
  },
  actionBtnGhost: {
    background: 'none',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-dim)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 10px',
    fontSize: 12,
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid var(--color-red)',
    color: 'var(--color-red)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 10px',
    fontSize: 12,
    marginLeft: 'auto',
  },
  resolveForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    width: '100%',
  },
  textarea: {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
    padding: 'var(--space-2)',
    fontSize: 12,
    fontFamily: 'var(--font-sans)',
    resize: 'vertical',
  },
};
