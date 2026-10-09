import { pipe, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  CountIngredientAmount,
  FractionIngredientAmount,
  IngredientAmount,
  IngredientAmountJson,
  LabelIngredientAmount,
  scaleIngredientAmount,
  UnitIngredientAmount,
} from './ingredient-amount.model';

describe('IngredientAmount', () => {
  const decode = Schema.decodeSync(IngredientAmount);
  const decodeJson = Schema.decodeSync(IngredientAmountJson);

  describe('CountIngredientAmount', () => {
    it('should decode', () => {
      const amount = decode({
        _tag: 'CountIngredientAmount',
        count: 1,
      });

      expect(amount).toBeDefined();
    });
    it('should decode from JSON', () => {
      const amount = decodeJson({
        _tag: 'CountIngredientAmount',
        count: 1,
      });

      expect(amount).toBeDefined();
    });
  });

  describe('FractionIngredientAmount', () => {
    it('should decode', () => {
      const amount = decode({
        _tag: 'FractionIngredientAmount',
        value: 0.5,
      });

      expect(amount).toEqual({
        _tag: 'FractionIngredientAmount',
        value: 0.5,
        scaleFactor: 1,
      });
    });
    it('should decode from JSON', () => {
      const amount = decodeJson({
        _tag: 'FractionIngredientAmount',
        value: 0.25,
        scaleFactor: 0.5,
      });

      expect(amount).toBeDefined();
    });
  });

  describe('UnitIngredientAmount', () => {
    it('should decode', () => {
      const amount = decode({
        _tag: 'UnitIngredientAmount',
        value: 1,
        unit: 'g',
      });

      expect(amount).toBeDefined();
    });
    it('should decode from JSON', () => {
      const amount = decodeJson({
        _tag: 'UnitIngredientAmount',
        value: 1,
        unit: 'g',
      });

      expect(amount).toBeDefined();
    });
  });

  describe('LabelIngredientAmount', () => {
    it('should decode', () => {
      const amount = decode({
        _tag: 'LabelIngredientAmount',
        label: 'label',
      });

      expect(amount).toBeDefined();
    });
    it('should decode from JSON', () => {
      const amount = decodeJson({
        _tag: 'LabelIngredientAmount',
        label: 'label',
      });

      expect(amount).toBeDefined();
    });
  });

  describe('scaleIngredientAmount', () => {
    const flour = UnitIngredientAmount.make({
      unit: 'g',
      value: 150,
      scaleFactor: 1,
    });

    it('scales a value with the portion', () => {
      expect(scaleIngredientAmount(flour, 2)).toEqual({ ...flour, value: 300 });
      expect(scaleIngredientAmount(flour, 0.5)).toEqual({
        ...flour,
        value: 75,
      });
    });

    it('scales a fraction', () => {
      const onion = FractionIngredientAmount.make({
        value: 0.5,
        scaleFactor: 1,
      });

      expect(scaleIngredientAmount(onion, 3)).toEqual({ ...onion, value: 1.5 });
    });

    it('keeps the amount for the same portion', () => {
      expect(scaleIngredientAmount(flour, 1)).toBe(flour);
    });

    it('scales by the power of the scale factor', () => {
      const salt = UnitIngredientAmount.make({
        unit: 'g',
        value: 10,
        scaleFactor: 0.5,
      });
      const chili = UnitIngredientAmount.make({
        unit: 'g',
        value: 2,
        scaleFactor: 2,
      });

      expect(scaleIngredientAmount(salt, 4)).toEqual({ ...salt, value: 20 });
      // The legacy formula, 2 + 2 * (0.25 - 1) * 2, would be negative
      expect(scaleIngredientAmount(chili, 0.25)).toEqual({
        ...chili,
        value: 0.125,
      });
    });

    it('keeps a count for a whole scalar', () => {
      const eggs = CountIngredientAmount.make({ count: 2, scaleFactor: 1 });

      expect(scaleIngredientAmount(eggs, 3)).toEqual(
        CountIngredientAmount.make({ count: 6, scaleFactor: 1 }),
      );
    });

    it('turns a count into a fraction for any other scalar', () => {
      const eggs = CountIngredientAmount.make({ count: 2, scaleFactor: 1 });

      expect(scaleIngredientAmount(eggs, 0.75)).toEqual(
        FractionIngredientAmount.make({ value: 1.5, scaleFactor: 1 }),
      );
      // Even when the result is whole
      expect(scaleIngredientAmount(eggs, 1.5)).toEqual(
        FractionIngredientAmount.make({ value: 3, scaleFactor: 1 }),
      );
    });

    it('keeps a label', () => {
      const pinch = LabelIngredientAmount.make({ label: 'a pinch' });

      expect(scaleIngredientAmount(pinch, 2)).toBe(pinch);
    });

    it('takes the scalar first in a pipe', () => {
      expect(pipe(flour, scaleIngredientAmount(2))).toEqual({
        ...flour,
        value: 300,
      });
    });
  });
});
