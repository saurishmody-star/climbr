import { GRADES_V, GRADES_FONT, vToFont } from '../lib/grades';

export default function RouteCard({ route, onChange }) {
  const { color_name, hex, hold_count, confidence, notes } = route;

  function handleVChange(e) {
    const v = e.target.value;
    onChange({ gradeV: v, gradeFont: v ? vToFont(v) : '' });
  }

  function handleFontChange(e) {
    onChange({ gradeFont: e.target.value });
  }

  return (
    <div style={styles.card}>
      <div style={{ ...styles.colorBar, background: hex }} />
      <div style={styles.name}>{color_name}</div>
      <div style={styles.meta}>{hold_count} holds · {confidence} confidence</div>

      <div style={styles.gradeLabel}>Grade</div>
      <div style={styles.gradeRow}>
        <select value={route.gradeV || ''} onChange={handleVChange} style={styles.select}>
          <option value="">V-Scale</option>
          {GRADES_V.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={route.gradeFont || ''} onChange={handleFontChange} style={styles.select}>
          <option value="">Font</option>
          {GRADES_FONT.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
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
  card: {
    background: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: 10,
    padding: 16,
  },
  colorBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 14,
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
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
  select: {
    background: '#111',
    border: '1px solid #2a2a2a',
    color: '#ccc',
    padding: '7px 10px',
    borderRadius: 6,
    fontSize: 12,
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '100%',
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
  },
};
