import { toFixed } from '../../src/util/toFixed';

describe('toFixed', () => {
  it('formats numbers with fixed precision and removes insignificant trailing zeroes', () => {
    expect(toFixed(0.101, 2)).toBe('0.1');
    expect(toFixed(1.235, 2)).toBe('1.24');
    expect(toFixed(10, 2)).toBe('10');
  });

  it('uses safe number conversion before formatting', () => {
    expect(toFixed(Number.NaN, 2)).toBe('0');
    expect(toFixed(undefined as unknown as number, 2)).toBe('0');
  });
});
