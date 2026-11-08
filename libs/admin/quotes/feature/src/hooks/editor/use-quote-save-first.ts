import { useState } from 'react';

import type { Quote } from '@admin/quotes/model';

interface Source {
  quote: Quote | null;
  dirty: boolean;
  save: () => Promise<Quote | null>;
}

type Action = (saved: Quote) => void;

/**
 * «Щоб продовжити, збережіть КП» (crm R-33): the PDF and sending work with the saved КП only. A saved КП without
 * changes goes on at once; otherwise the page asks, saves and then goes on without leaving the КП.
 */
export function useQuoteSaveFirst({ quote, dirty, save }: Source) {
  const [pending, setPending] = useState<{ action: Action } | null>(null);

  return {
    asking: pending !== null,
    run: (action: Action) => {
      if (quote && !dirty) action(quote);
      else setPending({ action });
    },
    cancel: () => setPending(null),
    confirm: async () => {
      const action = pending?.action;
      const saved = await save();
      setPending(null);
      if (saved && action) action(saved);
    },
  };
}
