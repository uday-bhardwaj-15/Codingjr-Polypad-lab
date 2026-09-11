import {
  gcd,
  lcm,
  simplifyFraction,
  toPercent,
  toDecimal,
  sliceAngles,
  formatValue,
  addFractions,
  multiplyFractions,
} from './fraction.utils';

describe('Fraction Math Utilities', () => {
  describe('gcd & lcm', () => {
    it('calculates greatest common divisor correctly', () => {
      expect(gcd(12, 18)).toBe(6);
      expect(gcd(7, 13)).toBe(1);
      expect(gcd(24, 60)).toBe(12);
      expect(gcd(0, 5)).toBe(5);
      expect(gcd(8, 8)).toBe(8);
    });

    it('calculates least common multiple correctly', () => {
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(3, 5)).toBe(15);
      expect(lcm(0, 5)).toBe(0);
    });
  });

  describe('simplifyFraction', () => {
    it('simplifies fractions to lowest terms', () => {
      expect(simplifyFraction(4, 8)).toEqual({ numerator: 1, denominator: 2 });
      expect(simplifyFraction(6, 9)).toEqual({ numerator: 2, denominator: 3 });
      expect(simplifyFraction(7, 11)).toEqual({ numerator: 7, denominator: 11 });
    });

    it('handles zero numerator and edge cases', () => {
      expect(simplifyFraction(0, 5)).toEqual({ numerator: 0, denominator: 1 });
      expect(simplifyFraction(5, 0)).toEqual({ numerator: 0, denominator: 1 });
      expect(simplifyFraction(12, 4)).toEqual({ numerator: 3, denominator: 1 });
    });
  });

  describe('toPercent', () => {
    it('formats exact percentages', () => {
      expect(toPercent(1, 2)).toBe('50%');
      expect(toPercent(3, 4)).toBe('75%');
      expect(toPercent(4, 4)).toBe('100%');
      expect(toPercent(0, 6)).toBe('0%');
    });

    it('formats repeating percentages with precision', () => {
      expect(toPercent(1, 3)).toBe('33.3%');
      expect(toPercent(2, 3)).toBe('66.7%');
      expect(toPercent(1, 6)).toBe('16.7%');
    });

    it('handles denominator of zero', () => {
      expect(toPercent(1, 0)).toBe('0%');
    });
  });

  describe('toDecimal', () => {
    it('converts fractions to decimal strings', () => {
      expect(toDecimal(1, 2)).toBe('0.5');
      expect(toDecimal(1, 4)).toBe('0.25');
      expect(toDecimal(3, 8)).toBe('0.38');
      expect(toDecimal(0, 5)).toBe('0');
      expect(toDecimal(5, 5)).toBe('1');
    });

    it('handles denominator of zero', () => {
      expect(toDecimal(1, 0)).toBe('0');
    });
  });

  describe('sliceAngles', () => {
    it('generates correct angles for 4 slices', () => {
      const slices = sliceAngles(4);
      expect(slices.length).toBe(4);
      expect(slices[0].startAngleDeg).toBe(-90);
      expect(slices[0].endAngleDeg).toBe(0);
      expect(slices[0].sweepAngleDeg).toBe(90);

      expect(slices[1].startAngleDeg).toBe(0);
      expect(slices[1].endAngleDeg).toBe(90);

      expect(slices[2].startAngleDeg).toBe(90);
      expect(slices[2].endAngleDeg).toBe(180);

      expect(slices[3].startAngleDeg).toBe(180);
      expect(slices[3].endAngleDeg).toBe(270);
    });

    it('computes 360 degree coverage for 12 slices', () => {
      const slices = sliceAngles(12);
      expect(slices.length).toBe(12);
      expect(slices[0].sweepAngleDeg).toBe(30);
      const totalSweep = slices.reduce((acc, s) => acc + s.sweepAngleDeg, 0);
      expect(Math.round(totalSweep)).toBe(360);
    });

    it('handles single slice circle', () => {
      const slices = sliceAngles(1);
      expect(slices.length).toBe(1);
      expect(slices[0].sweepAngleDeg).toBe(360);
    });
  });

  describe('formatValue', () => {
    it('formats according to display mode', () => {
      expect(formatValue(3, 4, 'fraction')).toBe('3/4');
      expect(formatValue(3, 4, 'percentage')).toBe('75%');
      expect(formatValue(3, 4, 'decimal')).toBe('0.75');
      expect(formatValue(3, 4, 'hidden')).toBe('');
    });
  });

  describe('addFractions & multiplyFractions', () => {
    it('adds fractions with different denominators', () => {
      expect(addFractions(1, 2, 1, 3)).toEqual({ numerator: 5, denominator: 6 });
      expect(addFractions(1, 4, 1, 4)).toEqual({ numerator: 1, denominator: 2 });
    });

    it('multiplies fractions correctly', () => {
      expect(multiplyFractions(2, 3, 3, 4)).toEqual({ numerator: 1, denominator: 2 });
      expect(multiplyFractions(1, 2, 1, 2)).toEqual({ numerator: 1, denominator: 4 });
    });
  });
});
