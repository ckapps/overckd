import { describe, expect, it } from 'vitest';
import { RecipeCollectionId } from './recipe-collection-shared.model';
import * as RecipeCollection from './recipe-collection.model';

describe('RecipeCollection', () => {
  it('should make a new recipe collection', () => {
    const col = RecipeCollection.RecipeCollection.make({
      id: RecipeCollectionId.make('recipe-collection-id'),
      name: 'recipe-collection-name',
      description: 'recipe-collection-description',
      recipes: [],
    });

    expect(col).toBeDefined();
  });
});
