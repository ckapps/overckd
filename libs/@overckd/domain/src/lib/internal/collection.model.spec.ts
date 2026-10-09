import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { Collection, CollectionId, CollectionJson } from './collection.model';

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

  describe('CollectionJson', () => {
    it('should decode and encode with recipes', () => {
      const json = {
        id: 'collection-id',
        name: 'recipe-collection-name',
        description: 'recipe-collection-description',
        recipes: [{ id: 'my-recipe', name: 'recipe-name' }],
      };

      const col = Schema.decodeSync(CollectionJson)(json);

      expect(col).toBeInstanceOf(Collection);
      expect(Schema.encodeSync(CollectionJson)(col)).toEqual(json);
    });
  });
});
