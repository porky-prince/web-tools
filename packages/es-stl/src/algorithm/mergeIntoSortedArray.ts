import { Nullable, SortCallback } from '../type';

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
