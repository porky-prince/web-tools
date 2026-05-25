import { IterateCallback, KeyValue, NumOrStr } from '../type';
import { Collection } from './Collection';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Dictionary backed by a plain object.
 *
 * @remarks
 * Keys are limited to numbers and strings because values are stored as object
 * properties. Iteration keys are returned as strings, matching
 * `Object.keys()`.
 *
 * @typeParam K - Numeric or string key type accepted by dictionary methods.
 * @typeParam V - Value type stored in the dictionary.
 */
export class Dictionary<K extends NumOrStr, V> extends Collection<V, string> {
  protected _obj = {} as KeyValue<K, V>;

  /**
   * Creates a dictionary, optionally using an existing object as backing
   * storage.
   *
   * @param obj - Initial object to wrap.
   */
  constructor(obj?: KeyValue<K, V>) {
    super();
    if (obj) {
      this.fromObject(obj);
    }
  }

  /**
   * Replaces the backing object with `obj`.
   *
   * @remarks
   * The object is stored by reference, so external mutations to `obj` are
   * reflected in this dictionary.
   *
   * @param obj - Object to use as dictionary storage.
   * @returns This dictionary instance.
   */
  fromObject(obj: KeyValue<K, V>): this {
    this._obj = obj;
    this._size = Object.keys(obj).length;
    return this;
  }

  /**
   * Returns the backing object.
   *
   * @remarks
   * The returned object is the dictionary's internal storage, not a clone.
   *
   * @returns The backing object.
   */
  toObject(): KeyValue<K, V> {
    return this._obj;
  }

  /**
   * Checks whether `key` exists as an own property.
   *
   * @param key - Key to check.
   * @returns `true` when the dictionary contains `key`.
   */
  has(key: K): boolean {
    return hasOwnProperty.call(this._obj, key);
  }

  /**
   * Reads the value stored for `key`.
   *
   * @param key - Key to read.
   * @returns The stored value, or `undefined` when the key is absent.
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
   */
  keys(): string[] {
    return Object.keys(this._obj);
  }

  /**
   * Lists dictionary values in key iteration order.
   *
   * @param values - Optional array to clear and reuse for the result.
   * @returns Array containing the dictionary values.
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
   */
  toString(): string {
    return JSON.stringify(this._obj);
  }

  /**
   * Removes all entries from the dictionary.
   */
  clear(): void {
    this._obj = {} as KeyValue<K, V>;
    this._size = 0;
  }

  /**
   * Visits dictionary values in `Object.keys()` order.
   *
   * @param breakFlag - Callback result that should stop traversal early.
   * @param reverse - Whether traversal should run from last key to first key.
   * @param callback - Callback invoked for each value and string key.
   * @returns `breakFlag` when traversal stops early, otherwise `!breakFlag`.
   */
  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: IterateCallback<V, string>
  ): boolean {
    if (this._size === 0) {
      return false;
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
