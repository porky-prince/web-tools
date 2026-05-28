import { binarySearchByRange } from '../../src/algorithm/binarySearchByRange';

describe('binarySearchByRange', () => {
  const ranges = [
    { start: -10, end: -1, label: 'negative' },
    { start: 0, end: 5, label: 'low' },
    { start: 6, end: 10, label: 'middle' },
    { start: 11, end: 20, label: 'high' },
  ];

  it('finds the range whose inclusive bounds contain the search value', () => {
    const toRange = (range: number[], value: (typeof ranges)[number]): void => {
      range[0] = value.start;
      range[1] = value.end;
    };

    expect(binarySearchByRange(ranges, -10, toRange)).toBe(0);
    expect(binarySearchByRange(ranges, 5, toRange)).toBe(1);
    expect(binarySearchByRange(ranges, 6, toRange)).toBe(2);
    expect(binarySearchByRange(ranges, 20, toRange)).toBe(3);
  });

  it('passes a reusable range array, element, and index to the callback', () => {
    const callback = jest.fn(
      (range: number[], value: (typeof ranges)[number]) => {
        range[0] = value.start;
        range[1] = value.end;
      }
    );

    binarySearchByRange(ranges, 12, callback);

    expect(callback).toHaveBeenCalledWith(expect.any(Array), ranges[1], 1);
    expect(callback).toHaveBeenCalledWith(expect.any(Array), ranges[2], 2);
    expect(callback).toHaveBeenCalledWith(expect.any(Array), ranges[3], 3);
  });

  it('returns -1 when no range contains the value', () => {
    expect(
      binarySearchByRange(ranges, 21, (range, value) => {
        range[0] = value.start;
        range[1] = value.end;
      })
    ).toBe(-1);
    expect(
      binarySearchByRange([], 1, (range, value: { start: number }) => {
        range[0] = value.start;
        range[1] = value.start;
      })
    ).toBe(-1);
  });
});
