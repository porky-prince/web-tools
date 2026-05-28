import { SortCallback } from '../type';

/**
 * Merges two sorted arrays into a new sorted array.
 *
 * @remarks
 * Both input arrays must already be sorted with the same comparator. The
 * returned array is a new array; neither input array is mutated. When the
 * comparator treats two values as equal, the value from `array2` is emitted
 * first.
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
 *
 * @example Merging objects by timestamp
 * ```ts
 * const left = [{ time: 10 }, { time: 30 }];
 * const right = [{ time: 20 }];
 *
 * const merged = mergeSortedArray(left, right, (a, b) => a.time - b.time);
 * // merged.map((item) => item.time) === [10, 20, 30]
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
