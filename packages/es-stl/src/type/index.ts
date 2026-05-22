/**
 * Type number or string
 */
export type NumOrStr = number | string;

export type Nil = null | undefined;

export type Nilable<T> = T | Nil;

export type Nullable<T> = T | null;

/**
 * Sort callback function
 */
export interface SortCallback<T> {
  (e1: T, e2: T): number;
}

/**
 * Search callback function
 */
export interface SearchCallback<T> {
  (el: T, i: number): number;
}

/**
 * Search range callback function
 */
export interface SearchRangeCallback<T> {
  (range: number[], el: T, i: number): void;
}

/**
 * Iterate callback function
 */
export interface IterateCallback<V, K> {
  (v: V, k: K, i: number, length: number): boolean | void;
}

/**
 * Filter callback function
 */
export interface FilterCallback<V, K> {
  (v: V, k: K, i: number, length: number): boolean;
}

/**
 * Map callback function
 */
export interface MapCallback<V, K, T> {
  (v: V, k: K, i: number, length: number): T;
}

/**
 * Reduce callback function
 */
export interface ReduceCallback<V, K, T> {
  (pre: T, v: V, k: K, i: number, length: number): T;
}
