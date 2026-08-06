import { DomBlock } from '../src/DomBlock';
import { blockGlobalOptions } from '../src/globalOptions';

describe('DomBlock', () => {
  let originalDocument: Document | undefined;
  let documentStub: FakeDocument;

  beforeEach(() => {
    originalDocument = globalThis.document;
    documentStub = createFakeDocument();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: documentStub as unknown as Document,
      writable: true,
    });
  });

  afterEach(() => {
    blockGlobalOptions.debug = false;

    if (originalDocument) {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: originalDocument,
        writable: true,
      });
      return;
    }

    const globalWithDocument = globalThis as { document?: Document };

    delete globalWithDocument.document;
  });

  it('appends an overlay to the body with absolute positioning styles', () => {
    const domBlock = new DomBlock();

    domBlock.init();
    domBlock.show(true);

    const overlay = documentStub.body.children[0];

    expect(documentStub.body.children).toHaveLength(1);
    expect(overlay.style.position).toBe('absolute');
    expect(overlay.style.top).toBe('0');
    expect(overlay.style.right).toBe('0');
    expect(overlay.style.bottom).toBe('0');
    expect(overlay.style.left).toBe('0');
    expect(overlay.style.zIndex).toBe('9999');
    expect(overlay.style.pointerEvents).toBe('auto');
  });

  it('applies the debug background color when enabled', () => {
    const domBlock = new DomBlock();

    blockGlobalOptions.debug = true;

    domBlock.init();
    domBlock.show(true);

    expect(documentStub.body.children[0].style.backgroundColor).toBe(
      'rgba(255, 0, 0, 0.3)'
    );
  });

  it('uses the configured parent and adds relative positioning when needed', () => {
    const domBlock = new DomBlock();
    const parent = createFakeElement();

    domBlock.init({ parent: parent as unknown as HTMLElement });
    domBlock.show(true);

    expect(parent.children).toHaveLength(1);
    expect(parent.style.position).toBe('relative');
    expect(documentStub.body.children).toHaveLength(0);
  });

  it('preserves an existing parent position style', () => {
    const domBlock = new DomBlock();
    const parent = createFakeElement();

    parent.style.position = 'sticky';

    domBlock.init({ parent: parent as unknown as HTMLElement });
    domBlock.show(true);

    expect(parent.style.position).toBe('sticky');
  });

  it('moves the overlay between parents and removes it when hidden', () => {
    const domBlock = new DomBlock();
    const firstParent = createFakeElement();
    const secondParent = createFakeElement();

    domBlock.init({ parent: firstParent as unknown as HTMLElement });
    domBlock.show(true);

    const overlay = firstParent.children[0];

    domBlock.show(true, { parent: secondParent as unknown as HTMLElement });

    expect(firstParent.children).toHaveLength(0);
    expect(secondParent.children).toEqual([overlay]);

    domBlock.show(false);

    expect(secondParent.children).toHaveLength(0);
  });

  it('does not append the same overlay twice to the same parent', () => {
    const domBlock = new DomBlock();
    const parent = createFakeElement();

    domBlock.init({ parent: parent as unknown as HTMLElement });
    domBlock.show(true);

    const overlay = parent.children[0];

    domBlock.show(true);

    expect(parent.children).toEqual([overlay]);
  });
});

interface FakeDocument {
  body: FakeElement;
  createElement(tagName: string): FakeElement;
}

interface FakeElement {
  children: FakeElement[];
  parentNode: FakeElement | null;
  style: Record<string, string>;
  appendChild(child: FakeElement): FakeElement;
  removeChild(child: FakeElement): FakeElement;
  readonly lastElementChild: FakeElement | null;
}

function createFakeDocument(): FakeDocument {
  return {
    body: createFakeElement(),
    createElement: jest.fn(() => createFakeElement()),
  };
}

function createFakeElement(): FakeElement {
  return {
    children: [],
    parentNode: null,
    style: {},
    appendChild(child) {
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    removeChild(child) {
      const index = this.children.indexOf(child);

      if (index === -1) {
        throw new Error('child not found');
      }

      this.children.splice(index, 1);
      child.parentNode = null;
      return child;
    },
    get lastElementChild() {
      if (this.children.length === 0) {
        return null;
      }

      return this.children[this.children.length - 1];
    },
  };
}
