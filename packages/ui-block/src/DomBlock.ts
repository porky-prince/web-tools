import { blockGlobalOptions } from './globalOptions';
import { Block, BlockOptions } from './types';

/**
 * DomBlock implementation that creates a full-screen overlay div element
 * Used for blocking UI interactions or displaying loading states
 */
export class DomBlock implements Block<HTMLElement> {
  // Internal reference to the DOM element
  private _div: HTMLDivElement | null = null;
  // Configuration options for this block instance
  private _options: BlockOptions<HTMLElement> = {};

  /**
   * Initialize the block by creating and configuring the DOM element
   * @param options - Optional configuration including parent element
   */
  init(options?: BlockOptions<HTMLElement>) {
    // Create a full-screen overlay div
    const div = document.createElement('div');
    // Position the div to cover its entire parent container
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.right = '0';
    div.style.bottom = '0';
    div.style.left = '0';
    // Apply semi-transparent red background when debug mode is enabled
    if (blockGlobalOptions.debug) {
      div.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    }
    this._div = div;
    // Store provided options if any
    if (options) {
      this._options = options;
    }
  }

  /**
   * Show or hide the block element in the DOM
   * @param show - Whether to display or remove the block
   * @param options - Optional updated configuration
   */
  show(show: boolean, options?: BlockOptions<HTMLElement>) {
    // Update options if new ones are provided
    if (options) {
      this._options = options;
    }

    const div = this._div!;
    const parent = div.parentNode;

    // Remove from DOM if hiding
    if (!show) {
      if (parent) {
        parent.removeChild(div);
      }
      return;
    }

    // Determine target parent element (defaults to document.body)
    const body = document.body;
    const newParent = this._options.parent || body;

    // Optimize: skip re-appending if already in correct position
    if (parent) {
      if (parent === newParent && parent.lastElementChild === div) {
        return;
      }
      parent.removeChild(div);
    }

    // Append to target parent
    newParent.appendChild(div);
    // Ensure non-body parents have relative positioning for absolute child
    if (newParent !== body && !newParent.style.position) {
      newParent.style.position = 'relative';
    }
  }

  /**
   * Clean up the block by removing it from DOM and resetting state
   */
  clear() {
    // Hide the block first
    this.show(false);
    // Reset internal references to free memory
    this._div = null;
    this._options = {};
  }
}
