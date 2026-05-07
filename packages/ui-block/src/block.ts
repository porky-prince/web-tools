import { blockGlobalOptions } from './globalOptions';
import { Block, BlockKey, BlockOptions } from './types';

// Registry map storing all active block instances by their keys
const blockMap = new Map<BlockKey, Block<any>>();

/**
 * Main function to show or hide a block by its key
 * Creates the block if it doesn't exist yet
 * @param key - Unique identifier for the block
 * @param show - Whether to display or hide the block
 * @param options - Optional configuration for the block
 */
export function block<Node>(
  key: BlockKey,
  show: boolean,
  options?: BlockOptions<Node>
) {
  // Retrieve existing block or create a new one
  let block = blockMap.get(key);
  if (!block) {
    // Ensure a creator function is configured globally
    if (!blockGlobalOptions.creator) {
      throw new Error('blockGlobalOptions.creator is required');
    }
    // Create and initialize new block instance
    block = blockGlobalOptions.creator();
    block.init(options);
    blockMap.set(key, block);
  }

  // Toggle visibility
  block.show(show);
}

/**
 * Returns a convenience function to toggle a specific block
 * Useful for creating reusable block controllers
 * @param key - Unique identifier for the block
 * @param options - Optional configuration for the block
 * @returns A function that accepts a boolean to show/hide the block
 */
export function getBlock<Node>(key: BlockKey, options?: BlockOptions<Node>) {
  return (show: boolean) => block(key, show, options);
}

/**
 * Remove a specific block from the registry and clean it up
 * @param key - Unique identifier of the block to remove
 * @returns True if the block was found and removed, false otherwise
 */
export function removeBlock(key: BlockKey) {
  const block = blockMap.get(key);
  if (!block) {
    return false;
  }
  // Clean up the block's DOM elements and state
  block.clear();
  return blockMap.delete(key);
}

/**
 * Remove all blocks from the registry and clean them up
 * Useful for application shutdown or reset scenarios
 */
export function clearBlocks() {
  // Clear each block's DOM elements and internal state
  blockMap.forEach((block) => block.clear());
  // Empty the registry map
  blockMap.clear();
}
