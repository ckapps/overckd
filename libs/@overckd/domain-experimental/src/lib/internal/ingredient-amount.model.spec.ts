import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  IngredientAmount,
  IngredientAmountJson,
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
