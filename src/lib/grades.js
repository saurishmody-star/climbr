export const GRADES_V = ['VB','V0','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12'];
export const GRADES_FONT = ['3','4','4+','5','5+','6A','6A+','6B','6B+','6C','6C+','7A','7A+','7B','7B+','7C','7C+','8A'];

// Rough mapping: V-scale index → Font index
export function vToFont(vGrade) {
  const idx = GRADES_V.indexOf(vGrade);
  if (idx < 0) return '';
  const fontIdx = Math.round(idx * (GRADES_FONT.length / GRADES_V.length));
  return GRADES_FONT[Math.min(fontIdx, GRADES_FONT.length - 1)];
}
