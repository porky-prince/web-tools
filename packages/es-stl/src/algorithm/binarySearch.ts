import { SearchCallback } from '../type';

/**
 * Finds the index of an item whose projected numeric value equals
 * `searchValue`.
 *
 * @remarks
 * The input array must already be sorted in ascending order by the value
 * returned from `callback`.
 *
 * @typeParam T - Element type stored in the array.
 * @param array - Sorted array to search.
 * @param searchValue - Numeric value to match.
 * @param callback - Projects each element to its comparable numeric value.
 * @returns The matching index, or `-1` when no element matches.
 *
 * @example
 * ```ts
 * const values = [{ id: 1 }, { id: 3 }, { id: 5 }];
 * const index = binarySearch(values, 3, (value) => value.id);
 * // index === 1
 * ```
 */
export function binarySearch<T>(
  array: T[],
  searchValue: number,
  callback: SearchCallback<T>
): number {
  let l: number = 0;
  let r: number = array.length - 1;
  let mid: number, midVal: number;

  while (l <= r) {
    mid = (l + r) >>> 1;
    midVal = callback(array[mid], mid);
    if (midVal === searchValue) {
      return mid;
    } else if (midVal > searchValue) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }

  return -1;
}
