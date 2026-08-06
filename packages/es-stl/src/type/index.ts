/**
 * JavaScript primitive value.
 *
 * @remarks
 * Functions and objects aren't primitive values. Use a JSON-specific type when
 * values must also be serializable, because JSON doesn't support every member
 * of this union.
 *
 * @example
 * ```ts
 * const value: Primitive = Symbol('id');
 * ```
 */
export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

/**
 * Object key type supported by dictionary-like data structures.
 *
 * @example
 * ```ts
 * const key: NumOrStr = 'id';
 * ```
 */
export type NumOrStr = number | string;

/**
 * Nullish value.
 *
 * @example
 * ```ts
 * const value: Nil = null;
 * ```
 */
export type Nil = null | undefined;

/**
 * Value that may be `null` or `undefined`.
 *
 * @typeParam T - Non-nullish value type.
 *
 * @example
 * ```ts
 * const value: Nilable<number> = undefined;
 * ```
 */
export type Nilable<T> = T | Nil;

/**
 * Value that may be `null`.
 *
 * @typeParam T - Non-null value type.
 *
 * @example
 * ```ts
 * const currentUser: Nullable<{ name: string }> = null;
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Value that can be awaited directly or after resolving a promise.
 *
 * @typeParam T - Custom value type.
 *
 * @example
 * ```ts
 * async function resolveValue(value: Thenable<number>): Promise<number> {
 *   return value;
 * }
 * ```
 */
export type Thenable<T> = T | Promise<T>;

/**
 * Value that can be used immediately or resolved from a promise-like object.
 *
 * @typeParam T - Resolved value type.
 *
 * @example
 * ```ts
 * const count: Awaitable<number> = Promise.resolve(3);
 * ```
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Element type of an array or tuple.
 *
 * @typeParam T - Array or tuple whose element type is extracted.
 *
 * @example
 * ```ts
 * type Status = ElementOf<readonly ['idle', 'ready']>;
 * const status: Status = 'ready';
 * ```
 */
export type ElementOf<T extends readonly unknown[]> = T[number];

/**
 * Union of an object's property value types.
 *
 * @typeParam T - Object whose property value types are extracted.
 *
 * @example
 * ```ts
 * type Status = ValueOf<{ ready: 'ready'; failed: 'failed' }>;
 * const status: Status = 'ready';
 * ```
 */
export type ValueOf<T extends object> = T[keyof T];

/**
 * Record keyed by numbers or strings.
 *
 * @typeParam K - Key type used by the record.
 * @typeParam V - Value type stored by the record.
 *
 * @example
 * ```ts
 * const scores: KeyValue<string, number> = { ada: 10, grace: 20 };
 * ```
 */
export type KeyValue<K extends NumOrStr = NumOrStr, V = any> = Record<K, V>;

/**
 * Object with arbitrary numeric or string keys and values.
 *
 * @remarks
 * This alias retains the broad defaults of {@link KeyValue}. Specify key and
 * value types with `KeyValue` when their shapes are known.
 *
 * @example
 * ```ts
 * const metadata: AnyObject = { id: 1, active: true };
 * ```
 */
export type AnyObject = KeyValue;

/**
 * Function with a typed parameter tuple and return value.
 *
 * @typeParam Args - Ordered callback parameter types.
 * @typeParam Result - Callback return type.
 *
 * @example
 * ```ts
 * const format: Callback<[name: string, count: number], string> =
 *   (name, count) => `${name}:${count}`;
 * ```
 */
export type Callback<Args extends unknown[] = [], Result = void> = (
  ...args: Args
) => Result;

/**
 * Function with an unconstrained parameter list and a configurable return type.
 *
 * @remarks
 * Argument types deliberately use `any` so callbacks with specific parameters
 * remain assignable. Calls through this type don't check argument types, so
 * prefer {@link Callback} when callers need a checked parameter list.
 *
 * @typeParam Result - Callback return type.
 *
 * @example
 * ```ts
 * const getLength: AnyCallback<number> = (value: string) => value.length;
 * ```
 */
export type AnyCallback<Result = unknown> = (...args: any[]) => Result;

/**
 * Constructable class with typed constructor parameters and instances.
 *
 * @typeParam Instance - Instance produced by the constructor.
 * @typeParam Args - Ordered constructor parameter types.
 *
 * @example
 * ```ts
 * class User {
 *   constructor(readonly name: string) {}
 * }
 * const UserClass: Constructor<User, [name: string]> = User;
 * ```
 */
export type Constructor<Instance = object, Args extends unknown[] = []> = new (
  ...args: Args
) => Instance;

/**
 * Abstract or concrete class with typed constructor parameters and instances.
 *
 * @typeParam Instance - Instance described by the constructor.
 * @typeParam Args - Ordered constructor parameter types.
 *
 * @example
 * ```ts
 * abstract class Entity {
 *   constructor(readonly id: number) {}
 * }
 * const EntityClass: AbstractConstructor<Entity, [id: number]> = Entity;
 * ```
 */
