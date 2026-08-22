import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.dim}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'diver' && role !== 'admin') {
    return (
      <div style={styles.centered}>
        <div style={styles.messageBox}>
          <p style={styles.title}>This account isn't set up for dashboard access.</p>
          <p style={styles.dim}>
            The AquaTrace dashboard is for rescue divers and administrators.
            Fishermen accounts use the AquaTrace mobile app to file reports.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

const styles = {
  centered: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    padding: 'var(--space-4)',
  },
  messageBox: {
    maxWidth: 420,
    textAlign: 'center',
  },
  title: {
    fontWeight: 700,
    marginBottom: 'var(--space-2)',
  },
  dim: {
    color: 'var(--color-text-dim)',
    fontSize: 13,
  },
};
