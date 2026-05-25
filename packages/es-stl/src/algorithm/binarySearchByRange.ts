import { SearchRangeCallback } from '../type';

/**
 * Finds the index of a sorted range that contains `searchValue`.
 *
 * @remarks
 * The callback writes the searchable range into the provided two-item
 * `range` array as `[start, end]`. Ranges must be ordered from low to high.
 *
 * @typeParam T - Object type that describes each searchable range.
 * @param array - Sorted array of range-like objects.
 * @param searchValue - Numeric value to locate within a range.
 * @param callback - Writes an element's inclusive range bounds.
 * @returns The index of the containing range, or `-1` when no range matches.
 *
 * @example
 * ```ts
 * const dataList = [
 *   { start: 0, end: 5 },
 *   { start: 6, end: 18 },
 *   { start: 19, end: 30 },
 * ];
 *
 * const index = binarySearchByRange(dataList, 10, (range, data) => {
 *   range[0] = data.start;
 *   range[1] = data.end;
 * });
 * // index === 1
 * ```
 */
export function binarySearchByRange<T extends object>(
  array: T[],
  searchValue: number,
  callback: SearchRangeCallback<T>
): number {
  let l: number = 0;
  let r: number = array.length - 1;
  let mid: number;
  const range: number[] = new Array(2);

  while (l <= r) {
    mid = (l + r) >>> 1;
    callback(range, array[mid], mid);
    if (range[1] < searchValue) {
      l = mid + 1;
    } else if (range[0] > searchValue) {
      r = mid - 1;
    } else {
      return mid;
    }
  }

  return -1;
}
