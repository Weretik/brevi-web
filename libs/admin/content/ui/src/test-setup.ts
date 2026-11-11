import '@testing-library/jest-dom/vitest';

// jsdom has no layout: the text editor (ProseMirror) asks for rectangles when it scrolls to the cursor.
const noRects = () => [] as unknown as DOMRectList;
Range.prototype.getClientRects = noRects;
Range.prototype.getBoundingClientRect = () => new DOMRect();
Element.prototype.getClientRects = noRects;
