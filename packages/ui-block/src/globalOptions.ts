import { DomBlock } from './DomBlock';
import { Block, BlockGlobalOptions } from './types';

const defaultOptions: BlockGlobalOptions = {
  creator: <Node>() => new DomBlock() as Block<Node>,
  debug: false,
};

/** Mutable defaults used for subsequently created blocks. */
export const blockGlobalOptions = Object.assign({}, defaultOptions);
