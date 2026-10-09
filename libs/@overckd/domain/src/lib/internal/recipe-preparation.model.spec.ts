import { Option, Schema, Struct } from 'effect';
import { describe, expect, it } from 'vitest';
import { Portion, PortionKind } from './portion.model';
import {
  RecipePreparation,
  RecipePreparationJson,
  UnionRecipePreparation,
} from './recipe-preparation.model';

describe('RecipePreparation', () => {
  const decode = Schema.decodeSync(RecipePreparation);
  const decodeJson = Schema.decodeSync(RecipePreparationJson);
  const encodeJson = Schema.encodeSync(RecipePreparationJson);

  const unitIngredientAmount = {
    _tag: 'UnitIngredientAmount' as const,
    value: 1,
    unit: 'g',
  };
  const unitIngredient = {
    uri: 'ingredient',
    name: 'ingredient',
    amount: Option.some(unitIngredientAmount),
  };
  const unitIngredientJson = {
    uri: 'ingredient',
    name: 'ingredient',
    amount: unitIngredientAmount,
  };

  const quantityPortion: Portion = {
    kind: PortionKind.Quantity,
    label: Option.none(),
    quantity: 1,
  };
  const quantityPortionJson = {
    kind: PortionKind.Quantity as const,
    quantity: 1,
  };
  const basicRecipeJson = (id: string) => ({
    _tag: 'BasicRecipePreparation' as const,
    id,
    name: id,
    tips: [],
    basedOn: [],
    ingredients: [
      {
        ...unitIngredientJson,
        amount: { ...unitIngredientAmount, scaleFactor: 1 },
        optional: false,
        alternatives: [],
      },
    ] as const,
    steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }] as const,
    stepsEnumerated: false,
  });

  describe('BasicRecipePreparation', () => {
    it('should decode', () => {
      const recipe = decode({
        _tag: 'BasicRecipePreparation',
        id: 'my-recipe',
        name: 'name',
        basedOn: [],
        ingredients: [unitIngredient],
        portion: quantityPortion,
        steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
      });

      expect(recipe).toBeDefined();
    });
    it('should decode from JSON', () => {
      const recipe = decodeJson({
        _tag: 'BasicRecipePreparation',
        id: 'my-recipe',
        name: 'name',
        basedOn: [],
        ingredients: [unitIngredientJson],
        portion: quantityPortionJson,
        steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
      });

      expect(recipe).toBeDefined();
    });
    it('should encode to JSON', () => {
      const json: Schema.Codec.Encoded<typeof RecipePreparationJson> = {
        ...basicRecipeJson('my-recipe'),
        portion: quantityPortionJson,
        images: [],
      };

      expect(encodeJson(decodeJson(json))).toEqual(json);
    });
    it('should encode ingredient groups, tips and images to JSON', () => {
      const json: Schema.Codec.Encoded<typeof RecipePreparationJson> = {
        ...basicRecipeJson('my-recipe'),
        ingredients: [
          {
            _tag: 'RecipeIngredientGroup',
            name: 'dough',
            label: 'For the dough',
            ingredients: basicRecipeJson('my-recipe').ingredients,
          },
        ],
        tips: ['Serve warm'],
        stepsEnumerated: true,
        portion: quantityPortionJson,
        images: ['/images/my-recipe.jpeg'],
      };

      expect(encodeJson(decodeJson(json))).toEqual(json);
    });
    it('should decode from JSON without tips, images and stepsEnumerated', () => {
      const recipe = decodeJson({
        ...Struct.omit(basicRecipeJson('my-recipe'), [
          'tips',
          'stepsEnumerated',
        ]),
        portion: quantityPortionJson,
      });

      expect(recipe).toMatchObject({
        tips: [],
        stepsEnumerated: false,
        images: [],
      });
    });
  });

  describe('UnionRecipePreparation', () => {
    it('should decode', () => {
      const recipe = decode({
        _tag: 'UnionRecipePreparation',
        id: 'union-recipe',
        name: 'union recipe',
        portion: quantityPortion,
        recipes: [
          {
            _tag: 'BasicRecipePreparation',
            id: 'recipe-1',
            name: 'recipe-1',
            basedOn: [],
            ingredients: [unitIngredient],
            steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
          },
          {
            _tag: 'BasicRecipePreparation',
            id: 'recipe-2',
            name: 'recipe-2',
            basedOn: [],
            ingredients: [unitIngredient],
            steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
          },
        ],
      });

      expect(recipe).toBeDefined();
    });
    it('should decode from JSON', () => {
      const recipe = decodeJson({
        _tag: 'UnionRecipePreparation',
        id: 'union-recipe',
        name: 'union recipe',
        portion: quantityPortionJson,
        recipes: [
          {
            _tag: 'BasicRecipePreparation',
            id: 'recipe-1',
            name: 'recipe-1',
            basedOn: [],
            ingredients: [unitIngredientJson],
            steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
          },
          {
            _tag: 'BasicRecipePreparation',
            id: 'recipe-2',
            name: 'recipe-2',
            basedOn: [],
            ingredients: [unitIngredientJson],
            steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
          },
        ],
      });

      expect(recipe).toBeDefined();
    });
    it('should encode to JSON', () => {
      const json: Schema.Codec.Encoded<typeof RecipePreparationJson> = {
        _tag: 'UnionRecipePreparation',
        id: 'union-recipe',
        name: 'union recipe',
        tips: [],
        portion: quantityPortionJson,
        images: [],
        recipes: [basicRecipeJson('recipe-1'), basicRecipeJson('recipe-2')],
      };

      expect(encodeJson(decodeJson(json))).toEqual(json);
    });
    it('should decode nested', () => {
      const recipe = decode({
        _tag: 'UnionRecipePreparation',
        id: 'union-recipe',
        name: 'union recipe',
        portion: quantityPortion,
        recipes: [
          {
            _tag: 'UnionRecipePreparation',
            id: 'nested-union-1',
            name: 'nested union 1',
            recipes: [
              {
                _tag: 'BasicRecipePreparation',
                id: 'recipe-1',
                name: 'recipe-1',
                basedOn: [],
                ingredients: [unitIngredient],
                steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
              },
              {
                _tag: 'BasicRecipePreparation',
                id: 'recipe-2',
                name: 'recipe-2',
                basedOn: [],
                ingredients: [unitIngredient],
                steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
              },
            ],
          },
          {
            _tag: 'UnionRecipePreparation',
            id: 'nested-union-2',
            name: 'nested union 2',
            recipes: [
              {
                _tag: 'BasicRecipePreparation',
                id: 'recipe-3',
                name: 'recipe 3',
                basedOn: [],
                ingredients: [unitIngredient],
                steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
              },
              {
                _tag: 'BasicRecipePreparation',
                id: 'recipe-4',
                name: 'recipe 4',
                basedOn: [],
                ingredients: [unitIngredient],
                steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
              },
            ],
          },
        ],
      });

      expect(recipe).toBeDefined();
      expect(recipe._tag).toBe('UnionRecipePreparation');
      const union = recipe as UnionRecipePreparation;
      expect(union.recipes.length).toBe(2);
      const nested1 = union.recipes[0] as UnionRecipePreparation;
      expect(nested1._tag).toBe('UnionRecipePreparation');
      const nested2 = union.recipes[1] as UnionRecipePreparation;
      expect(nested2._tag).toBe('UnionRecipePreparation');
      expect(nested1.recipes[0].name).toBe('recipe-1');
      expect(nested2.recipes[0].name).toBe('recipe 3');
    });
  });
});
