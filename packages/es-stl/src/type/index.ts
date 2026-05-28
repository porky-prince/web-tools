/**
 * Object key type supported by dictionary-like data structures.
 *
 * @example
 * ```ts
 * const key: NumOrStr = 'id';
 * ```
 */
export type NumOrStr = number | string;

/**
 * Nullish value.
 *
 * @example
 * ```ts
 * const value: Nil = null;
 * ```
 */
export type Nil = null | undefined;

/**
 * Value that may be `null` or `undefined`.
 *
 * @typeParam T - Non-nullish value type.
 *
 * @example
 * ```ts
 * const value: Nilable<number> = undefined;
 * ```
 */
export type Nilable<T> = T | Nil;

/**
 * Value that may be `null`.
 *
 * @typeParam T - Non-null value type.
 *
 * @example
 * ```ts
 * const currentUser: Nullable<{ name: string }> = null;
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Value that can be awaited directly or after resolving a promise.
 *
 * @typeParam T - Custom value type.
 *
 * @example
 * ```ts
 * async function resolveValue(value: Thenable<number>): Promise<number> {
 *   return value;
 * }
 * ```
 */
export type Thenable<T> = T | Promise<T>;

/**
 * Record keyed by numbers or strings.
 *
 * @typeParam K - Key type used by the record.
 * @typeParam V - Value type stored by the record.
 *
 * @example
 * ```ts
 * const scores: KeyValue<string, number> = { ada: 10, grace: 20 };
 * ```
 */
export type KeyValue<K extends NumOrStr = NumOrStr, V = any> = Record<K, V>;

/**
 * Comparator for sorting and merging values.
 *
 * @remarks
 * Use the same comparator for every operation that expects an already sorted
 * array. A negative return value means the first value comes before the second
 * value.
 *
 * @typeParam T - Compared value type.
 *
 * @example
 * ```ts
 * const byAge: SortCallback<{ age: number }> = (a, b) => a.age - b.age;
 * ```
 */
export interface SortCallback<T> {
  /**
   * Compares two values.
   *
   * @param e1 - First value.
   * @param e2 - Second value.
   * @returns A negative number when `e1` sorts before `e2`, zero when they are
   * equivalent, or a positive number when `e1` sorts after `e2`.
   */
  (e1: T, e2: T): number;
}

/**
 * Projection used by binary search helpers.
 *
 * @remarks
 * The projected value must be sorted in ascending order across the searched
 * array.
 *
 * @typeParam T - Searched element type.
 *
 * @example
 * ```ts
 * const getOffset: SearchCallback<{ offset: number }> = (entry) =>
 *   entry.offset;
 * ```
 */
export interface SearchCallback<T> {
  /**
   * Projects an element to a searchable numeric value.
   *
   * @param el - Element being inspected.
   * @param i - Element index.
   * @returns Numeric value used for binary-search comparisons.
   */
  (el: T, i: number): number;
}

/**
 * Callback that exposes an element's searchable range.
 *
 * @remarks
 * Write inclusive lower and upper bounds into the provided `range` array. The
 * array is reused by search helpers to avoid allocating a new tuple for each
 * inspected item.
 *
 * @typeParam T - Range element type.
 *
 * @example
 * ```ts
 * const getRange: SearchRangeCallback<{ start: number; end: number }> = (
 *   range,
 *   item
 * ) => {
 *   range[0] = item.start;
 *   range[1] = item.end;
 * };
 * ```
 */
export interface SearchRangeCallback<T> {
  /**
   * Writes the element's inclusive range bounds into `range`.
   *
   * @param range - Mutable two-item array receiving `[start, end]`.
   * @param el - Element being inspected.
   * @param i - Element index.
   */
  (range: number[], el: T, i: number): void;
}

/**
 * Callback invoked while traversing an iterator owner.
 *
 * @remarks
 * Returning `false` stops iterator `forEach` traversal early. Other iterator
 * helpers define their own stop conditions by passing a different break flag.
 *
 * @typeParam V - Iterated value type.
 * @typeParam K - Iterated key type.
 *
 * @example
 * ```ts
 * const collectUntilThree: IterateCallback<number, number> = (value) => {
 *   return value < 3;
 * };
 * ```
 */
export interface IterateCallback<V, K> {
  /**
   * Handles one iterated value.
   *
   * @param v - Current value.
   * @param k - Current key.
   * @param i - Zero-based iteration index.
   * @param length - Total number of values in the traversal.
   * @returns Returning `false` can stop `forEach` traversal early.
   */
  (v: V, k: K, i: number, length: number): boolean | void;
}

/**
 * Predicate callback used by iterator helpers.
 *
 * @typeParam V - Iterated value type.
 * @typeParam K - Iterated key type.
 *
 * @example
 * ```ts
 * const isEven: FilterCallback<number, number> = (value) => value % 2 === 0;
 * ```
 */
export interface FilterCallback<V, K> {
  /**
   * Tests one iterated value.
   *
   * @param v - Current value.
   * @param k - Current key.
   * @param i - Zero-based iteration index.
   * @param length - Total number of values in the traversal.
   * @returns `true` when the value passes the predicate.
   */
  (v: V, k: K, i: number, length: number): boolean;
}

/**
 * Mapping callback used by iterator helpers.
 *
 * @typeParam V - Iterated value type.
 * @typeParam K - Iterated key type.
 * @typeParam T - Mapped result type.
 *
 * @example
 * ```ts
 * const label: MapCallback<number, string, string> = (value, key) =>
 *   `${key}:${value}`;
 * ```
 */
export interface MapCallback<V, K, T> {
  /**
   * Maps one iterated value.
   *
   * @param v - Current value.
   * @param k - Current key.
   * @param i - Zero-based iteration index.
   * @param length - Total number of values in the traversal.
   * @returns Mapped value.
   */
  (v: V, k: K, i: number, length: number): T;
}

/**
 * Reducer callback used by iterator helpers.
 *
 * @typeParam V - Iterated value type.
 * @typeParam K - Iterated key type.
 * @typeParam T - Accumulator type.
 *
 * @example
 * ```ts
 * const sum: ReduceCallback<number, number, number> = (total, value) =>
 *   total + value;
 * ```
 */
export interface ReduceCallback<V, K, T> {
  /**
   * Reduces one iterated value into the accumulator.
   *
   * @param pre - Previous accumulator value.
   * @param v - Current value.
   * @param k - Current key.
   * @param i - Zero-based iteration index.
   * @param length - Total number of values in the traversal.
   * @returns Next accumulator value.
   */
  (pre: T, v: V, k: K, i: number, length: number): T;
}
