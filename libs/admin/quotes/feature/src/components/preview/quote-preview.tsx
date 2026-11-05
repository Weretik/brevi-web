import { quotePreviewWarnings } from '@admin/quotes/model';
import { QuotePreviewDialog } from '@admin/quotes/ui';

import type { useQuotePreview } from '../../hooks/preview/use-quote-preview';

interface Props {
  preview: ReturnType<typeof useQuotePreview>;
  /** An archived КП is not sent until it is restored. */
  locked: boolean;
  /** Opens the letter panel for the previewed КП. */
  onSend: () => void;
}

/** The PDF preview of the saved КП with its problems; shown while `preview.shown` is set. */
export function QuotePreview({ preview, locked, onSend }: Props) {
  const shown = preview.shown;
  if (!shown) return null;
  const { quote } = shown;
  const client = quote.companyName ?? quote.recipientName;
  const count = quote.items.length;
  return (
    <QuotePreviewDialog
      open
      number={quote.number}
      subtitle={[client, `позицій: ${count}`].filter(Boolean).join(' · ')}
      pdfUrl={shown.url}
      loading={!shown.url && !shown.error}
      error={shown.error}
      warnings={quote.kind === 'Introduction' ? [] : quotePreviewWarnings(quote)}
      sendDisabled={locked}
      onClose={preview.close}
      onDownload={preview.download}
      onSend={() => {
        preview.close();
        onSend();
      }}
    />
  );
}
