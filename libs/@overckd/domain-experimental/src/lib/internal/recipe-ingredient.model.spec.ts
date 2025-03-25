import { Option, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { IngredientAmount } from './ingredient-amount.model';
import {
  RecipeIngredient,
  RecipeIngredientJson,
} from './recipe-ingredient.model';

describe('RecipeIngredient', () => {
  const decode = Schema.decodeSync(RecipeIngredient);
  const decodeJson = Schema.decodeSync(RecipeIngredientJson);

  const ingredientAmount: IngredientAmount = {
    _tag: 'LabelIngredientAmount',
    label: 'label',
  };

  it('should decode (without optionals)', () => {
    const ingredient = decode({
      uri: 'ingredient',
      name: 'ingredient',
      amount: Option.none(),
    });

    expect(ingredient).toBeDefined();
  });
  it('should decode (with optionals)', () => {
    const ingredient = decode({
      uri: 'ingredient',
      name: 'ingredient',
      amount: Option.some(ingredientAmount),
      optional: true,
    });

    expect(ingredient).toBeDefined();
  });
  it('should decode from JSON (without optionals)', () => {
    const ingredient = decodeJson({
      uri: 'ingredient',
      name: 'ingredient',
    });

    expect(ingredient).toBeDefined();
  });

  it('should decode from JSON (with optionals)', () => {
    const ingredient = decodeJson({
      uri: 'ingredient',
      name: 'ingredient',
      optional: true,
      amount: ingredientAmount,
    });

    expect(ingredient).toBeDefined();
  });
});
