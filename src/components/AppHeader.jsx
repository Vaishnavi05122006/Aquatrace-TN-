import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ urgentCount = 0 }) {
  const { role, displayName, logout } = useAuth();
  const location = useLocation();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>▲</span>
          <span style={styles.brandText}>AquaTrace</span>
        </div>
        <nav style={styles.nav}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(location.pathname === '/' ? styles.navLinkActive : {}),
            }}
          >
            Map
          </Link>
          <Link
            to="/stats"
            style={{
              ...styles.navLink,
              ...(location.pathname === '/stats' ? styles.navLinkActive : {}),
            }}
          >
            Stats
          </Link>
        </nav>
      </div>
      <div style={styles.headerRight}>
        {urgentCount > 0 && (
          <span style={styles.urgentHeaderBadge}>⚠ {urgentCount} URGENT</span>
        )}
        <span style={styles.roleTag}>{role}</span>
        <span style={styles.email}>{displayName}</span>
        <button style={styles.logoutBtn} onClick={logout}>Sign out</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-3) var(--space-5)',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-panel)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-5)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  brandMark: {
    color: 'var(--color-amber)',
    fontSize: 18,
  },
  brandText: {
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: '-0.01em',
  },
  nav: {
    display: 'flex',
    gap: 'var(--space-2)',
  },
  navLink: {
    color: 'var(--color-text-dim)',
    textDecoration: 'none',
    fontSize: 13,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
  },
  navLinkActive: {
    color: 'var(--color-text)',
    background: 'var(--color-bg)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
  },
  roleTag: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--color-amber)',
    border: '1px solid var(--color-amber)',
    borderRadius: 'var(--radius-sm)',
    padding: '2px 8px',
  },
  urgentHeaderBadge: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.03em',
    color: 'var(--color-red)',
    border: '1px solid var(--color-red)',
    borderRadius: 'var(--radius-sm)',
    padding: '2px 8px',
    background: 'rgba(214, 95, 95, 0.1)',
  },
  email: {
    fontSize: 13,
    color: 'var(--color-text-dim)',
    fontFamily: 'var(--font-mono)',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-dim)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 12px',
    fontSize: 12,
  },
};
