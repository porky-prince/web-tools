import { blockGlobalOptions } from './globalOptions';
import { Block, BlockOptions } from './types';

/**
 * Blocks pointer interaction with an overlay that covers its parent element.
 */
export class DomBlock implements Block<HTMLElement> {
  private _div: HTMLDivElement | null = null;
  private _options: BlockOptions<HTMLElement> = {};

  /** Creates the overlay and applies its initial options. */
  init(options?: BlockOptions<HTMLElement>) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.right = '0';
    div.style.bottom = '0';
    div.style.left = '0';
    div.style.zIndex = '9999';
    div.style.pointerEvents = 'auto';
    if (blockGlobalOptions.debug) {
      div.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    }
    this._div = div;
    if (options) {
      this._options = options;
    }
  }

  /** Attaches or removes the overlay, optionally updating its parent. */
  show(show: boolean, options?: BlockOptions<HTMLElement>) {
    if (options) {
      this._options = options;
    }

    const div = this._div!;
    const parent = div.parentNode;

    if (!show) {
      if (parent) {
        parent.removeChild(div);
      }
      return;
    }

    const body = document.body;
    const newParent = this._options.parent || body;

    if (parent) {
      if (parent === newParent && parent.lastElementChild === div) {
        return;
      }
      parent.removeChild(div);
    }

    newParent.appendChild(div);
    // Establish the containing block needed by the absolute overlay.
    if (newParent !== body && !newParent.style.position) {
      newParent.style.position = 'relative';
    }
  }

  /** Removes the overlay and releases its retained state. */
  clear() {
    this.show(false);
    this._div = null;
    this._options = {};
  }
}
