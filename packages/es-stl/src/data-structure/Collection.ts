import { IterateCallback, Nullable } from '../type';
import { iterate, Iterator, IteratorOwner } from './Iterator';

/**
 * Base class for iterable collection data structures.
 *
 * @typeParam V - Value type yielded by the collection.
 * @typeParam K - Key type yielded with each value.
 */
export abstract class Collection<V, K = number> implements IteratorOwner<V, K> {
  private _iterator: Nullable<Iterator<V, K>> = null;
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
   * @param reverse - Whether iteration should run in reverse order.
   * @returns An iterator bound to this collection.
   */
  iterator(reverse?: boolean): Iterator<V, K> {
    if (this._iterator === null) {
      this._iterator = iterate(this, reverse);
    }
    return this._iterator.bind(this, reverse);
  }

  /**
   * Visits collection values in implementation-defined key order.
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
