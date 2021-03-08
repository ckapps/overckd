import { IngredientTagRepository } from '@overckd/domain/dist/repositories';

import { MockIngredientTagRespository } from './ingredient-tag.repository';

describe('MockCollectionsMainMenuGroupComponent', () => {
  let repo: IngredientTagRepository;

  beforeEach(() => {
    repo = MockIngredientTagRespository(new Map());
  });

  it('should create', () => {
    expect(repo).toBeDefined();
  });

  describe('findByQuery', () => {
    it('should find by query', () => {
      const tags$ = repo.findByQuery({
        query: {
          label: 'veg',
        },
      });

      // Call and set result
      let resultItems: any;
      tags$.subscribe(items => (resultItems = items));

      // Assertions
      expect(resultItems).toBeDefined();
      expect(resultItems.result).toBeArrayOfSize(3);
    });
  });
});
