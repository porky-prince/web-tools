import { Nullable, SortCallback } from '../type';

/**
 * Merge an element into a sorted array, keeping the original order
 *
 * @template T
 * @param {T[]} array an sorted array
 * @param {T} value
 * @param {SortCallback<T>} callback
 * @returns {T[]}
 */
export function mergeIntoSortedArray<T>(
  array: T[],
  value: T,
  callback: SortCallback<T>
): T[] {
  const length: number = array.length + 1;
  let replace: Nullable<T> = null;

  for (let i = 0; i < length; ++i) {
    const cur: T = array[i];
    if (replace !== null) {
      array[i] = replace;
      replace = cur;
    } else if (callback(cur, value) > 0) {
      array[i] = value;
      replace = cur;
    }
  }

  return array;
}
