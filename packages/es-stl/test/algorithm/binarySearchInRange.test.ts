import { binarySearchInRange } from '../../src/algorithm/binarySearchInRange';

describe('binarySearchInRange', () => {
  const breakpoints = [0, 100, 300, 700].map((value) => ({ value }));

  it('finds the greatest index whose value is less than or equal to the search value', () => {
    expect(binarySearchInRange(breakpoints, 0, (entry) => entry.value)).toBe(0);
    expect(binarySearchInRange(breakpoints, 125, (entry) => entry.value)).toBe(
      1
    );
    expect(binarySearchInRange(breakpoints, 700, (entry) => entry.value)).toBe(
      3
    );
    expect(binarySearchInRange(breakpoints, 999, (entry) => entry.value)).toBe(
      3
    );
  });

  it('returns -1 when the search value is before the first element or the array is empty', () => {
    expect(binarySearchInRange(breakpoints, -1, (entry) => entry.value)).toBe(
      -1
    );
    expect(binarySearchInRange([], 1, (entry: number) => entry)).toBe(-1);
  });
});
