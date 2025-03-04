import * as Slug from './slug';

describe('domain/slug', () => {
  it('should fail make without slug', () => {
    expect(() => Slug.Slug.make('invalid slug')).toThrow();
  });

  test.each([
    ['slug', 'slug'],
    ['mock-slug', 'mock slug'],
    ['mock-slug', ' mock slug '],
    ['mock-slug-1', 'mock slug 1'],
    ['mock-slug', 'mock     slug   '],
    ['mock-slug', '     mock     slug'],
  ])('should create slug %p from %p', (expected, value) => {
    const result = Slug.fromString(value);

    expect(result).toBe(expected);
  });
});
