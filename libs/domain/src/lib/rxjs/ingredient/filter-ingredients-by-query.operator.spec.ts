import { TestScheduler } from 'rxjs/testing';

import { filterIngredientsByQuery } from './filter-ingredients-by-query.operator';

describe('filterIngredientsByQuery', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  const mockUri1 = 'uri-1';
  const mockUri2 = 'uri-2';
  const mockUri3 = 'uri-3';

  const mockItem1 = {
    name: 'item-1',
    tags: [{ uri: mockUri1 }],
  };
  const mockItem2 = {
    name: 'other',
    tags: [],
  };
  const mockItem3 = {
    name: 'item-3',
    tags: [{ uri: mockUri1 }, { uri: mockUri2 }, { uri: mockUri3 }],
  };

  describe('query by name', () => {
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

        const source$ = cold<any>('abc|', values).pipe(
          filterIngredientsByQuery(),
        );

        expectObservable(source$).toBe('a-c|', values);
      });
    });
  });

  describe('query by tags', () => {
    it('should filter with single uri', () => {
      testScheduler.run(({ expectObservable, cold }) => {
        const query1 = {
          query: { tags: [mockUri1] },
        };
        const query2 = {
          query: { tags: [mockUri2] },
        };
        const query3 = {
          query: { tags: [mockUri3] },
        };
        const values = {
          // First pass
          a: [mockItem1, query1],
          b: [mockItem2, query1],
          c: [mockItem3, query1],
          // Second pass
          d: [mockItem1, query2],
          e: [mockItem2, query2],
          f: [mockItem3, query2],
          // Third pass
          g: [mockItem1, query3],
          h: [mockItem2, query3],
          i: [mockItem3, query3],
        };

        const source$ = cold<any>('abcdefghi|', values).pipe(
          filterIngredientsByQuery(),
        );

        expectObservable(source$).toBe('a-c--f--i|', values);
      });
    });

    it('should filter with multiple uris', () => {
      testScheduler.run(({ expectObservable, cold }) => {
        const query1 = {
          query: { tags: [mockUri1, mockUri2] },
        };
        const query2 = {
          query: { tags: [mockUri2, mockUri3] },
        };
        const query3 = {
          query: { tags: [mockUri1, mockUri3] },
        };
        const values = {
          // First pass
          a: [mockItem1, query1],
          b: [mockItem2, query1],
          c: [mockItem3, query1],
          // Second pass
          d: [mockItem1, query2],
          e: [mockItem2, query2],
          f: [mockItem3, query2],
          // Third pass
          g: [mockItem1, query3],
          h: [mockItem2, query3],
          i: [mockItem3, query3],
        };

        const source$ = cold<any>('abcdefghi|', values).pipe(
          filterIngredientsByQuery(),
        );

        expectObservable(source$).toBe('a-c--fg-i|', values);
      });
    });
  });
});
