import { describe, it, expect } from 'vitest';
import {
  quickIntervalCheck,
  analyzeIntervalDistribution,
  filterByIntervalDistribution,
  SSQ_INTERVAL_CONFIG,
} from '../intervalAnalyzer';

describe('Interval Analyzer', () => {
  describe('quickIntervalCheck', () => {
    it('should detect balanced distribution 2:2:2', () => {
      const numbers = [5, 8, 13, 18, 25, 30]; // 2 in each interval
      const result = quickIntervalCheck(numbers, SSQ_INTERVAL_CONFIG);

      expect(result.isBalanced).toBe(true);
      expect(result.ratio).toBe('2:2:2');
    });

    it('should detect balanced distribution 3:2:1', () => {
      const numbers = [5, 8, 10, 15, 20, 28]; // 3:2:1
      const result = quickIntervalCheck(numbers, SSQ_INTERVAL_CONFIG);

      expect(result.isBalanced).toBe(true);
      expect(result.ratio).toBe('3:2:1');
    });

    it('should detect balanced distribution 3:1:2', () => {
      const numbers = [5, 8, 10, 20, 25, 30]; // 3:1:2
      const result = quickIntervalCheck(numbers, SSQ_INTERVAL_CONFIG);

      expect(result.isBalanced).toBe(true);
    });

    it('should detect unbalanced distribution 6:0:0', () => {
      const numbers = [1, 2, 3, 4, 5, 6]; // All in small interval
      const result = quickIntervalCheck(numbers, SSQ_INTERVAL_CONFIG);

      expect(result.isBalanced).toBe(false);
      expect(result.ratio).toBe('6:0:0');
    });

    it('should correctly categorize numbers by interval', () => {
      const numbers = [1, 5, 12, 18, 23, 28]; // 2:2:2
      const result = quickIntervalCheck(numbers, SSQ_INTERVAL_CONFIG);

      // 1,5 in small (01-11)
      // 12,18 in medium (12-22)
      // 23,28 in large (23-33)
      expect(result.ratio).toBe('2:2:2');
    });
  });

  describe('analyzeIntervalDistribution', () => {
    it('should give high balance score for balanced distribution', () => {
      const numbers = [5, 8, 13, 18, 25, 30];
      const analysis = analyzeIntervalDistribution(numbers, SSQ_INTERVAL_CONFIG);

      expect(analysis.balanceScore).toBeGreaterThan(80);
      expect(analysis.isBalanced).toBe(true);
      expect(analysis.isExtreme).toBe(false);
    });

    it('should give maximum score for perfect 2:2:2 distribution', () => {
      const numbers = [5, 8, 13, 18, 25, 30];
      const analysis = analyzeIntervalDistribution(numbers, SSQ_INTERVAL_CONFIG);

      expect(analysis.balanceScore).toBe(100);
    });

    it('should give low balance score for extreme distribution', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const analysis = analyzeIntervalDistribution(numbers, SSQ_INTERVAL_CONFIG);

      expect(analysis.balanceScore).toBeLessThan(50);
      expect(analysis.isBalanced).toBe(false);
      expect(analysis.isExtreme).toBe(true);
    });

    it('should provide recommendation for unbalanced distribution', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const analysis = analyzeIntervalDistribution(numbers, SSQ_INTERVAL_CONFIG);

      expect(analysis.recommendation).toBeDefined();
      expect(analysis.recommendation).toContain('极端');
    });

    it('should provide recommendation for balanced distribution', () => {
      const numbers = [5, 8, 13, 18, 25, 30];
      const analysis = analyzeIntervalDistribution(numbers, SSQ_INTERVAL_CONFIG);

      expect(analysis.recommendation).toBeDefined();
      expect(analysis.recommendation).toContain('均衡');
    });

    it('should calculate correct distribution counts', () => {
      const numbers = [1, 5, 12, 18, 23, 28];
      const analysis = analyzeIntervalDistribution(numbers, SSQ_INTERVAL_CONFIG);

      expect(analysis.distribution.small).toBe(2);
      expect(analysis.distribution.medium).toBe(2);
      expect(analysis.distribution.large).toBe(2);
    });
  });

  describe('filterByIntervalDistribution', () => {
    it('should filter to only balanced distributions', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],      // Unbalanced (6:0:0)
        [5, 8, 13, 18, 25, 30],   // Balanced (2:2:2)
      ];

      const filtered = filterByIntervalDistribution(
        combinations,
        SSQ_INTERVAL_CONFIG,
        { requireBalanced: true }
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0]).toEqual([5, 8, 13, 18, 25, 30]);
    });

    it('should filter out extreme distributions', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],      // Extreme
        [5, 8, 13, 18, 25, 30],   // Balanced
      ];

      const filtered = filterByIntervalDistribution(
        combinations,
        SSQ_INTERVAL_CONFIG,
        { avoidExtreme: true }
      );

      expect(filtered).toHaveLength(1);
    });

    it('should filter by minimum balance score', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],      // Low score
        [5, 8, 13, 18, 25, 30],   // High score (100)
      ];

      const filtered = filterByIntervalDistribution(
        combinations,
        SSQ_INTERVAL_CONFIG,
        { minBalanceScore: 80 }
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0]).toEqual([5, 8, 13, 18, 25, 30]);
    });

    it('should pass all when no filters applied', () => {
      const combinations = [
        [1, 2, 3, 4, 5, 6],
        [5, 8, 13, 18, 25, 30],
      ];

      const filtered = filterByIntervalDistribution(
        combinations,
        SSQ_INTERVAL_CONFIG,
        {}
      );

      expect(filtered).toHaveLength(2);
    });
  });
});
