import { Queue } from '../../src/data-structure/Queue';

describe('Queue', () => {
  it('dequeues initial values and enqueued values in FIFO order', () => {
    const initial = ['first', 'second'];
    const queue = new Queue(initial);

    expect(initial).toEqual(['second', 'first']);
    expect(queue.size).toBe(2);
    expect(queue.isEmpty()).toBe(false);
    expect(queue.first()).toBe('first');
    expect(queue.last()).toBe('second');

    expect(queue.enqueue('third')).toBe(queue);
    expect(queue.first()).toBe('first');
    expect(queue.last()).toBe('third');
    expect(queue.size).toBe(3);
    expect(queue.dequeue()).toBe('first');
    expect(queue.dequeue()).toBe('second');
    expect(queue.dequeue()).toBe('third');
    expect(queue.dequeue()).toBeUndefined();
    expect(queue.isEmpty()).toBe(true);
  });

  it('reads the last initial value before any enqueue operation', () => {
    const queue = new Queue(['first', 'second', 'third']);

    expect(queue.last()).toBe('third');
  });

  it('switches from push storage to shift storage while preserving order', () => {
    const queue = new Queue<number>();

    queue.enqueue(1).enqueue(2).enqueue(3);

    expect(queue.first()).toBe(1);
    expect(queue.dequeue()).toBe(1);
    expect(queue.first()).toBe(2);
    expect(queue.last()).toBe(3);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
  });

  it('clears all queued values', () => {
    const queue = new Queue([1, 2, 3]);

    queue.clear();

    expect(queue.size).toBe(0);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.first()).toBeUndefined();
    expect(queue.last()).toBeUndefined();
    expect(queue.dequeue()).toBeUndefined();
  });
});
