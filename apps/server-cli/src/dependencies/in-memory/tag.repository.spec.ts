import { TagRepository } from '@overckd/domain';

import { MockTagRespository } from './tag.repository';

describe('MockTagRespository', () => {
  let repo: TagRepository;

  beforeEach(() => {
    repo = MockTagRespository(new Map());
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
