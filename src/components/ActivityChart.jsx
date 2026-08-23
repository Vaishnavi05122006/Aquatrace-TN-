export default function ActivityChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div style={styles.wrapper}>
      {data.map((d) => (
        <div key={d.date} style={styles.barColumn} title={`${d.date}: ${d.count}`}>
          <div
            style={{
              ...styles.bar,
              height: `${Math.max((d.count / max) * 100, d.count > 0 ? 6 : 2)}%`,
              background: d.count > 0 ? 'var(--color-amber)' : 'var(--color-border)',
            }}
          />
          <span style={styles.dayLabel}>
            {new Date(d.date).toLocaleDateString(undefined, { day: 'numeric' })}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 4,
    height: 120,
    padding: '8px 0',
  },
  barColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: '3px 3px 0 0',
    minHeight: 2,
    transition: 'height 200ms ease',
  },
  dayLabel: {
    fontSize: 9,
    color: 'var(--color-text-dim)',
    fontFamily: 'var(--font-mono)',
    marginTop: 4,
  },
};
