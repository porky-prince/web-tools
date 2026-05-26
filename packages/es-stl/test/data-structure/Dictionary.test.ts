import { Dictionary } from '../../src/data-structure/Dictionary';

describe('Dictionary', () => {
  it('loads an object defensively and exposes copied object snapshots', () => {
    const source = { a: 1, b: 2 };
    const dictionary = new Dictionary<string, number>(source);

    source.a = 99;
    const snapshot = dictionary.toObject();
    snapshot.b = 99;

    expect(dictionary.size).toBe(2);
    expect(dictionary.get('a')).toBe(1);
    expect(dictionary.get('b')).toBe(2);
    expect(Object.getPrototypeOf(snapshot)).toBe(null);
  });

  it('sets, replaces, checks, and deletes values while tracking size', () => {
    const dictionary = new Dictionary<string, number>();

    expect(dictionary.isEmpty()).toBe(true);
    expect(dictionary.has('x')).toBe(false);
    expect(dictionary.get('x')).toBeUndefined();
    expect(dictionary.delete('x')).toBe(false);

    expect(dictionary.set('x', 1)).toBe(dictionary);
    dictionary.set('x', 2);
    dictionary.set('y', 3);

    expect(dictionary.size).toBe(2);
    expect(dictionary.has('x')).toBe(true);
    expect(dictionary.get('x')).toBe(2);
    expect(dictionary.delete('x')).toBe(true);
    expect(dictionary.size).toBe(1);
    expect(dictionary.has('x')).toBe(false);
  });

  it('supports numeric keys while iterating keys as strings', () => {
    const dictionary = new Dictionary<number, string>();

    dictionary.set(2, 'two').set(10, 'ten');

    expect(dictionary.keys()).toEqual(['2', '10']);
    expect(dictionary.get(2)).toBe('two');
    expect(dictionary.has(10)).toBe(true);
  });

  it('returns values in key order and reuses the provided values array', () => {
    const dictionary = new Dictionary<string, number>({ a: 1, b: 2 });
    const reusable = [99];

    const values = dictionary.values(reusable);

    expect(values).toBe(reusable);
    expect(values).toEqual([1, 2]);
    expect(dictionary.values()).toEqual([1, 2]);
  });

  it('traverses forward and reverse with early break semantics', () => {
    const dictionary = new Dictionary<string, number>({ a: 1, b: 2, c: 3 });
    const forward: string[] = [];
    const reverse: string[] = [];

    const stopped = dictionary.traverse(
      false,
      false,
      (value, key, i, length) => {
        forward.push(`${key}:${value}:${i}/${length}`);
        return value === 2 ? false : undefined;
      }
    );
    const completedReverse = dictionary.traverse(
      true,
      true,
      (value, key, i, length) => {
        reverse.push(`${key}:${value}:${i}/${length}`);
        return false;
      }
    );

    expect(stopped).toBe(false);
    expect(forward).toEqual(['a:1:0/3', 'b:2:1/3']);
    expect(completedReverse).toBe(false);
    expect(reverse).toEqual(['c:3:2/3', 'b:2:1/3', 'a:1:0/3']);

    expect(dictionary.traverse(true, true, (value) => value === 2)).toBe(true);
  });

  it('serializes and clears values', () => {
    const dictionary = new Dictionary<string, number>({ a: 1 });

    expect(dictionary.toString()).toBe('{"a":1}');

    dictionary.clear();

    expect(dictionary.size).toBe(0);
    expect(dictionary.keys()).toEqual([]);
    expect(dictionary.toString()).toBe('{}');
    expect(dictionary.traverse(false, false, jest.fn())).toBe(true);
    expect(dictionary.traverse(true, false, jest.fn())).toBe(false);
  });
});
