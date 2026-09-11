/**
 * Curated Math Color Palette
 * Designed for high contrast, colorblind accessibility, and rich visual appeal.
 */

export const FRACTION_COLORS: Record<number, string> = {
  1: '#E11D48',  // 1 (Whole): Rose 600
  2: '#EA580C',  // 1/2: Orange 600
  3: '#16A34A',  // 1/3: Green 600
  4: '#0284C7',  // 1/4: Light Blue 600
  5: '#2563EB',  // 1/5: Blue 600
  6: '#7C3AED',  // 1/6: Violet 600
  7: '#D97706',  // 1/7: Amber 600
  8: '#059669',  // 1/8: Emerald 600
  9: '#4F46E5',  // 1/9: Indigo 600
  10: '#9333EA', // 1/10: Purple 600
  11: '#0D9488', // 1/11: Teal 600
  12: '#DB2777', // 1/12: Pink 600
};

export const COLOR_SWATCHES = [
  '#E11D48', // Rose
  '#EA580C', // Orange
  '#D97706', // Amber
  '#16A34A', // Green
  '#059669', // Emerald
  '#0D9488', // Teal
  '#0284C7', // Sky
  '#2563EB', // Blue
  '#4F46E5', // Indigo
  '#7C3AED', // Violet
  '#9333EA', // Purple
  '#DB2777', // Pink
  '#475569', // Slate
  '#1E293B', // Dark Navy
];

export const CATEGORY_THEMES = {
  fractions: {
    name: 'Fractions',
    primary: '#E11D48',
    gradient: 'from-rose-500 to-amber-500',
    bgLight: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-500',
  },
  numbers: {
    name: 'Numbers',
    primary: '#0284C7',
    gradient: 'from-sky-500 to-indigo-500',
    bgLight: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-500',
  },
  geometry: {
    name: 'Geometry',
    primary: '#16A34A',
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-500',
  },
  algebra: {
    name: 'Algebra',
    primary: '#7C3AED',
    gradient: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    text: 'text-violet-500',
  },
  probability: {
    name: 'Probability',
    primary: '#D97706',
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-500',
  },
  applications: {
    name: 'Applications',
    primary: '#0D9488',
    gradient: 'from-teal-500 to-cyan-500',
    bgLight: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    text: 'text-teal-500',
  },
};

export function getFractionColor(denominator: number): string {
  return FRACTION_COLORS[denominator] || '#0284C7';
}
