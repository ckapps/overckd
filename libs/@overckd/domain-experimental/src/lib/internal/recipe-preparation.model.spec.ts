import { Option, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  RecipePreparation,
  UnionRecipePreparation,
} from './recipe-preparation.model';

describe('RecipePreparation', () => {
  const decode = Schema.decodeSync(RecipePreparation);

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

  const labelPortion = {
    label: 'Portion',
  };

  describe('BasicRecipePreparation', () => {
    it('should decode', () => {
      const recipe = decode({
        _tag: 'BasicRecipePreparation',
        id: 'my-recipe',
        name: 'name',
        basedOn: [],
        ingredients: [unitIngredient],
        portion: labelPortion,
        steps: [{ instruction: 'Step 1' }, { instruction: 'Step 2' }],
      });

      expect(recipe).toBeDefined();
    });
  });

  describe('UnionRecipePreparation', () => {
    it('should decode', () => {
      const recipe = decode({
        _tag: 'UnionRecipePreparation',
        id: 'union-recipe',
        name: 'union recipe',
        portion: labelPortion,
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
    it('should decode nested', () => {
      const recipe = decode({
        _tag: 'UnionRecipePreparation',
        id: 'union-recipe',
        name: 'union recipe',
        portion: labelPortion,
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
