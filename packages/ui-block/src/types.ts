/** Key used to cache and reuse a block instance. */
export type BlockKey = string | number | object;

/** Global defaults used when creating blocks. */
export interface BlockGlobalOptions {
  /** Creates the implementation used for a new key. */
  creator?: <Node>() => Block<Node>;
  /** Adds a visible background to the default DOM overlay. */
  debug?: boolean;
}

/** Options passed to a block implementation. */
export interface BlockOptions<Node> {
  /** Node covered by the block. Defaults to `document.body` for `DomBlock`. */
  parent?: Node;
  /** Implementation-specific configuration. */
  args?: any;
}

/** Lifecycle implemented by a block renderer. */
export interface Block<Node> {
  init(options?: BlockOptions<Node>): void;
  show(show: boolean, options?: BlockOptions<Node>): void;
  clear(): void;
}
