import { Option, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  IngredientAmount,
  UnitIngredientAmount,
} from './ingredient-amount.model';
import { IngredientId } from './ingredient.model';
import {
  RecipeIngredient,
  RecipeIngredientGroupJson,
  RecipeIngredientJson,
  scaleRecipeIngredient,
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
      alternatives: ['other ingredient'],
    });

    expect(ingredient.alternatives).toEqual(['other ingredient']);
  });
  it('should decode from JSON without alternatives', () => {
    const ingredient = decodeJson({ uri: 'ingredient', name: 'ingredient' });

    expect(ingredient.alternatives).toEqual([]);
  });
});

describe('RecipeIngredientGroup', () => {
  const decodeJson = Schema.decodeSync(RecipeIngredientGroupJson);
  const encodeJson = Schema.encodeSync(RecipeIngredientGroupJson);

  it('should encode to JSON', () => {
    const json: Schema.Codec.Encoded<typeof RecipeIngredientGroupJson> = {
      _tag: 'RecipeIngredientGroup',
      name: 'filling',
      label: 'For the filling',
      ingredients: [
        {
          uri: 'jam',
          name: 'Jam',
          amount: { _tag: 'LabelIngredientAmount', label: 'a glass' },
          optional: false,
          alternatives: [],
        },
      ],
    };

    expect(encodeJson(decodeJson(json))).toEqual(json);
  });
  it('should not decode without ingredients', () => {
    expect(() =>
      Schema.decodeUnknownSync(RecipeIngredientGroupJson)({
        _tag: 'RecipeIngredientGroup',
        name: 'filling',
        label: 'For the filling',
        ingredients: [],
      }),
    ).toThrow();
  });
});

describe('scaleRecipeIngredient', () => {
  const flour = RecipeIngredient.make({
    uri: IngredientId.make('flour'),
    name: 'Flour',
    amount: Option.some(
      UnitIngredientAmount.make({ unit: 'g', value: 150, scaleFactor: 1 }),
    ),
    optional: true,
    alternatives: ['spelt flour'],
  });

  it('scales the amount and keeps the rest', () => {
    expect(scaleRecipeIngredient(flour, 2)).toEqual(
      RecipeIngredient.make({
        ...flour,
        amount: Option.some(
          UnitIngredientAmount.make({ unit: 'g', value: 300, scaleFactor: 1 }),
        ),
      }),
    );
  });

  it('keeps an ingredient without amount', () => {
    const salt = RecipeIngredient.make({ ...flour, amount: Option.none() });

    expect(scaleRecipeIngredient(salt, 2).amount).toEqual(Option.none());
  });
});
