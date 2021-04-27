import { slug } from './slug';

describe('core/string/slug', () => {
  test.each([
    ['slug', 'slug'],
    ['mock-slug', 'mock slug'],
    ['mock-slug', ' mock slug '],
    ['mock-slug-1', 'mock slug 1'],
    ['mock-slug', 'mock     slug   '],
    ['mock-slug', '     mock     slug'],
  ])('should return slug %p for %p', (expected, value) => {
    const result = slug(value);

    expect(result).toBe(expected);
  });
});
