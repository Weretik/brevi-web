import { createContext } from 'react';

export const QuoteCustomEditorState = createContext<
  ((dirty: boolean, locked: boolean) => void) | null
>(null);
