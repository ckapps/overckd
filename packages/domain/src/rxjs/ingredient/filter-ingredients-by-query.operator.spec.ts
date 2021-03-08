import { TestScheduler } from 'rxjs/testing';

import { filterIngredientsByQuery } from './filter-ingredients-by-query.operator';

describe('filterIngredientsByQuery', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  const mockItem1 = {
    name: 'item-1',
    tags: [],
  };
  const mockItem2 = {
    name: 'other',
    tags: [],
  };
  const mockItem3 = {
    name: 'item-3',
    tags: [],
  };

  it('should filter', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const query = {
        query: { name: 'item' },
      };
      const values = {
        a: [mockItem1, query],
        b: [mockItem2, query],
        c: [mockItem3, query],
      };

      // @ts-ignore
      const source$ = cold('abc|', values).pipe(filterIngredientsByQuery());

      expectObservable(source$).toBe('a-c|', values);
    });
  });
});
