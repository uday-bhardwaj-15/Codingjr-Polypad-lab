import type { FractionDisplayMode, SliceAngleInfo } from './fraction.types';

/**
 * Calculates the Greatest Common Divisor (GCD) of two non-negative integers using Euclidean algorithm.
 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x === 0 ? 1 : x;
}

/**
 * Calculates the Least Common Multiple (LCM) of two integers.
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

/**
 * Reduces a fraction to its simplest form.
 */
export function simplifyFraction(
  numerator: number,
  denominator: number
): { numerator: number; denominator: number } {
  if (denominator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const divisor = gcd(numerator, denominator);
  const sign = (numerator * denominator < 0) ? -1 : 1;
  return {
    numerator: sign * Math.abs(Math.round(numerator / divisor)),
    denominator: Math.abs(Math.round(denominator / divisor)),
  };
}

/**
 * Converts a fraction (count / denominator) to a formatted percentage string.
 * Example: toPercent(1, 2) => "50%"
 * Example: toPercent(1, 3) => "33.3%"
 */
export function toPercent(count: number, denominator: number, precision: number = 1): string {
  if (denominator === 0) return '0%';
  const value = (count / denominator) * 100;
  const rounded = Number(value.toFixed(precision));
  // If whole number, don't show decimal point
  return rounded % 1 === 0 ? `${rounded.toFixed(0)}%` : `${rounded}%`;
}

/**
 * Converts a fraction (count / denominator) to a formatted decimal string.
 * Example: toDecimal(1, 4) => "0.25"
 * Example: toDecimal(1, 3) => "0.33"
 */
export function toDecimal(count: number, denominator: number, precision: number = 2): string {
  if (denominator === 0) return '0';
  const value = count / denominator;
  const rounded = Number(value.toFixed(precision));
  return String(rounded);
}

/**
 * Calculates start, end, and mid angles for radial pie-slices of a circle with `denominator` slices.
 * Angles are measured clockwise starting from the top (-90 degrees / -π/2 radians).
 */
export function sliceAngles(denominator: number): SliceAngleInfo[] {
  const safeDenom = Math.max(1, Math.round(denominator));
  const sliceSizeDeg = 360 / safeDenom;
  const sliceSizeRad = (2 * Math.PI) / safeDenom;
  const startOffsetDeg = -90; // Start at 12 o'clock
  const startOffsetRad = -Math.PI / 2;

  const result: SliceAngleInfo[] = [];

  for (let i = 0; i < safeDenom; i++) {
    const startDeg = startOffsetDeg + i * sliceSizeDeg;
    const endDeg = startDeg + sliceSizeDeg;
    const startRad = startOffsetRad + i * sliceSizeRad;
    const endRad = startRad + sliceSizeRad;
    const midRad = startRad + sliceSizeRad / 2;

    result.push({
      index: i,
      startAngleDeg: startDeg,
      endAngleDeg: endDeg,
      startAngleRad: startRad,
      endAngleRad: endRad,
      sweepAngleDeg: sliceSizeDeg,
      midAngleRad: midRad,
    });
  }

  return result;
}

/**
 * Formats a fraction display value based on the selected mode.
 */
export function formatValue(
  count: number,
  denominator: number,
  mode: FractionDisplayMode
): string {
  if (mode === 'hidden') return '';
  if (mode === 'percentage') return toPercent(count, denominator);
  if (mode === 'decimal') return toDecimal(count, denominator);
  return `${count}/${denominator}`;
}

/**
 * Adds two fractions and returns the simplified result.
 */
export function addFractions(
  n1: number,
  d1: number,
  n2: number,
  d2: number
): { numerator: number; denominator: number } {
  if (d1 === 0 || d2 === 0) return { numerator: 0, denominator: 1 };
  const commonDenom = lcm(d1, d2);
  const totalNum = n1 * (commonDenom / d1) + n2 * (commonDenom / d2);
  return simplifyFraction(totalNum, commonDenom);
}

/**
 * Multiplies two fractions and returns the simplified result.
 */
export function multiplyFractions(
  n1: number,
  d1: number,
  n2: number,
  d2: number
): { numerator: number; denominator: number } {
  if (d1 === 0 || d2 === 0) return { numerator: 0, denominator: 1 };
  return simplifyFraction(n1 * n2, d1 * d2);
}
