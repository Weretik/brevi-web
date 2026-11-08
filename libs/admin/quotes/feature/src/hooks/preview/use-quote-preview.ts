import { fetchQuotePdf, saveQuotePdf } from '@admin/quotes/data-access';
import { useEffect, useRef, useState } from 'react';

import type { Quote } from '@admin/quotes/model';

interface Shown {
  quote: Quote;
  url: string | null;
  blob: Blob | null;
  error: string | null;
}

/**
 * «Перегляд КП» (crm R-30): the PDF is built on the server from the saved КП only, so the page asks to save first
 * (see `useQuoteSaveFirst`); then the manager sees it and chooses to send, download or print it.
 */
export function useQuotePreview() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [preparing, setPreparing] = useState(false);
  const url = useRef<string | null>(null);

  const release = () => {
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = null;
  };
  useEffect(() => release, []);

  const open = async (saved: Quote) => {
    setPreparing(true);
    try {
      release();
      setShown({ quote: saved, url: null, blob: null, error: null });
      try {
        const blob = await fetchQuotePdf(saved.id);
        url.current = URL.createObjectURL(blob);
        setShown({ quote: saved, url: url.current, blob, error: null });
      } catch {
        setShown({
          quote: saved,
          url: null,
          blob: null,
          error: 'Не вдалося сформувати PDF. Спробуйте ще раз.',
        });
      }
    } finally {
      setPreparing(false);
    }
  };

  const close = () => {
    release();
    setShown(null);
  };

  const download = () => {
    if (shown?.blob) saveQuotePdf(shown.blob, shown.quote.number);
  };

  return { shown, preparing, open, close, download };
}
