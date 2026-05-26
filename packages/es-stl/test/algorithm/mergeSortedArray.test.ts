import { mergeSortedArray } from '../../src/algorithm/mergeSortedArray';

const compareNumbers = (a: number, b: number) => a - b;

describe('mergeSortedArray', () => {
  it('merges two sorted arrays without mutating either input', () => {
    const first = [1, 4, 9];
    const second = [2, 3, 10];

    const result = mergeSortedArray(first, second, compareNumbers);

    expect(result).toEqual([1, 2, 3, 4, 9, 10]);
    expect(first).toEqual([1, 4, 9]);
    expect(second).toEqual([2, 3, 10]);
    expect(result).not.toBe(first);
    expect(result).not.toBe(second);
  });

  it('handles empty inputs and duplicate values', () => {
    expect(mergeSortedArray([], [1, 2], compareNumbers)).toEqual([1, 2]);
    expect(mergeSortedArray([1, 2], [], compareNumbers)).toEqual([1, 2]);
    expect(mergeSortedArray([], [], compareNumbers)).toEqual([]);
    expect(mergeSortedArray([1, 2, 2], [2, 3], compareNumbers)).toEqual([
      1, 2, 2, 2, 3,
    ]);
  });

  it('supports custom object comparators', () => {
    const result = mergeSortedArray(
      [{ id: 1 }, { id: 4 }],
      [{ id: 2 }, { id: 3 }],
      (a, b) => a.id - b.id
    );

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });
});
