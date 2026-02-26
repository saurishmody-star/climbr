import GradeSelector from './GradeSelector';

const CONFIDENCE_STYLES = {
  high:   { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80' },
  medium: { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24' },
  low:    { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
};

export default function RouteCard({ route, onChange }) {
  const { color_name, hex, hold_count, confidence, notes } = route;
  const conf = CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.low;

  return (
    <div className="route-card">
      {/* Colour swatch */}
      <div style={{ height: 44, borderRadius: 8, background: hex, marginBottom: 14, position: 'relative' }}>
        <span style={{
          position: 'absolute',
          bottom: 8,
          left: 10,
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(0,0,0,0.6)',
          letterSpacing: '-0.2px',
        }}>
          {color_name}
        </span>
        <span style={{
          position: 'absolute',
          top: 8,
          right: 8,
          fontSize: 10,
          fontWeight: 600,
          background: conf.bg,
          color: conf.color,
          padding: '2px 6px',
          borderRadius: 99,
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          backdropFilter: 'blur(4px)',
        }}>
          {confidence}
        </span>
      </div>

      <div style={styles.meta}>{hold_count} holds visible</div>

      <div style={styles.gradeLabel}>Grade</div>
      <GradeSelector value={route.gradeV || ''} onChange={v => onChange({ gradeV: v })} />

      {route.gradeV && (
        <div style={styles.gradeDisplay}>{route.gradeV}</div>
      )}

      <textarea
        className="route-notes"
        placeholder={notes || 'Setter notes...'}
        value={route.setterNotes || ''}
        onChange={e => onChange({ setterNotes: e.target.value })}
        rows={2}
      />
    </div>
  );
}

const styles = {
  meta: {
    fontSize: 11,
    color: '#4a4d6a',
    marginBottom: 14,
  },
  gradeLabel: {
    fontSize: 10,
    color: '#4a4d6a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8,
  },
  gradeDisplay: {
    fontSize: 22,
    fontWeight: 800,
    color: '#e8e9f0',
    letterSpacing: '-0.5px',
    margin: '10px 0 8px',
  },
};
