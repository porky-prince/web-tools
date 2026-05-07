# ui-block

`ui-block` helps you block user interaction while async work is running. It
ships with a DOM-based overlay by default and also lets you provide a custom
block implementation when you need different rendering behavior.

## Installation

Install the package with your preferred package manager.

```sh
pnpm add ui-block
# or
npm install ui-block
# or
yarn add ui-block
```

## Quick start

The default setup uses `DomBlock`, which appends an absolutely positioned
overlay to `document.body` or to a specific parent element.

```ts
import { block } from 'ui-block';

async function saveProfile() {
  block(saveProfile, true);

  try {
    await submitProfileForm();
  } finally {
    block(saveProfile, false);
  }
}
```

Each block is tracked by key. Reusing the same key reuses the same block
instance until you remove it.

## Use a scoped container

Pass a `parent` element when you want to block part of the page instead of the
entire document.

```ts
import { block } from 'ui-block';

const panel = document.querySelector('[data-panel="settings"]') as HTMLElement;

block('settings-panel', true, { parent: panel });

try {
  await refreshSettings();
} finally {
  block('settings-panel', false);
}
```

When `DomBlock` attaches to a non-body parent, it sets that parent's
`position` to `relative` if no position style is already defined.

## Reuse a block controller

Use `getBlock()` when you want a small toggler function tied to one key.

```ts
import { getBlock } from 'ui-block';

const setLoading = getBlock('search-results');

async function runSearch() {
  setLoading(true);

  try {
    await loadResults();
  } finally {
    setLoading(false);
  }
}
```

## Anti-nesting

Use different keys when you want to avoid blocking nested operations.

For example, if you have multiple async operations that share a common key:
```ts
import { getBlock } from 'ui-block';

// Global loading block
const setLoading = getBlock('global');

// file.ts
async function asyncFn() {
  setLoading(true);

  try {
    await Promise.all([
      asyncFn1(), // All the loading will be false when the asyncFn1() is done, but the asyncFn is still running
      asyncFn2(),
    ]);
  } finally {
    setLoading(false);
  }
}

// file1.ts
async function asyncFn1() {
  setLoading(true);

  try {
    await delay(1000);
  } finally {
    setLoading(false);
  }
}

// file2.ts
async function asyncFn2() {
  setLoading(true);

  try {
    await delay(2000);
  } finally {
    setLoading(false);
  }
}
```

Use different keys instead:
```ts
import { block } from 'ui-block';

// file.ts
async function asyncFn() {
  block(asyncFn, true);

  try {
    await Promise.all([
      asyncFn1(),
      asyncFn2(),
    ]);
  } finally {
    block(asyncFn, false);
  }
}

// file1.ts
async function asyncFn1() {
  block(asyncFn1, true);

  try {
    await delay(1000);
  } finally {
    block(asyncFn1, false);
  }
}

// file2.ts
async function asyncFn2() {
  block(asyncFn2, true);

  try {
    await delay(2000);
  } finally {
    block(asyncFn2, false);
  }
}
```

## API

The package exports the main helpers, the default DOM implementation, global
configuration, and TypeScript types.

### `block(key, show, options?)`

Creates or reuses a block for `key`, then shows or hides it.

- `key` is a `string`, `number`, or `object` used to identify the block.
- `show` controls whether the block is visible.
- `options.parent` sets the parent node for the initial block instance.
- `options.args` is available for custom block implementations.

### `getBlock(key, options?)`

Returns a function with the signature `(show: boolean) => void` for a specific
block key.

### `removeBlock(key)`

Clears the tracked block for `key` and removes it from the internal registry.
Returns `true` when a block existed and `false` otherwise.

### `clearBlocks()`

Clears every tracked block. Use this when you need to reset all active blocks
at once.

### `blockGlobalOptions`

Controls global package behavior.

```ts
import { blockGlobalOptions } from 'ui-block';

blockGlobalOptions.debug = true;
```

Available options:

- `creator`: Factory function used to create new block instances. By default,
  `ui-block` uses `DomBlock`.
- `debug`: When `true`, `DomBlock` renders a semi-transparent red overlay to
  make the blocked area visible during development.

## Provide a custom block implementation

You can replace the default DOM overlay with your own `Block` implementation.
This is useful when your app needs a framework-specific loading state, a custom
spinner, or a non-DOM target.

```ts
import { block, blockGlobalOptions, type Block } from 'ui-block';

class ConsoleBlock implements Block<unknown> {
  init() {}

  show(show: boolean) {
    if (show) {
      console.log('blocked');
    } else {
      console.log('unblocked');
    }
  }

  clear() {
    console.log('cleared');
  }
}

blockGlobalOptions.creator = () => new ConsoleBlock();

block('job-sync', true);
block('job-sync', false);
```

The `Block` interface is:

```ts
interface Block<Node> {
  init(options?: BlockOptions<Node>): void;
  show(show: boolean, options?: BlockOptions<Node>): void;
  clear(): void;
}
```

## Notes

`ui-block` is designed for js runtimes. The default `DomBlock`
implementation depends on `document` and `HTMLElement`.

If you need to fully remove a tracked block after an async operation completes,
prefer `removeBlock()` instead of only calling `block(key, false)`. Hiding a
block removes it from the DOM, but the keyed instance stays in memory until you
remove or clear it.

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md) for release history.
