import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  FractionIngredientAmount,
  IngredientAmount,
  IngredientAmountJson,
  scale,
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
    it('should scale', () => {
      const amount = FractionIngredientAmount.make({
        value: 0.5,
        scaleFactor: 1,
      });

      expect(scale(amount, 3)).toEqual({ ...amount, value: 1.5 });
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
});
