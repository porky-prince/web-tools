/**
 * Object key type supported by dictionary-like data structures.
 */
export type NumOrStr = number | string;

/**
 * Nullish value.
 */
export type Nil = null | undefined;

/**
 * Value that may be `null` or `undefined`.
 *
 * @typeParam T - Non-nullish value type.
 */
export type Nilable<T> = T | Nil;

/**
 * Value that may be `null`.
 *
 * @typeParam T - Non-null value type.
 */
export type Nullable<T> = T | null;

/**
 * Record keyed by numbers or strings.
 *
 * @typeParam K - Key type used by the record.
 * @typeParam V - Value type stored by the record.
 */
export type KeyValue<K extends NumOrStr = NumOrStr, V = any> = Record<K, V>;

/**
 * Comparator for sorting and merging values.
 *
 * @typeParam T - Compared value type.
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
 * @typeParam T - Searched element type.
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
 * @typeParam T - Range element type.
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
 * @typeParam V - Iterated value type.
 * @typeParam K - Iterated key type.
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
