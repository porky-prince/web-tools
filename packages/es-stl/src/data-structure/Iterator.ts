import {
  FilterCallback,
  IterateCallback,
  MapCallback,
  ReduceCallback,
} from '../type';

/**
 * Object that can be traversed by {@link Iterator}.
 *
 * @typeParam V - Value type yielded by the owner.
 * @typeParam K - Key type yielded with each value.
 */
export interface IteratorOwner<V, K = number> {
  /**
   * Visits values owned by the object.
   *
   * @param breakFlag - Callback result that should stop traversal early.
   * @param reverse - Whether traversal should run in reverse order.
   * @param callback - Callback invoked for each value.
   * @returns `breakFlag` when traversal stops early, otherwise `!breakFlag`.
   */
  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: IterateCallback<V, K>
  ): boolean;
}

/**
 * Chainable iterator helper for collection-like objects.
 *
 * @remarks
 * An iterator delegates actual traversal to its owner, allowing collection
 * implementations to control ordering while sharing common helpers such as
 * `map`, `filter`, and `reduce`.
 *
 * @typeParam V - Value type yielded by the iterator.
 * @typeParam K - Key type yielded with each value.
 */
export class Iterator<V, K = number> implements IteratorOwner<V, K> {
  protected _owner: IteratorOwner<V, K>;
  protected _reverse: boolean;

  /**
   * Creates an iterator.
   *
   * @param owner - Object that performs traversal.
   * @param reverse - Whether traversal should run in reverse order.
   */
  constructor(owner: IteratorOwner<V, K>, reverse: boolean = false) {
    this._owner = owner;
    this._reverse = reverse;
  }

  /**
   * Default traversal implementation for unbound iterators.
   *
   * @throws Always throws because concrete owners must implement traversal.
   */
  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: IterateCallback<V, K>
  ): boolean {
    throw new Error(
      `traverse(${breakFlag},${reverse},${callback}) must be overwritten.`
    );
  }

  /**
   * Delegates traversal to the bound owner.
   *
   * @param breakFlag - Callback result that should stop traversal early.
   * @param callback - Callback invoked for each value.
   * @returns `breakFlag` when traversal stops early, otherwise `!breakFlag`.
   */
  protected baseEach(
    breakFlag: boolean,
    callback: IterateCallback<V, K>
  ): boolean {
    return this._owner.traverse(breakFlag, this._reverse, callback);
  }

  /**
   * Tests whether every value passes `callback`.
   *
   * @param callback - Predicate invoked for each value.
   * @returns `true` when all values pass the predicate.
   */
  every(callback: FilterCallback<V, K>): boolean {
    return this.baseEach(false, callback);
  }

  /**
   * Tests whether at least one value passes `callback`.
   *
   * @param callback - Predicate invoked for each value.
   * @returns `true` when any value passes the predicate.
   */
  some(callback: FilterCallback<V, K>): boolean {
    return this.baseEach(true, callback);
  }

  /**
   * Invokes `callback` for each value.
   *
   * @remarks
   * Iteration can stop early when `callback` explicitly returns `false`.
   *
   * @param callback - Function invoked for each value.
   */
  forEach(callback: IterateCallback<V, K>): void {
    this.baseEach(false, callback);
  }

  /**
   * Maps each value to a new array.
   *
   * @typeParam T - Result value type.
   * @param callback - Function that maps each value.
   * @returns Mapped values in iteration order.
   */
  map<T>(callback: MapCallback<V, K, T>): T[] {
    const result: T[] = [];
    this.forEach((value: V, key: K, i: number, length: number) => {
      result.push(callback(value, key, i, length));
    });

    return result;
  }

  /**
   * Filters values into a new array.
   *
   * @param callback - Predicate invoked for each value.
   * @returns Values that pass the predicate in iteration order.
   */
  filter(callback: FilterCallback<V, K>): V[] {
    const result: V[] = [];
    this.forEach((value: V, key: K, i: number, length: number) => {
      if (callback(value, key, i, length)) {
        result.push(value);
      }
    });

    return result;
  }

  /**
   * Finds the first value that passes `callback`.
   *
   * @param callback - Predicate invoked for each value.
   * @returns First matching value, or `undefined` when none match.
   */
  find(callback: FilterCallback<V, K>): V | undefined {
    let result: V | undefined = undefined;
    this.forEach((value: V, key: K, i: number, length: number) => {
      if (callback(value, key, i, length)) {
        result = value;
        return false;
      }
    });

    return result;
  }

  /**
   * Finds the zero-based iteration index of the first matching value.
   *
   * @param callback - Predicate invoked for each value.
   * @returns First matching iteration index, or `-1` when none match.
   */
  findIndex(callback: FilterCallback<V, K>): number {
    let index: number = -1;
    this.forEach((value: V, key: K, i: number, length: number) => {
      if (callback(value, key, i, length)) {
        index = i;
        return false;
      }
    });

    return index;
  }

  /**
   * Reduces values by using the first iterated value as the initial
   * accumulator.
   *
   * @param callback - Reducer invoked for each value after the first.
   * @returns Reduced value, or `undefined` when the iterator is empty.
   */
  reduce(callback: ReduceCallback<V, K, V>): V | undefined;

  /**
   * Reduces values by using `init` as the initial accumulator.
   *
   * @typeParam T - Accumulator type.
   * @param callback - Reducer invoked for each value.
   * @param init - Initial accumulator value.
   * @returns Reduced value.
   */
  reduce<T>(callback: ReduceCallback<V, K, T>, init?: T): T | undefined;

  /**
   * Reduces values into a single accumulator.
   *
   * @param callback - Reducer invoked for each value.
   * @param init - Optional initial accumulator value.
   * @returns Reduced value, or `undefined` when no initial value is provided
   * and the iterator is empty.
   */
  reduce(callback: ReduceCallback<V, K, V>, init?: V): V | undefined {
    let hasInit = arguments.length >= 2;

    this.forEach((value: V, key: K, i: number, length: number) => {
      if (!hasInit) {
        init = value;
        hasInit = true;
        return;
      }
      init = callback(init as V, value, key, i, length);
    });

    return init;
  }
}

/**
 * Creates an iterator bound to `owner`.
 *
 * @typeParam V - Value type yielded by the owner.
 * @typeParam K - Key type yielded with each value.
 * @param owner - Object that performs traversal.
 * @param reverse - Whether traversal should run in reverse order.
 * @returns Iterator bound to `owner`.
 */
export function iterate<V, K>(
  owner: IteratorOwner<V, K>,
  reverse?: boolean
): Iterator<V, K> {
  return new Iterator<V, K>(owner, reverse);
}
