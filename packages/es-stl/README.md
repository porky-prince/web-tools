# es-stl

`es-stl` is a small TypeScript utility package with standard data structures,
iterator helpers, sorted-array algorithms, binary-search helpers, and numeric
formatting utilities.

It ships as ESM and CommonJS, includes TypeScript declarations, and has no
runtime dependencies.

## Installation

Install the package with your preferred package manager.

```sh
pnpm add es-stl
# or
npm install es-stl
# or
yarn add es-stl
```

## Quick start

Import the helpers you need from the package entrypoint.

```ts
import {
  Dictionary,
  Heap,
  Queue,
  binarySearch,
  mergeIntoSortedArray,
  mergeSortedArray,
  toFixed,
} from 'es-stl';

const queue = new Queue(['first', 'second']);
queue.enqueue('third');

queue.dequeue(); // 'first'
queue.first(); // 'second'

const priorities = new Heap<string>();
priorities.push('low', 1);
priorities.push('high', 10);
priorities.pop(); // 'high'

const dictionary = new Dictionary<string, number>({ apples: 2 });
dictionary.set('oranges', 3);
dictionary.values(); // [2, 3]

const users = [{ id: 1 }, { id: 3 }, { id: 5 }];
binarySearch(users, 3, (user) => user.id); // 1

const values = [1, 3, 5];
mergeIntoSortedArray(values, 4, (a, b) => a - b); // [1, 3, 4, 5]

mergeSortedArray([1, 4], [2, 3], (a, b) => a - b); // [1, 2, 3, 4]

toFixed(1.235, 2); // '1.24'
```

## Documentation

See [`es-stl`](https://porky-prince.github.io/web-tools/es-stl/)
