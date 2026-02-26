import { GRADES_V, GRADES_FONT, vToFont } from '../lib/grades';

function ConfidenceBadge({ level }) {
  const cls = `badge badge-${level || 'low'}`;
  const labels = { high: 'High', medium: 'Med', low: 'Low' };
  return <span className={cls}>{labels[level] || level}</span>;
}

export default function RouteCard({ route, onChange }) {
  const { color_name, hex, hold_count, confidence, notes } = route;

  function handleVChange(e) {
    const v = e.target.value;
    onChange({ gradeV: v, gradeFont: v ? vToFont(v) : '' });
  }

  return (
    <div className="route-card">
      <div style={{ height: 12, borderRadius: 6, background: hex, marginBottom: 14 }} />

      <div style={styles.nameRow}>
        <span style={styles.name}>{color_name}</span>
        <ConfidenceBadge level={confidence} />
      </div>

      <div style={styles.meta}>{hold_count} holds visible</div>

      <div style={styles.gradeLabel}>Grade</div>
      <div style={styles.gradeRow}>
        <div className="grade-select-wrap">
          <select value={route.gradeV || ''} onChange={handleVChange}>
            <option value="">V-Scale</option>
            {GRADES_V.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="grade-select-wrap">
          <select
            value={route.gradeFont || ''}
            onChange={e => onChange({ gradeFont: e.target.value })}
          >
            <option value="">Font</option>
            {GRADES_FONT.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <textarea
        style={styles.notes}
        placeholder={notes || 'Setter notes...'}
        value={route.setterNotes || ''}
        onChange={e => onChange({ setterNotes: e.target.value })}
        rows={2}
      />
    </div>
  );
}

const styles = {
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e0e0e0',
  },
  meta: {
    fontSize: 11,
    color: '#555',
    marginBottom: 14,
  },
  gradeLabel: {
    fontSize: 10,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 6,
  },
  gradeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 6,
    marginBottom: 10,
  },
  notes: {
    width: '100%',
    background: '#111',
    border: '1px solid #2a2a2a',
    color: '#ccc',
    padding: '7px 10px',
    borderRadius: 6,
    fontSize: 12,
    resize: 'none',
    display: 'block',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
};
