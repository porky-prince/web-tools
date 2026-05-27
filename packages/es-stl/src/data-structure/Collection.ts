import { IterateCallback, Nullable } from '../type';
import { iterate, Iterator, IteratorOwner } from './Iterator';

/**
 * Base class for iterable collection data structures.
 *
 * @remarks
 * Subclasses provide storage and traversal by implementing {@link clear} and
 * {@link traverse}. The inherited {@link iterator} method caches one forward
 * iterator and one reverse iterator for reuse.
 *
 * @typeParam V - Value type yielded by the collection.
 * @typeParam K - Key type yielded with each value.
 *
 * @example Creating a small read-only collection
 * ```ts
 * class Values extends Collection<string> {
 *   constructor(private readonly values: string[]) {
 *     super();
 *     this._size = values.length;
 *   }
 *
 *   clear(): void {
 *     this.values.length = 0;
 *     this._size = 0;
 *   }
 *
 *   traverse(
 *     breakFlag: boolean,
 *     reverse: boolean,
 *     cb: IterateCallback<string, number>
 *   ): boolean {
 *     const values = reverse ? [...this.values].reverse() : this.values;
 *
 *     for (let i = 0; i < values.length; i += 1) {
 *       if (cb(values[i], i, i, values.length) === breakFlag) {
 *         return breakFlag;
 *       }
 *     }
 *
 *     return !breakFlag;
 *   }
 * }
 * ```
 */
export abstract class Collection<V, K = number> implements IteratorOwner<V, K> {
  protected _iterators: [Nullable<Iterator<V, K>>, Nullable<Iterator<V, K>>] = [
    null,
    null,
  ];
  protected _size: number = 0;

  /**
   * Number of values currently stored in the collection.
   *
   * @returns The collection size.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Checks whether the collection contains no values.
   *
   * @returns `true` when the collection is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Removes every value from the collection.
   */
  abstract clear(): void;

  /**
   * Creates or reuses an iterator bound to this collection.
   *
   * @remarks
   * Calling `iterator()` repeatedly returns the same forward iterator instance.
   * Calling `iterator(true)` repeatedly returns the same reverse iterator
   * instance.
   *
   * @param reverse - Whether iteration should run in reverse order.
   * @returns An iterator bound to this collection.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ a: 1, b: 2 });
   *
   * dict.iterator().map((value) => value * 2);
   * // => [2, 4]
   * ```
   */
  iterator(reverse?: boolean): Iterator<V, K> {
    const i = Number(!!reverse);
    const iterators = this._iterators;
    if (iterators[i] === null) {
      iterators[i] = iterate(this, reverse);
    }
    return iterators[i];
  }

  /**
   * Visits collection values in implementation-defined key order.
   *
   * @remarks
   * Iterator helpers use this method to implement `every`, `some`, `forEach`,
   * `map`, `filter`, `find`, `findIndex`, and `reduce`. Implementations should
   * return `breakFlag` as soon as the callback returns the same value.
   *
   * @param breakFlag - Callback result that should stop traversal early.
   * @param reverse - Whether traversal should run in reverse order.
   * @param cb - Callback invoked for each value.
   * @returns `breakFlag` when traversal stops early, otherwise `!breakFlag`.
   */
  abstract traverse(
    breakFlag: boolean,
    reverse: boolean,
    cb: IterateCallback<V, K>
  ): boolean;
}
