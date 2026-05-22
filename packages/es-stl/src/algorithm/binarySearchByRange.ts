import { SearchRangeCallback } from '../type';

/**
 * Binary search by range.
 *
 * @template T
 * @param {T[]} array an object array after sort from small to large
 * @param {number} searchValue
 * @param {SearchRangeCallback<T>} callback
 * @returns {number}
 * @example
 * const dataList = [{s:0, e: 5}, {s:6, e: 18}, {s:19, e: 30}, ...];
 * binarySearchByRange(dataList, 10, (range: number[], data: {s: number, e: number}) => {
 *   range[0] = data.s;
 *   range[1] = data.e;
 * });
 * // => 1
 *
 * const dataList = [{s:0, e: 5}, {s:5, e: 18}, {s:18, e: 30}, ...];
 * binarySearchByRange(dataList, 10, (range: number[], data: {s: number, e: number}) => {
 *   range[0] = data.s;
 *   range[1] = data.e - 1;
 * });
 * // => 1
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
