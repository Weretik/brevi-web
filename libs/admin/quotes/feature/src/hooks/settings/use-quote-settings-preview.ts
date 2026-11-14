import { useMemo, useState } from 'react';

import type { QuoteLetterRef, QuotePreviewView } from '@admin/quotes/ui';

/** The preview follows the field in focus: letter fields show the letter, the rest the PDF. */
const viewOf = (path: string): QuotePreviewView | null =>
  path.startsWith('email.') || path.startsWith('letter:')
    ? 'letter'
    : path.startsWith('company.') || path.startsWith('pdf.') || path.startsWith('staff:')
      ? 'pdf'
      : null;

/** «Налаштування КП» preview: PDF or letter, the field in focus and the opened letter. */
export function useQuoteSettingsPreview() {
  const [focused, setFocused] = useState<string | null>(null);
  const [view, setView] = useState<QuotePreviewView>('pdf');
  const [openLetter, setOpenLetter] = useState<QuoteLetterRef | null>(null);
  /** Value of `QuoteSettingsFormContext`: the form reports its focused field. */
  const form = useMemo(
    () => ({
      onFocusField: (path: string) => {
        setFocused(path);
        const next = viewOf(path);
        if (next) setView(next);
      },
    }),
    [],
  );

  return {
    form,
    focused,
    clearFocus: () => setFocused(null),
    view,
    setView,
    openLetter,
    openLetterRow: (letter: QuoteLetterRef | null) => {
      setOpenLetter(letter);
      if (letter) setView('letter');
    },
  };
}
