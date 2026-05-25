/**
 * Max-priority heap.
 *
 * @typeParam T - Value type stored in the heap.
 */
export class Heap<T> {
  protected _values: T[] = [];
  protected _priorities: number[] = [];
  protected _size: number = 0;

  /**
   * Checks whether the heap contains no values.
   *
   * @returns `true` when the heap is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Number of values currently stored in the heap.
   *
   * @returns The heap size.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Adds a value with its numeric priority.
   *
   * @remarks
   * Higher priority values are returned before lower priority values.
   *
   * @param value - Value to insert.
   * @param priority - Numeric priority for ordering.
   */
  push(value: T, priority: number): void {
    const values = this._values;
    const priorities = this._priorities;
    let pos: number = this._size++;

    while (pos > 0) {
      const parPos: number = (pos - 1) >>> 1;
      const parPriority: number = priorities[parPos];
      if (parPriority >= priority) break;
      // move
      values[pos] = values[parPos];
      priorities[pos] = parPriority;
      pos = parPos;
    }

    // change in last
    values[pos] = value;
    priorities[pos] = priority;
  }

  /**
   * Removes and returns the highest-priority value.
   *
   * @returns Highest-priority value, or `undefined` when the heap is empty.
   */
  pop(): T | undefined {
    let size: number = this._size;
    if (size === 0) return undefined;

    const values = this._values;
    const top: T = values[0];
    if (size === 1) {
      this.clear();
      return top;
    }

    const priorities = this._priorities;
    size = --this._size;
    // the last put to top
    const value = values[size];
    const priority = priorities[size];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    values[size] = priorities[size] = undefined;

    let pos: number = 0;
    // the last non-leaf node length
    const half: number = size >>> 1;
    // if has child node
    while (pos < half) {
      let left: number = (pos << 1) + 1;
      const right: number = left + 1;

      let bestValue: T = values[left];
      let bestPriority: number = priorities[left];
      // has right node
      if (right < size && bestPriority < priorities[right]) {
        bestValue = values[right];
        bestPriority = priorities[right];
        left = right;
      }
      if (priority >= bestPriority) break;
      // move
      values[pos] = bestValue;
      priorities[pos] = bestPriority;
      pos = left;
    }

    // change in last
    values[pos] = value;
    priorities[pos] = priority;

    return top;
  }

  /**
   * Reads the highest-priority value without removing it.
   *
   * @returns Highest-priority value, or `undefined` when the heap is empty.
   */
  top(): T | undefined {
    if (this._size === 0) return undefined;
    return this._values[0];
  }

  /**
   * Trims backing arrays to the current heap size.
   */
  fit(): void {
    this._values.length = this._priorities.length = this._size;
  }

  /**
   * Removes all values from the heap.
   */
  clear(): void {
    this._values.length = 0;
    this._priorities.length = 0;
    this._size = 0;
  }
}
