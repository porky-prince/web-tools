// Represents a unique identifier for a block instance
export type BlockKey = string | number | object;

// Global configuration options for the block system
export interface BlockGlobalOptions {
  // Factory function to create new block instances
  creator?: <Node>() => Block<Node>;
  // Enables visual debugging with semi-transparent overlay
  debug?: boolean;
}

// Configuration options for individual block instances
export interface BlockOptions<Node> {
  // Parent DOM node where the block will be appended
  parent?: Node;
  // Additional custom arguments for block customization
  args?: any;
}

// Interface defining the contract for block implementations
export interface Block<Node> {
  // Initialize the block with optional configuration
  init(options?: BlockOptions<Node>): void;
  // Show or hide the block, with optional updated configuration
  show(show: boolean, options?: BlockOptions<Node>): void;
  // Clean up and destroy the block instance
  clear(): void;
}
