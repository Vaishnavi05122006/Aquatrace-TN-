const STATUS_COLOR = {
  reported: 'var(--color-amber)',
  acknowledged: 'var(--color-amber)',
  resolved: 'var(--color-teal)',
};

export default function StatusDot({ status }) {
  const color = STATUS_COLOR[status] || 'var(--color-text-dim)';
  const pulsing = status === 'reported';

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: pulsing ? `0 0 0 0 ${color}` : 'none',
        animation: pulsing ? 'aquatrace-pulse 1.8s ease-out infinite' : 'none',
      }}
    />
  );
}
