import { SearchCallback } from '../type';

/**
 * Finds the greatest index whose projected numeric value is less than or
 * equal to `searchValue`.
 *
 * @remarks
 * This is useful for locating the lower bound segment of a half-open range
 * sequence such as `[array[i], array[i + 1])`. The array must already be
 * sorted in ascending order by the callback value.
 *
 * @typeParam T - Element type stored in the array.
 * @param array - Sorted array to search.
 * @param searchValue - Numeric value to locate.
 * @param callback - Projects each element to its comparable numeric value.
 * @returns The greatest matching lower-bound index, or `-1` before the first
 * element.
 *
 * @example
 * ```ts
 * const dataList = [
 *   { value: 0 },
 *   { value: 100 },
 *   { value: 300 },
 *   { value: 700 },
 * ];
 *
 * binarySearchInRange(dataList, 125, (data) => data.value);
 * // => 1
 * ```
 */
export function binarySearchInRange<T>(
  array: T[],
  searchValue: number,
  callback: SearchCallback<T>
): number {
  let l: number = 0;
  let r: number = array.length - 1;
  let mid: number = 0;
  let ans: number = -1;

  while (l <= r) {
    mid = (l + r) >>> 1;
    if (callback(array[mid], mid) <= searchValue) {
      ans = mid;
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }

  return ans;
}
