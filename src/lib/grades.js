export const GRADES_V = ['VB','V0','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12'];
export const GRADES_FONT = ['3','4','4+','5','5+','6A','6A+','6B','6B+','6C','6C+','7A','7A+','7B','7B+','7C','7C+','8A'];

export function vToFont(vGrade) {
  const idx = GRADES_V.indexOf(vGrade);
  if (idx < 0) return '';
  const fontIdx = Math.round(idx * (GRADES_FONT.length / GRADES_V.length));
  return GRADES_FONT[Math.min(fontIdx, GRADES_FONT.length - 1)];
}

// Difficulty-based colour for each V grade
export const GRADE_COLORS = {
  VB:  '#4ade80',
  V0:  '#4ade80',
  V1:  '#86efac',
  V2:  '#fbbf24',
  V3:  '#fbbf24',
  V4:  '#fb923c',
  V5:  '#fb923c',
  V6:  '#f97316',
  V7:  '#ef4444',
  V8:  '#ef4444',
  V9:  '#dc2626',
  V10: '#a855f7',
  V11: '#9333ea',
  V12: '#7e22ce',
};
