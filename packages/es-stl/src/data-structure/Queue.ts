/**
 * First-in, first-out queue.
 *
 * @remarks
 * The constructor reverses the provided initial array in place so the first
 * input element can be dequeued first.
 *
 * @typeParam T - Value type stored in the queue.
 */
export class Queue<T> {
  protected _shift: T[];
  protected _push: T[];
  protected _size: number;

  /**
   * Creates a queue from an optional initial array.
   *
   * @param arr - Initial values in dequeue order.
   */
  constructor(arr: T[] = []) {
    this._shift = arr.reverse();
    this._push = [];
    this._size = this._shift.length;
  }

  /**
   * Checks whether the queue contains no values.
   *
   * @returns `true` when the queue is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Number of values currently stored in the queue.
   *
   * @returns The queue size.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Adds a value to the back of the queue.
   *
   * @param el - Value to enqueue.
   * @returns This queue instance.
   */
  enqueue(el: T): this {
    ++this._size;
    this._push.push(el);
    return this;
  }

  /**
   * Removes and returns the value at the front of the queue.
   *
   * @returns Front value, or `undefined` when the queue is empty.
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    --this._size;
    let shift = this._shift;
    const push = this._push;
    if (shift.length === 0) {
      if (push.length === 1) {
        return push.pop();
      }
      this._push = shift;
      this._shift = shift = push.reverse();
    }
    return shift.pop();
  }

  /**
   * Reads the value at the front of the queue without removing it.
   *
   * @returns Front value, or `undefined` when the queue is empty.
   */
  first(): T | undefined {
    if (this.isEmpty()) return undefined;
    const length: number = this._shift.length;
    if (length > 0) {
      return this._shift[length - 1];
    }
    return this._push[0];
  }

  /**
   * Reads the value at the back of the queue without removing it.
   *
   * @returns Back value, or `undefined` when the queue is empty.
   */
  last(): T | undefined {
    if (this.isEmpty()) return undefined;
    const length: number = this._push.length;
    if (length > 0) {
      return this._push[length - 1];
    }
    return this._shift[0];
  }

  /**
   * Removes all values from the queue.
   */
  clear(): void {
    this._shift.length = 0;
    this._push.length = 0;
    this._size = 0;
  }
}
