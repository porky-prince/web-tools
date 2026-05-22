import { SortCallback } from '../type';

/**
 * To merge two sorted arrays into an array sorted by original rules
 *
 * @template T
 * @param {T[]} array1 an sorted array
 * @param {T[]} array2 an sorted array
 * @param {SortCallback<T>} callback
 * @returns {T[]} new array
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
