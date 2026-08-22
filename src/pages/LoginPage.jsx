import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ERROR_MESSAGES = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-email': 'Please enter a valid email.',
  'auth/too-many-requests': 'Too many attempts. Try again shortly.',
  'auth/network-request-failed': 'No internet connection.',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>▲</span>
          <div>
            <h1 style={styles.title}>AquaTrace</h1>
            <p style={styles.subtitle}>Operations Dashboard</p>
          </div>
        </div>

        <label style={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          style={styles.input}
        />

        <label style={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={styles.input}
        />

        {error && <p style={styles.error} role="alert">{error}</p>}

        <button type="submit" disabled={submitting} style={styles.submit}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p style={styles.footnote}>
          Diver and admin accounts only. Fishermen use the AquaTrace mobile app.
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    padding: 'var(--space-4)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: 'var(--color-panel)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
  },
  brandMark: {
    fontSize: 28,
    color: 'var(--color-amber)',
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    margin: 0,
    fontSize: 13,
    color: 'var(--color-text-dim)',
  },
  label: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginTop: 'var(--space-2)',
  },
  input: {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-3)',
    color: 'var(--color-text)',
    fontSize: 14,
    fontFamily: 'var(--font-mono)',
  },
  error: {
    color: 'var(--color-red)',
    fontSize: 13,
    margin: 0,
  },
  submit: {
    marginTop: 'var(--space-3)',
    background: 'var(--color-amber)',
    color: '#1A1206',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-3)',
    fontWeight: 700,
    fontSize: 14,
  },
  footnote: {
    fontSize: 12,
    color: 'var(--color-text-dim)',
    textAlign: 'center',
    marginTop: 'var(--space-4)',
    marginBottom: 0,
  },
};
