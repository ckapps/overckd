import { describe, expect, it } from 'vitest';
import { Collection, CollectionId } from './collection.model';

describe('Collection', () => {
  it('should make a new recipe collection', () => {
    const col = Collection.make({
      id: CollectionId.make('collection-id'),
      name: 'recipe-collection-name',
      description: 'recipe-collection-description',
      recipes: [],
    });

    expect(col).toBeDefined();
  });
});
