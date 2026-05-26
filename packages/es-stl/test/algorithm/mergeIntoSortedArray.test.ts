import { mergeIntoSortedArray } from '../../src/algorithm/mergeIntoSortedArray';

const compareNumbers = (a: number, b: number) => a - b;

describe('mergeIntoSortedArray', () => {
  it('inserts before the first greater value and returns the same array', () => {
    const values = [1, 3, 5, 7];

    const result = mergeIntoSortedArray(values, 4, compareNumbers);

    expect(result).toBe(values);
    expect(values).toEqual([1, 3, 4, 5, 7]);
  });

  it('inserts at the beginning, at the end, and after equal values', () => {
    expect(mergeIntoSortedArray([2, 3], 1, compareNumbers)).toEqual([1, 2, 3]);
    expect(mergeIntoSortedArray([1, 2], 3, compareNumbers)).toEqual([1, 2, 3]);
    expect(mergeIntoSortedArray([1, 2, 2, 3], 2, compareNumbers)).toEqual([
      1, 2, 2, 2, 3,
    ]);
  });

  it('inserts into an empty array', () => {
    expect(mergeIntoSortedArray([], 10, compareNumbers)).toEqual([10]);
  });
});
