import { SortCallback } from '../type';

/**
 * Inserts one value into a sorted array while preserving sort order.
 *
 * @remarks
 * This function mutates and returns the input array. Equal items remain before
 * the inserted value because insertion occurs at the first item greater than
 * `value`.
 *
 * @typeParam T - Element type stored in the array.
 * @param array - Sorted array to mutate.
 * @param value - Value to insert.
 * @param callback - Sort comparator using the same ordering as `array`.
 * @returns The same array instance after insertion.
 *
 * @example
 * ```ts
 * const values = [1, 3, 5];
 * mergeIntoSortedArray(values, 4, (a, b) => a - b);
 * // values === [1, 3, 4, 5]
 * ```
 */
export function mergeIntoSortedArray<T>(
  array: T[],
  value: T,
  callback: SortCallback<T>
): T[] {
  const length: number = array.length;
  let replacer = value;
  let replaced = false;

  for (let i = 0; i < length; ++i) {
    const cur: T = array[i];
    if (replaced) {
      array[i] = replacer;
      replacer = cur;
    } else if (callback(cur, value) > 0) {
      array[i] = value;
      replacer = cur;
      replaced = true;
    }
  }
  array.push(replacer);

  return array;
}
