import { UriFactory } from './uri-factory';

describe('utils/uri-factory', () => {
  test.each([
    ['overckd://', []],
    ['overckd://test', ['test']],
    ['overckd://test/mock', ['test', 'mock']],
  ])('should start with %p with base %p', (expected, base) => {
    const factory = UriFactory(base);

    const result1 = factory('');
    expect(result1.startsWith(expected)).toBe(true);
  });
});
