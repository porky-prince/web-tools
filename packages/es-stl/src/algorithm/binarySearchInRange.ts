import { SearchCallback } from '../type';

/**
 * Binary search in range `[a, b)`.
 *
 * @template T
 * @param {T[]} array an array after sort from small to large
 * @param {number} searchValue
 * @param {SearchCallback<T>} callback
 * @returns {number}
 * @example
 * const dataList = [{num: 0}, {num: 100}, {num: 300}, {num: 700}, {num: 1000}];
 * binarySearchInRange(dataList, 125, (data: { num: number }) => data.num);
 * // => 1
 *
 * i = binarySearchInRange(dataList, -10, (data: { num: number }) => data.num);
 * // => -1
 *
 * i = binarySearchInRange(dataList, 0, (data: { num: number }) => data.num);
 * // => 0
 *
 * i = binarySearchInRange(dataList, 100, (data: { num: number }) => data.num);
 * // => 1
 *
 * i = binarySearchInRange(dataList, 300, (data: { num: number }) => data.num);
 * // => 2
 *
 * i = binarySearchInRange(dataList, 350, (data: { num: number }) => data.num);
 * // => 2
 *
 * i = binarySearchInRange(dataList, 800, (data: { num: number }) => data.num);
 * // => 3
 *
 * i = binarySearchInRange(dataList, 1000, (data: { num: number }) => data.num);
 * // => 4
 *
 * i = binarySearchInRange(dataList, 2000, (data: { num: number }) => data.num);
 * // => 4
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
