import { DomBlock } from './DomBlock';
import { Block, BlockGlobalOptions } from './types';

// Default configuration for the block system
// Uses DomBlock as the default implementation and disables debug mode
const defaultOptions: BlockGlobalOptions = {
  // Factory function that creates a new DomBlock instance
  creator: <Node>() => new DomBlock() as Block<Node>,
  // Debug mode disabled by default (no visual overlay)
  debug: false,
};

// Exported global options object that can be modified at runtime
// Initialized with a copy of default options to allow customization
export const blockGlobalOptions = Object.assign({}, defaultOptions);
