import { describe, expect, it } from 'vitest';
import { RecipeId, RecipeRef } from './recipe.model';

describe('RecipeRef', () => {
  it('should make a new recipe', () => {
    const ref = RecipeRef.make({
      id: RecipeId.make('my-recipe'),
      name: 'name',
    });

    expect(ref).toBeDefined();
  });
});
