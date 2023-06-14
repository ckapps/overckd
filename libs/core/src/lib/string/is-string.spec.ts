import { isString } from './is-string';

describe('core/string/is-string', () => {
  test.each([
    [true, 'mock'],
    [true, ''],
    [false, true],
    [false, false],
    [false, 123],
    [false, 0],
    [false, null],
    [false, undefined],
    [false, {}],
  ])('should return %p for %p', (expected, value) => {
    const result = isString(value);

    expect(result).toBe(expected);
  });
});