export type AbstractConstructor<
  Instance = object,
  Args extends unknown[] = [],
> = abstract new (...args: Args) => Instance;

/**
 * Object type with selected properties made required.
 *
 * @typeParam T - Source object type.
 * @typeParam Keys - Properties made required.
 *
 * @example
 * ```ts
 * type Options = RequiredKeys<{ host?: string; port: number }, 'host'>;
 * const options: Options = { host: 'localhost', port: 8080 };
 * ```
 */
export type RequiredKeys<T, Keys extends keyof T> = Omit<T, Keys> &
  Required<Pick<T, Keys>>;

/**
 * Object type with selected properties made optional.
 *
 * @typeParam T - Source object type.
 * @typeParam Keys - Properties made optional.
 *
 * @example
 * ```ts
 * type Options = OptionalKeys<{ host: string; port: number }, 'port'>;
 * const options: Options = { host: 'localhost' };
 * ```
 */
export type OptionalKeys<T, Keys extends keyof T> = Omit<T, Keys> &
  Partial<Pick<T, Keys>>;

declare const brand: unique symbol;

/**
 * Value distinguished from structurally identical values by a type-only brand.
 *
 * @remarks
 * A brand adds no runtime property or validation. Create branded values only
 * after validating or otherwise establishing their meaning.
 *
 * @typeParam T - Underlying value type.
 * @typeParam Name - Unique name that identifies the branded value.
 *
 * @example
 * ```ts
 * type UserId = Brand<string, 'UserId'>;
 * const userId = 'user-1' as UserId;
 * ```
 */
export type Brand<T, Name extends string> = T & {
  readonly [brand]: Name;
};

/**
 * Function that tests whether a value satisfies a condition.
 *
 * @typeParam T - Tested value type.
 *
 * @example
 * ```ts
 * const isPositive: Predicate<number> = (value) => value > 0;
 * ```
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Function that transforms one value into another.
 *
 * @typeParam Input - Input value type.
 * @typeParam Output - Transformed value type.
 *
 * @example
 * ```ts
 * const toLabel: Mapper<number, string> = (value) => `item-${value}`;
 * ```
 */
export type Mapper<Input, Output> = (value: Input) => Output;

/**
 * Function that compares two values for ordering.
 *
 * @typeParam T - Compared value type.
 *
 * @example
 * ```ts
 * const ascending: Comparator<number> = (left, right) => left - right;
 * ```
 */
export type Comparator<T> = (left: T, right: T) => number;

/**
 * Asynchronous function with a typed parameter tuple and resolved result.
 *
 * @typeParam Args - Ordered callback parameter types.
 * @typeParam Result - Resolved result type.
 *
 * @example
 * ```ts
 * const loadName: AsyncCallback<[id: number], string> = async (id) =>
 *   `user-${id}`;
 * ```
 */
export type AsyncCallback<Args extends unknown[] = [], Result = void> = (
  ...args: Args
) => Promise<Result>;

/**
 * Comparator for sorting and merging values.
 *
 * @remarks
 * Use the same comparator for every operation that expects an already sorted
 * array. A negative return value means the first value comes before the second
 * value.
 *
 * @typeParam T - Compared value type.
 *
 * @example
 * ```ts
 * const byAge: SortCallback<{ age: number }> = (a, b) => a.age - b.age;
 * ```
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
 * @remarks
 * The projected value must be sorted in ascending order across the searched
 * array.
 *
 * @typeParam T - Searched element type.
 *
 * @example
 * ```ts
 * const getOffset: SearchCallback<{ offset: number }> = (entry) =>
 *   entry.offset;
 * ```
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
 * @remarks
 * Write inclusive lower and upper bounds into the provided `range` array. The
 * array is reused by search helpers to avoid allocating a new tuple for each
 * inspected item.
 *
 * @typeParam T - Range element type.
 *
 * @example
 * ```ts
 * const getRange: SearchRangeCallback<{ start: number; end: number }> = (
 *   range,
 *   item
 * ) => {
 *   range[0] = item.start;
 *   range[1] = item.end;
 * };
 * ```
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
 * @remarks
 * Returning `false` stops iterator `forEach` traversal early. Other iterator
 * helpers define their own stop conditions by passing a different break flag.
 *
 * @typeParam V - Iterated value type.
 * @typeParam K - Iterated key type.
 *
 * @example
 * ```ts
 * const collectUntilThree: IterateCallback<number, number> = (value) => {
 *   return value < 3;
 * };
 * ```
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
 *
 * @example
 * ```ts
 * const isEven: FilterCallback<number, number> = (value) => value % 2 === 0;
 * ```
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
 *
 * @example
 * ```ts
 * const label: MapCallback<number, string, string> = (value, key) =>
 *   `${key}:${value}`;
 * ```
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
 *
 * @example
 * ```ts
 * const sum: ReduceCallback<number, number, number> = (total, value) =>
 *   total + value;
 * ```
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
