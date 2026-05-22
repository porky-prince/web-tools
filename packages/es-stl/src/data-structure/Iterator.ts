import {
  FilterCallback,
  IterateCallback,
  MapCallback,
  ReduceCallback,
} from '../type';

/**
 * IteratorOwner
 */
export interface IteratorOwner<V, K = number> {
  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: IterateCallback<V, K>
  ): boolean;
}

/**
 * Iterator
 *
 * @class
 * @template K
 * @template V
 * @template T
 */
export class Iterator<V, K = number> implements IteratorOwner<V, K> {
  protected _owner: IteratorOwner<V, K> = this;
  protected _reverse: boolean = false;

  /**
   * bind
   * @param {IteratorOwner<V, K>} owner
   * @param {boolean} reverse
   * @returns {this}
   */
  bind(owner: IteratorOwner<V, K>, reverse: boolean = false): this {
    this._owner = owner;
    this._reverse = reverse;
    return this;
  }

  /**
   * reverse
   * @returns {this}
   */
  reverse(): this {
    this._reverse = !this._reverse;
    return this;
  }

  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: IterateCallback<V, K>
  ): boolean {
    throw new Error(
      `traverse(${breakFlag},${reverse},${callback}) must be overwritten.`
    );
  }

  protected baseEach(
    breakFlag: boolean,
    callback: IterateCallback<V, K>
  ): boolean {
    return this._owner.traverse(breakFlag, this._reverse, callback);
  }

  /**
   * every
   * @param {FilterCallback<V, K>} callback
   * @returns {boolean} Returns true if all elements pass the predicate check, else false
   */
  every(callback: FilterCallback<V, K>): boolean {
    return this.baseEach(false, callback);
  }

  /**
   * some
   * @param {FilterCallback<V, K>} callback
   * @returns {boolean} Returns true if any element passes the predicate check, else false
   */
  some(callback: FilterCallback<V, K>): boolean {
    return this.baseEach(true, callback);
  }

  /**
   * forEach
   * @param {IterateCallback<V, K>} callback - Iteratee functions may exit iteration early by explicitly returning false
   */
  forEach(callback: IterateCallback<V, K>): void {
    this.baseEach(false, callback);
  }

  /**
   * map
   * @param {MapCallback<V, K, T>} callback
   * @return {T[]}
   */
  map<T>(callback: MapCallback<V, K, T>): T[] {
    const result: T[] = [];
    this.forEach((value: V, key: K, i: number, length: number) => {
      result.push(callback(value, key, i, length));
    });

    return result;
  }

  /**
   * filter
   * @param {FilterCallback<V, K>} callback
   * @return {V[]}
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
   * find
   * @param {FilterCallback<V, K>} callback
   * @return {V | undefined}
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
   * findIndex
   * @param {FilterCallback<V, K>} callback
   * @return {number}
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
   * reduce
   * @param {ReduceCallback<V, K, V>} callback
   * @returns {V | undefined}
   */
  reduce(callback: ReduceCallback<V, K, V>): V | undefined;

  /**
   * reduce
   * @param {ReduceCallback<V, K, T>} callback
   * @param {T} init
   * @returns {T | undefined}
   */
  reduce<T>(callback: ReduceCallback<V, K, T>, init?: T): T | undefined;

  /**
   * reduce
   * @param {ReduceCallback<V, K, V>} callback
   * @param {V} init
   * @returns {V | undefined}
   */
  reduce(callback: ReduceCallback<V, K, V>, init?: V): V | undefined {
    this.forEach((value: V, key: K, i: number, length: number) => {
      if (init === undefined) {
        init = value;
        return;
      }
      init = callback(init, value, key, i, length);
    });

    return init;
  }
}

/**
 * iterate
 *
 * @template K
 * @template V
 * @template T
 * @param {IteratorOwner<V, K>} obj
 * @param {boolean} reverse
 * @returns {Iterator<V, K>}
 */
export function iterate<V, K>(
  obj: IteratorOwner<V, K>,
  reverse?: boolean
): Iterator<V, K> {
  return new Iterator<V, K>().bind(obj, reverse);
}
