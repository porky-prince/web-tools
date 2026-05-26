import {
  iterate,
  Iterator,
  IteratorOwner,
} from '../../src/data-structure/Iterator';

interface Entry {
  key: string;
  value: number;
}

class ArrayOwner implements IteratorOwner<number, string> {
  constructor(private readonly entries: Entry[]) {}

  traverse(
    breakFlag: boolean,
    reverse: boolean,
    callback: (
      value: number,
      key: string,
      index: number,
      length: number
    ) => boolean | void
  ): boolean {
    const entries = reverse ? [...this.entries].reverse() : this.entries;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (callback(entry.value, entry.key, i, entries.length) === breakFlag) {
        return breakFlag;
      }
    }

    return !breakFlag;
  }
}

describe('Iterator', () => {
  const entries: Entry[] = [
    { key: 'a', value: 1 },
    { key: 'b', value: 2 },
    { key: 'c', value: 3 },
  ];

  it('throws when traverse is not implemented by an owner', () => {
    const iterator = new Iterator<number>({} as IteratorOwner<number>);

    expect(() => iterator.traverse(false, false, jest.fn())).toThrow(
      'traverse(false,false'
    );
  });

  it('iterates through an owner and supports reverse iteration', () => {
    const forward = iterate(new ArrayOwner(entries));
    const reverse = iterate(new ArrayOwner(entries), true);

    expect(
      forward.map((value, key, i, length) => `${key}:${value}:${i}/${length}`)
    ).toEqual(['a:1:0/3', 'b:2:1/3', 'c:3:2/3']);
    expect(reverse.map((value, key) => `${key}:${value}`)).toEqual([
      'c:3',
      'b:2',
      'a:1',
    ]);
  });

  it('supports every and some with short-circuit behavior', () => {
    const iterator = iterate(new ArrayOwner(entries));
    const everyCallback = jest.fn((value: number) => value < 3);
    const someCallback = jest.fn((value: number) => value === 2);

    expect(iterator.every(everyCallback)).toBe(false);
    expect(everyCallback).toHaveBeenCalledTimes(3);
    expect(iterator.some(someCallback)).toBe(true);
    expect(someCallback).toHaveBeenCalledTimes(2);
  });

  it('supports forEach early break when the callback returns false', () => {
    const iterator = iterate(new ArrayOwner(entries));
    const visited: number[] = [];

    iterator.forEach((value) => {
      visited.push(value);
      return value !== 2;
    });

    expect(visited).toEqual([1, 2]);
  });

  it('maps, filters, finds values, and finds indexes', () => {
    const iterator = iterate(new ArrayOwner(entries));

    expect(iterator.map((value, key) => `${key}${value}`)).toEqual([
      'a1',
      'b2',
      'c3',
    ]);
    expect(iterator.filter((value) => value % 2 === 1)).toEqual([1, 3]);
    expect(iterator.find((value) => value > 1)).toBe(2);
    expect(iterator.find((value) => value > 10)).toBeUndefined();
    expect(iterator.findIndex((value) => value > 1)).toBe(1);
    expect(iterator.findIndex((value) => value > 10)).toBe(-1);
  });

  it('reduces with an explicit initial value or the first iterated value', () => {
    const iterator = iterate(new ArrayOwner(entries));

    expect(iterator.reduce((sum, value) => sum + value, 10)).toBe(16);
    expect(iterator.reduce((sum, value) => sum + value)).toBe(6);
    expect(
      iterate(new ArrayOwner([])).reduce((sum, value) => sum + value)
    ).toBeUndefined();
    expect(
      iterate(new ArrayOwner([])).reduce((sum, value) => sum + value, 5)
    ).toBe(5);
  });
});
