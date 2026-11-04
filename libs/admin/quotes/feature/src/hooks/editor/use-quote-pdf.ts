import { downloadQuotePdf } from '@admin/quotes/data-access';
import { useState } from 'react';

import type { Quote } from '@admin/quotes/model';

interface Source {
  quote: Quote | null;
  dirty: boolean;
  save: () => Promise<Quote | null>;
}

/**
 * «Сформувати КП»: the PDF is built on the server from the saved КП only, so unsaved changes are saved first.
 */
export function useQuotePdf({ quote, dirty, save }: Source) {
  const [generating, setGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const generate = async () => {
    setPdfError(null);
    setGenerating(true);
    try {
      const saved = quote && !dirty ? quote : await save();
      if (!saved) return;
      await downloadQuotePdf(saved.id, saved.number);
    } catch {
      setPdfError('Не вдалося сформувати PDF. Спробуйте ще раз.');
    } finally {
      setGenerating(false);
    }
  };

  return { generate, generating, pdfError };
}
