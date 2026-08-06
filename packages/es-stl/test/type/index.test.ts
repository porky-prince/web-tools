import type {
  AbstractConstructor,
  AsyncCallback,
  Awaitable,
  Brand,
  Comparator,
  Constructor,
  ElementOf,
  Mapper,
  OptionalKeys,
  Predicate,
  Primitive,
  RequiredKeys,
  ValueOf,
} from '../../src/type';

describe('common types', () => {
  it('describes primitive, collection, and awaitable values', async () => {
    const primitives: Primitive[] = [
      'text',
      1,
      BigInt(1),
      true,
      Symbol('key'),
      null,
      undefined,
    ];
    const element: ElementOf<readonly ['ready', 200]> = 200;
    const status: ValueOf<{ ready: 'ready'; failed: 'failed' }> = 'ready';
    const immediate: Awaitable<number> = 1;
    const deferred: Awaitable<number> = Promise.resolve(2);

    expect(primitives).toHaveLength(7);
    expect(element).toBe(200);
    expect(status).toBe('ready');
    expect(await immediate).toBe(1);
    await expect(deferred).resolves.toBe(2);
  });

  it('describes concrete and abstract constructors', () => {
    class User {
      constructor(public readonly name: string) {}
    }

    abstract class Entity {
      constructor(public readonly id: number) {}
    }

    const userClass: Constructor<User, [name: string]> = User;
    const entityClass: AbstractConstructor<Entity, [id: number]> = Entity;

    expect(new userClass('Ada').name).toBe('Ada');
    expect(entityClass).toBe(Entity);
  });

  it('changes selected property requirements', () => {
    interface Options {
      host?: string;
      port: number;
    }

    const required: RequiredKeys<Options, 'host'> = {
      host: 'localhost',
      port: 8080,
    };
    const optional: OptionalKeys<Options, 'port'> = {};

    expect(required.host).toBe('localhost');
    expect(optional.port).toBeUndefined();
  });

  it('distinguishes branded values', () => {
    type UserId = Brand<string, 'UserId'>;
    type OrderId = Brand<string, 'OrderId'>;

    const userId = 'user-1' as UserId;
    // @ts-expect-error Different brand names must remain incompatible.
    const orderId: OrderId = userId;

    expect(userId).toBe('user-1');
    expect(orderId).toBe('user-1');
  });

  it('describes reusable callbacks', async () => {
    const isPositive: Predicate<number> = (value) => value > 0;
    const toLabel: Mapper<number, string> = (value) => `item-${value}`;
    const ascending: Comparator<number> = (left, right) => left - right;
    const loadLabel: AsyncCallback<[id: number], string> = async (id) =>
      toLabel(id);

    expect(isPositive(1)).toBe(true);
    expect(toLabel(2)).toBe('item-2');
    expect([3, 1, 2].sort(ascending)).toEqual([1, 2, 3]);
    await expect(loadLabel(3)).resolves.toBe('item-3');
  });
});
