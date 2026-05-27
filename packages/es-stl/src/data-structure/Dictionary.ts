import { IterateCallback, KeyValue, NumOrStr } from '../type';
import { Collection } from './Collection';

const hasOwnProperty = Object.prototype.hasOwnProperty;
const newObj = () => Object.create(null);

/**
 * Dictionary backed by a plain object.
 *
 * @remarks
 * Keys are limited to numbers and strings because values are stored as object
 * properties. Iteration keys are returned as strings, matching
 * `Object.keys()`. All input objects are copied into a null-prototype object
 * before storage.
 *
 * @typeParam K - Numeric or string key type accepted by dictionary methods.
 * @typeParam V - Value type stored in the dictionary.
 *
 * @example
 * ```ts
 * const dict = new Dictionary<string, number>();
 * dict.set('apples', 2).set('oranges', 3);
 *
 * dict.get('apples');
 * // => 2
 *
 * dict.keys();
 * // => ['apples', 'oranges']
 * ```
 */
export class Dictionary<K extends NumOrStr, V> extends Collection<V, string> {
  protected _obj: KeyValue<K, V> = newObj();

  /**
   * Creates a dictionary, optionally using an existing object as backing
   * storage.
   *
   * @param object - Initial object to wrap.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ done: true, visible: false });
   * dict.size;
   * // => 2
   * ```
   */
  constructor(object?: KeyValue<K, V>) {
    super();
    if (object) {
      this.fromObject(object);
    }
  }

  /**
   * Replaces the backing object with `object`.
   *
   * @remarks
   * The provided object is copied. Later changes to `object` do not mutate the
   * dictionary.
   *
   * @param object - Object to use as dictionary storage.
   * @returns This dictionary instance.
   *
   * @example
   * ```ts
   * const source = { a: 1 };
   * const dict = new Dictionary<string, number>().fromObject(source);
   *
   * source.a = 2;
   * dict.get('a');
   * // => 1
   * ```
   */
  fromObject(object: KeyValue<K, V>): this {
    object = Object.assign(newObj(), object);
    this._obj = object;
    this._size = Object.keys(object).length;
    return this;
  }

  /**
   * Returns the backing object.
   *
   * @remarks
   * The returned object is a shallow copy. Mutating it does not update the
   * dictionary.
   *
   * @returns The backing object.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ a: 1 });
   * const object = dict.toObject();
   *
   * object.a = 2;
   * dict.get('a');
   * // => 1
   * ```
   */
  toObject(): KeyValue<K, V> {
    return Object.assign(newObj(), this._obj);
  }

  /**
   * Checks whether `key` exists as an own property.
   *
   * @param key - Key to check.
   * @returns `true` when the dictionary contains `key`.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ enabled: false });
   *
   * dict.has('enabled');
   * // => true
   * ```
   */
  has(key: K): boolean {
    return hasOwnProperty.call(this._obj, key);
  }

  /**
   * Reads the value stored for `key`.
   *
   * @param key - Key to read.
   * @returns The stored value, or `undefined` when the key is absent.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ count: 3 });
   *
   * dict.get('count');
   * // => 3
   * ```
   */
  get(key: K): V | undefined {
    return this._obj[key];
  }

  /**
   * Stores `value` at `key`.
   *
   * @param key - Key to write.
   * @param value - Value to store.
   * @returns This dictionary instance.
   *
   * @example
   * ```ts
   * const dict = new Dictionary<string, number>();
   *
   * dict.set('count', 1).set('count', 2);
   * dict.size;
   * // => 1
   * ```
   */
  set(key: K, value: V): this {
    if (!this.has(key)) {
      ++this._size;
    }
    this._obj[key] = value;
    return this;
  }

  /**
   * Removes `key` from the dictionary.
   *
   * @param key - Key to remove.
   * @returns `true` when a stored key was removed.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ stale: true });
   *
   * dict.delete('stale');
   * // => true
   * ```
   */
  delete(key: K): boolean {
    if (this.has(key)) {
      delete this._obj[key];
      --this._size;
      return true;
    }
    return false;
  }

  /**
   * Lists dictionary keys.
   *
   * @returns Own enumerable keys as strings.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ 1: 'one', 2: 'two' });
   *
   * dict.keys();
   * // => ['1', '2']
   * ```
   */
  keys(): string[] {
    return Object.keys(this._obj);
  }

  /**
   * Lists dictionary values in key iteration order.
   *
   * @remarks
   * When `values` is provided, it is cleared and reused as the return value.
   *
   * @param values - Optional array to clear and reuse for the result.
   * @returns Array containing the dictionary values.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ a: 1, b: 2 });
   * const output: number[] = [99];
   *
   * dict.values(output);
   * // output === [1, 2]
   * ```
   */
  values(values?: V[]): V[] {
    if (!values) {
      values = [];
    } else {
      values.length = 0;
    }
    this.iterator().forEach((v: V) => {
      values.push(v);
    });
    return values;
  }

  /**
   * Serializes the backing object as JSON.
   *
   * @returns JSON string representation of the dictionary.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ ok: true });
   *
   * dict.toString();
   * // => '{"ok":true}'
   * ```
   */
  toString(): string {
    return JSON.stringify(this._obj);
  }

  /**
   * Removes all entries from the dictionary.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ a: 1 });
   * dict.clear();
   *
   * dict.isEmpty();
   * // => true
   * ```
   */
  clear(): void {
    this._obj = newObj();
    this._size = 0;
  }

  /**
   * Visits dictionary values in `Object.keys()` order.
   *
   * @remarks
   * Reverse traversal visits the keys returned by {@link keys} from the end of
   * the array to the beginning.
   *
   * @param breakFlag - Callback result that should stop traversal early.
   * @param reverse - Whether traversal should run from last key to first key.
   * @param callback - Callback invoked for each value and string key.
   * @returns `breakFlag` when traversal stops early, otherwise `!breakFlag`.
   *
   * @example
   * ```ts
   * const dict = new Dictionary({ a: 1, b: 2 });
   * const seen: string[] = [];
   *
   * dict.traverse(false, false, (value, key) => {
   *   seen.push(`${key}:${value}`);
   * });
   * // seen === ['a:1', 'b:2']
   * ```
   */
  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: IterateCallback<V, string>
  ): boolean {
    if (this._size === 0) {
      return !breakFlag;
    }
    const keys: string[] = this.keys();
    const map: KeyValue<K, V> = this._obj;
    const length: number = keys.length;
    let i: number = 0;
    let key: string;
    if (reverse) {
      i = length - 1;
      while (i >= 0) {
        key = keys[i];
        if (callback(map[key as K], key, i, length) === breakFlag)
          return breakFlag;
        --i;
      }
    } else {
      while (i < length) {
        key = keys[i];
        if (callback(map[key as K], key, i, length) === breakFlag)
          return breakFlag;
        ++i;
      }
    }
    return !breakFlag;
  }
}
