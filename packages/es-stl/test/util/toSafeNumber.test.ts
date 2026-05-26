import { toSafeNumber } from '../../src/util/toSafeNumber';

describe('toSafeNumber', () => {
  it('converts numeric-like values and normalizes falsy numeric results to zero', () => {
    expect(toSafeNumber('12.5')).toBe(12.5);
    expect(toSafeNumber(true)).toBe(1);
    expect(toSafeNumber(false)).toBe(0);
    expect(toSafeNumber('')).toBe(0);
    expect(toSafeNumber(undefined)).toBe(0);
    expect(toSafeNumber(Number.NaN)).toBe(0);
    expect(toSafeNumber(-0)).toBe(0);
  });
});
