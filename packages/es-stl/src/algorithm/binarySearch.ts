import { SearchCallback } from '../type';

/**
 * Binary Search
 *
 * @template T
 * @param {T[]} array an array after sort from small to large
 * @param {number} searchValue
 * @param {SearchCallback<T>} callback
 * @returns {number}
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
