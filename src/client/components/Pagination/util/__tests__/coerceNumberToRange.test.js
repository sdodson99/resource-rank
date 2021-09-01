import coerceNumberToRange from '../coerceNumberToRange';

describe('coerceNumberToRange', () => {
  it('should return min if number is less than min', () => {
    const min = 5;

    const number = coerceNumberToRange(-1, min, 100);

    expect(number).toBe(min);
  });

  it('should return max if number is greater than min', () => {
    const max = 100;

    const number = coerceNumberToRange(101, 1, max);

    expect(number).toBe(max);
  });

  it('should return number if number is within min and max', () => {
    const expected = 5;

    const actual = coerceNumberToRange(expected, 0, 10);

    expect(actual).toBe(expected);
  });
});
