import { SortCallback } from '../type';

/**
 * Merges two sorted arrays into a new sorted array.
 *
 * @remarks
 * Both input arrays must already be sorted with the same comparator. The
 * returned array is a new array; neither input array is mutated.
 *
 * @typeParam T - Element type stored in the arrays.
 * @param array1 - First sorted input array.
 * @param array2 - Second sorted input array.
 * @param callback - Sort comparator shared by both input arrays.
 * @returns A new array containing all values in sorted order.
 *
 * @example
 * ```ts
 * const merged = mergeSortedArray([1, 4], [2, 3], (a, b) => a - b);
 * // merged === [1, 2, 3, 4]
 * ```
 */
export function mergeSortedArray<T>(
  array1: T[],
  array2: T[],
  callback: SortCallback<T>
): T[] {
  const length1: number = array1.length;
  const length2: number = array2.length;
  const length: number = length1 + length2;
  const arr: T[] = Array(length);
  let m: number = 0;
  let n: number = 0;

  for (let i = 0; i < length; ++i) {
    const a: T = array1[m];
    const b: T = array2[n];
    if (n >= length2 || (m < length1 && callback(a, b) < 0)) {
      arr[i] = a;
      ++m;
    } else {
      arr[i] = b;
      ++n;
    }
  }

  return arr;
}
