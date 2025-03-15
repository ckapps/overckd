import { describe, expect, it } from 'vitest';
import { RecipeRef } from './recipe-ref.model';
import { RecipeId } from './recipe-shared.model';

describe('RecipeRef', () => {
  it('should make a new recipe', () => {
    const ref = RecipeRef.make({
      id: RecipeId.make('my-recipe'),
      name: 'name',
    });

    expect(ref).toBeDefined();
  });
});
