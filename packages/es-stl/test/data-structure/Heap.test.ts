import { Heap } from '../../src/data-structure/Heap';

describe('Heap', () => {
  it('returns values by highest priority first and keeps top non-destructive', () => {
    const heap = new Heap<string>();

    expect(heap.isEmpty()).toBe(true);
    expect(heap.top()).toBeUndefined();
    expect(heap.pop()).toBeUndefined();

    heap.push('low', 1);
    heap.push('high', 10);
    heap.push('medium', 5);
    heap.push('also-high', 10);

    expect(heap.size).toBe(4);
    expect(heap.top()).toBe('high');
    expect(heap.top()).toBe('high');
    expect(heap.pop()).toBe('high');
    expect(heap.pop()).toBe('also-high');
    expect(heap.pop()).toBe('medium');
    expect(heap.pop()).toBe('low');
    expect(heap.pop()).toBeUndefined();
    expect(heap.size).toBe(0);
  });

  it('supports clearing and reuse after clear', () => {
    const heap = new Heap<string>();

    heap.push('old', 1);
    heap.clear();

    expect(heap.size).toBe(0);
    expect(heap.isEmpty()).toBe(true);

    heap.push('new', 2);

    expect(heap.top()).toBe('new');
    expect(heap.pop()).toBe('new');
  });

  it('moves the higher-priority right child up while popping', () => {
    const heap = new Heap<string>();

    heap.push('top', 100);
    heap.push('left', 50);
    heap.push('right', 90);
    heap.push('tail', 10);

    expect(heap.pop()).toBe('top');
    expect(heap.top()).toBe('right');
    expect(heap.pop()).toBe('right');
    expect(heap.pop()).toBe('left');
    expect(heap.pop()).toBe('tail');
  });

  it('trims spare backing storage with fit without changing heap contents', () => {
    const heap = new Heap<number>();

    heap.push(1, 1);
    heap.push(2, 2);
    heap.push(3, 3);
    expect(heap.pop()).toBe(3);

    heap.fit();

    expect(heap.size).toBe(2);
    expect(heap.pop()).toBe(2);
    expect(heap.pop()).toBe(1);
  });
});
