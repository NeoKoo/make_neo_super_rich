import { describe, it, expect } from 'vitest';
import { quickACValue, calculateACValue, SSQ_AC_CONFIG, filterByACValue } from '../acValueCalculator';

describe('AC Value Calculator', () => {
  describe('quickACValue', () => {
    it('should calculate AC value 8 for optimal SSQ combination', () => {
      // This is a known good value calculated manually
      const numbers = [1, 8, 12, 15, 23, 28];
      const acValue = quickACValue(numbers);

      expect(acValue).toBe(8);
      expect(acValue).toBeGreaterThanOrEqual(7);
      expect(acValue).toBeLessThanOrEqual(9);
    });

    it('should return 0 for simple consecutive numbers', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const acValue = quickACValue(numbers);

      expect(acValue).toBe(0);
    });

    it('should handle empty array', () => {
      const acValue = quickACValue([]);
      expect(acValue).toBe(0);
    });

    it('should handle single number', () => {
      const acValue = quickACValue([5]);
      expect(acValue).toBe(0);
    });

    it('should handle two numbers', () => {
      const acValue = quickACValue([1, 33]);
      expect(acValue).toBe(0); // 1 - 2 + 1 = 0
    });

    it('should calculate correctly for spread out numbers', () => {
      const numbers = [1, 11, 21, 31, 32, 33];
      const acValue = quickACValue(numbers);

      expect(acValue).toBeGreaterThan(5);
    });
  });

  describe('calculateACValue', () => {
    it('should return optimal level for AC value 8 (SSQ)', () => {
      const numbers = [1, 8, 12, 15, 23, 28];
      const result = calculateACValue(numbers, SSQ_AC_CONFIG);

      expect(result.acValue).toBe(8);
      expect(result.level).toBe('optimal');
      expect(result.recommendation).toContain('最优');
    });

    it('should return low level for AC value below 7 (SSQ)', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const result = calculateACValue(numbers, SSQ_AC_CONFIG);

      expect(result.acValue).toBeLessThan(7);
      expect(result.level).toBe('low');
      expect(result.recommendation).toContain('过低');
    });

    it('should calculate all pairwise differences', () => {
      const numbers = [1, 8, 12, 15, 23, 28];
      const result = calculateACValue(numbers, SSQ_AC_CONFIG);

      // C(6,2) = 15 pairs
      expect(result.differences).toHaveLength(15);
    });

    it('should calculate unique differences correctly', () => {
      const numbers = [1, 8, 12, 15, 23, 28];
      const result = calculateACValue(numbers, SSQ_AC_CONFIG);

      // For this combination: 13 unique differences (3,4,5,7,8,11,13,14,15,16,20,22,27)
      expect(result.uniqueDifferences).toBe(13);
    });
  });

  describe('filterByACValue', () => {
    it('should filter combinations within AC range 7-9', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],      // AC = 0 (filtered out)
        [1, 8, 12, 15, 23, 28],  // AC = 8 (kept)
        [1, 7, 13, 19, 25, 31],  // AC = 10 (filtered out)
      ];

      const filtered = filterByACValue(combinations, SSQ_AC_CONFIG, 7, 9);

      expect(filtered).toHaveLength(1);
      expect(filtered[0]).toEqual([1, 8, 12, 15, 23, 28]);
    });

    it('should pass all combinations when range is 0-10', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],
        [1, 8, 12, 15, 23, 28],
        [1, 7, 13, 19, 25, 31],
      ];

      const filtered = filterByACValue(combinations, SSQ_AC_CONFIG, 0, 10);

      expect(filtered).toHaveLength(3);
    });

    it('should return empty array when no combinations match', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7],
      ];

      const filtered = filterByACValue(combinations, SSQ_AC_CONFIG, 8, 9);

      expect(filtered).toHaveLength(0);
    });
  });
});
