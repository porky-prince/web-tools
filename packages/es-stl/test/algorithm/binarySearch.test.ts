import { binarySearch } from '../../src/algorithm/binarySearch';

describe('binarySearch', () => {
  const values = [
    { score: -4 },
    { score: 0 },
    { score: 3 },
    { score: 8 },
    { score: 12 },
  ];

  it('finds values at the beginning, middle, and end of a sorted array', () => {
    expect(binarySearch(values, -4, (value) => value.score)).toBe(0);
    expect(binarySearch(values, 3, (value) => value.score)).toBe(2);
    expect(binarySearch(values, 12, (value) => value.score)).toBe(4);
  });

  it('passes the inspected index to the projection callback', () => {
    const callback = jest.fn((value: { score: number }) => value.score);

    binarySearch(values, 8, callback);

    expect(callback).toHaveBeenCalledWith(values[2], 2);
    expect(callback).toHaveBeenCalledWith(values[3], 3);
  });

  it('returns -1 for an empty array or a missing value', () => {
    expect(binarySearch([], 10, (value: number) => value)).toBe(-1);
    expect(binarySearch(values, 4, (value) => value.score)).toBe(-1);
  });
});
