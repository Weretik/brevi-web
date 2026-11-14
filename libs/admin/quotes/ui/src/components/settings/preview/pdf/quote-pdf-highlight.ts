import type { previewHighlight } from '../quote-preview-highlight';

/** Marks the parts of the sketch that show the setting being edited. */
export type PdfHighlight = (...paths: string[]) => ReturnType<typeof previewHighlight>;
