import { GRADES_V, GRADE_COLORS } from '../lib/grades';

export default function GradeSelector({ value, onChange }) {
  return (
    <div style={styles.track}>
      {GRADES_V.map(g => {
        const selected = value === g;
        const color = GRADE_COLORS[g];
        return (
          <button
            key={g}
            onClick={() => onChange(selected ? '' : g)}
            style={{
              ...styles.pill,
              background: selected ? color : '#1c1e38',
              color: selected ? '#0c0d1a' : '#4a4d6a',
              border: selected ? 'none' : '1px solid #252845',
              fontWeight: selected ? 700 : 500,
              transform: selected ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  track: {
    display: 'flex',
    gap: 5,
    overflowX: 'auto',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  pill: {
    flexShrink: 0,
    padding: '5px 9px',
    borderRadius: 99,
    fontSize: 11,
    cursor: 'pointer',
    transition: 'all 0.15s',
    lineHeight: 1,
  },
};
