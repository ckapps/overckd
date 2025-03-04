import * as Uri from './uri';

describe('domain/uri', () => {
  it('should fail make without slug', () => {
    expect(() => Uri.Uri.make('invalid slug')).toThrow();
  });

  test.each([
    ['slug', 'slug'],
    ['mock-slug', 'mock slug'],
    ['mock-slug', ' mock slug '],
    ['mock-slug-1', 'mock slug 1'],
    ['mock-slug', 'mock     slug   '],
    ['mock-slug', '     mock     slug'],
  ])('should create slug %p from %p', (expected, value) => {
    const result = Uri.fromString(value);

    expect(result).toBe(expected);
  });
});
