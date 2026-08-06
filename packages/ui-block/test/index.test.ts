import {
  block,
  blockWrap,
  clearBlocks,
  getBlock,
  removeBlock,
} from '../src/block';
import { blockGlobalOptions } from '../src/globalOptions';
import { Block } from '../src/types';

describe('block', () => {
  beforeEach(() => {
    clearBlocks();
    blockGlobalOptions.creator = undefined;
    blockGlobalOptions.debug = false;
  });

  afterEach(() => {
    clearBlocks();
    blockGlobalOptions.creator = undefined;
    blockGlobalOptions.debug = false;
  });

  it('throws when no block creator is configured', () => {
    expect(() => block('missing-creator', true)).toThrow(
      'blockGlobalOptions.creator is required'
    );
  });

  it('reuses the same block instance for repeated calls with the same key', () => {
    const first = createBlockMock();
    const second = createBlockMock();
    const creator = jest.fn(() => first as Block<unknown>);

    creator.mockReturnValueOnce(first).mockReturnValueOnce(second);
    blockGlobalOptions.creator = creator as typeof blockGlobalOptions.creator;

    block('shared-key', true);
    block('shared-key', false);

    expect(creator).toHaveBeenCalledTimes(1);
    expect(first.init).toHaveBeenCalledTimes(1);
    expect(first.show).toHaveBeenNthCalledWith(1, true);
    expect(first.show).toHaveBeenNthCalledWith(2, false);
    expect(second.init).not.toHaveBeenCalled();
  });

  it('returns a keyed block toggler with the original options', () => {
    const created = createBlockMock<HTMLElement>();
    const creator = jest.fn(() => created);
    const parent = {} as HTMLElement;
    const options = { parent, args: { label: 'saving' } };

    blockGlobalOptions.creator = creator as typeof blockGlobalOptions.creator;

    const toggle = getBlock('loading', options);

    toggle(true);
    toggle(false);

    expect(creator).toHaveBeenCalledTimes(1);
    expect(created.init).toHaveBeenCalledWith(options);
    expect(created.show).toHaveBeenNthCalledWith(1, true);
    expect(created.show).toHaveBeenNthCalledWith(2, false);
  });

  describe('blockWrap', () => {
    it('returns the callback result and hides the block after it settles', async () => {
      const created = createBlockMock<HTMLElement>();
      const options = { parent: {} as HTMLElement };

      blockGlobalOptions.creator = jest.fn(
        () => created
      ) as typeof blockGlobalOptions.creator;

      await expect(
        blockWrap('request', async () => 'completed', options)
      ).resolves.toBe('completed');
      expect(created.init).toHaveBeenCalledWith(options);
      expect(created.show.mock.calls).toEqual([[true], [false]]);
    });

    it('hides the block when the callback throws', async () => {
      const created = createBlockMock();
      const error = new Error('request failed');

      blockGlobalOptions.creator = jest.fn(
        () => created as Block<unknown>
      ) as typeof blockGlobalOptions.creator;

      await expect(
        blockWrap('request', () => {
          throw error;
        })
      ).rejects.toBe(error);
      expect(created.show.mock.calls).toEqual([[true], [false]]);
    });
  });

  it('clears and deletes a tracked block', () => {
    const created = createBlockMock();

    blockGlobalOptions.creator = jest.fn(
      () => created as Block<unknown>
    ) as typeof blockGlobalOptions.creator;

    block('toast', true);

    expect(removeBlock('toast')).toBe(true);
    expect(created.clear).toHaveBeenCalledTimes(1);
    expect(removeBlock('toast')).toBe(false);
  });

  it('clears every tracked block', () => {
    const first = createBlockMock();
    const second = createBlockMock();
    const creator = jest.fn(() => first as Block<unknown>);

    creator.mockReturnValueOnce(first).mockReturnValueOnce(second);
    blockGlobalOptions.creator = creator as typeof blockGlobalOptions.creator;

    block('first', true);
    block('second', true);

    clearBlocks();

    expect(first.clear).toHaveBeenCalledTimes(1);
    expect(second.clear).toHaveBeenCalledTimes(1);
    expect(removeBlock('first')).toBe(false);
    expect(removeBlock('second')).toBe(false);
  });
});

function createBlockMock<Node = unknown>(): jest.Mocked<Block<Node>> {
  return {
    init: jest.fn(),
    show: jest.fn(),
    clear: jest.fn(),
  };
}
