import { blockGlobalOptions } from './globalOptions';
import { Block, BlockKey, BlockOptions } from './types';

const blockMap = new Map<BlockKey, Block<any>>();

/**
 * Shows or hides the block associated with a key.
 *
 * A block is created and initialized the first time its key is used.
 *
 * @throws `Error` if no global block creator is configured.
 */
export function block<Node>(
  key: BlockKey,
  show: boolean,
  options?: BlockOptions<Node>
) {
  let block = blockMap.get(key);
  if (!block) {
    if (!blockGlobalOptions.creator) {
      throw new Error('blockGlobalOptions.creator is required');
    }
    block = blockGlobalOptions.creator();
    block.init(options);
    blockMap.set(key, block);
  }

  block.show(show);
}

/**
 * Keeps a keyed block visible until a callback settles.
 *
 * The block is hidden even when the callback throws or returns a rejected
 * promise.
 *
 * @returns The callback's resolved value.
 */
export async function blockWrap<Node, Result>(
  key: BlockKey,
  callback: () => Result | PromiseLike<Result>,
  options?: BlockOptions<Node>
): Promise<Awaited<Result>> {
  block(key, true, options);
  try {
    return await callback();
  } finally {
    block(key, false);
  }
}

/**
 * Creates a reusable visibility controller for a keyed block.
 */
export function getBlock<Node>(key: BlockKey, options?: BlockOptions<Node>) {
  return (show: boolean) => block(key, show, options);
}

/**
 * Clears and removes a keyed block.
 *
 * @returns Whether a block was registered for the key.
 */
export function removeBlock(key: BlockKey) {
  const block = blockMap.get(key);
  if (!block) {
    return false;
  }
  block.clear();
  return blockMap.delete(key);
}

/** Clears and removes every registered block. */
export function clearBlocks() {
  blockMap.forEach((block) => block.clear());
  blockMap.clear();
}
