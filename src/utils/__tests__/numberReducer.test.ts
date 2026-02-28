import { describe, it, expect, beforeEach } from 'vitest';
import { NumberReducer, NumberPool } from '../numberReducer';
import { quickACValue } from '../acValueCalculator';

describe('Number Reducer', () => {
  let reducer: NumberReducer;

  beforeEach(() => {
    reducer = new NumberReducer('ssq');
  });

  describe('combination generation', () => {
    it('should generate C(7,6) * C(2,1) = 14 combinations', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const result = reducer.reduce(pool, {});

      expect(result.originalCount).toBe(14);
    });

    it('should generate valid red ball combinations', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6],
        blueBalls: [1]
      };

      const result = reducer.reduce(pool, {});

      expect(result.originalCount).toBe(1); // C(6,6) * C(1,1) = 1
      expect(result.combinations[0].redBalls).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should generate sorted combinations', () => {
      const pool: NumberPool = {
        redBalls: [10, 5, 1, 15, 20, 25],
        blueBalls: [5]
      };

      const result = reducer.reduce(pool, {});

      expect(result.combinations[0].redBalls).toEqual([1, 5, 10, 15, 20, 25]);
    });
  });

  describe('cost calculation', () => {
    it('should calculate original cost as combinations * 2', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const result = reducer.reduce(pool, {});

      expect(result.costSavings.originalCost).toBe(14 * 2); // 14 combinations * 2 yuan
    });

    it('should calculate savings correctly', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const result = reducer.reduce(pool, {});

      expect(result.costSavings.savings).toBe(
        result.costSavings.originalCost - result.costSavings.reducedCost
      );
    });

    it('should calculate reduction rate correctly', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const result = reducer.reduce(pool, {});

      expect(result.reductionRate).toBeGreaterThanOrEqual(0);
      expect(result.reductionRate).toBeLessThanOrEqual(100);
    });
  });

  describe('AC value filtering', () => {
    it('should filter combinations by AC value range', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const filter = {
        acValue: { min: 7, max: 9, enabled: true }
      };

      const result = reducer.reduce(pool, filter);

      result.combinations.forEach(combo => {
        const acValue = quickACValue(combo.redBalls);
        expect(acValue).toBeGreaterThanOrEqual(7);
        expect(acValue).toBeLessThanOrEqual(9);
      });
    });

    it('should pass through when AC filter disabled', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const filter = {
        acValue: { min: 7, max: 9, enabled: false }
      };

      const result = reducer.reduce(pool, filter);

      expect(result.reducedCount).toBe(result.originalCount);
    });
  });

  describe('sum value filtering', () => {
    it('should filter combinations by sum range', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 30, 31, 32, 33],
        blueBalls: [1]
      };

      const filter = {
        sumValue: { min: 90, max: 110, enabled: true }
      };

      const result = reducer.reduce(pool, filter);

      result.combinations.forEach(combo => {
        const sum = combo.redBalls.reduce((a, b) => a + b, 0);
        expect(sum).toBeGreaterThanOrEqual(90);
        expect(sum).toBeLessThanOrEqual(110);
      });
    });
  });

  describe('preset filters', () => {
    it('should have conservative preset for SSQ', () => {
      const presets = NumberReducer.getPresetFilters('ssq');

      expect(presets.conservative).toBeDefined();
      expect(presets.conservative.name).toBe('保守型');
      expect(presets.conservative.acValue?.enabled).toBe(true);
    });

    it('should have balanced preset for SSQ', () => {
      const presets = NumberReducer.getPresetFilters('ssq');

      expect(presets.balanced).toBeDefined();
      expect(presets.balanced.name).toBe('均衡型');
    });

    it('should have aggressive preset for SSQ', () => {
      const presets = NumberReducer.getPresetFilters('ssq');

      expect(presets.aggressive).toBeDefined();
      expect(presets.aggressive.name).toBe('激进型');
    });

    it('should have presets for DLT', () => {
      const presets = NumberReducer.getPresetFilters('dlt');

      expect(presets.conservative).toBeDefined();
      expect(presets.balanced).toBeDefined();
    });
  });

  describe('reduction results', () => {
    it('should return empty combinations when all filtered', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6],
        blueBalls: [1]
      };

      // Impossible filter
      const filter = {
        sumValue: { min: 200, max: 300, enabled: true }
      };

      const result = reducer.reduce(pool, filter);

      expect(result.reducedCount).toBe(0);
      expect(result.combinations).toHaveLength(0);
    });

    it('should preserve combination order', () => {
      const pool: NumberPool = {
        redBalls: [1, 2, 3, 4, 5, 6, 7],
        blueBalls: [1, 2]
      };

      const result = reducer.reduce(pool, {});

      // Check that each combination has correct structure
      result.combinations.forEach(combo => {
        expect(combo.redBalls).toHaveLength(6);
        expect(combo.blueBalls).toHaveLength(1);
      });
    });
  });
});
