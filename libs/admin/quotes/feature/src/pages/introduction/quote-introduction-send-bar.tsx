import { QuoteSendActions } from '@admin/quotes/ui';
import { useNavigate } from 'react-router-dom';

import type { QuoteIntroductionNotice } from '../../components/introduction/quote-introduction-notices';
import type { useQuoteSaveFirst } from '../../hooks/editor/use-quote-save-first';
import type { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import type { useQuotePreview } from '../../hooks/preview/use-quote-preview';

interface Props {
  editor: ReturnType<typeof useQuoteIntroductionEditor>;
  preview: ReturnType<typeof useQuotePreview>;
  saveFirst: ReturnType<typeof useQuoteSaveFirst>;
  onNotice: (notice: QuoteIntroductionNotice | null) => void;
}

/** The bottom bar: save, save and close, cancel, PDF and send (send opens the PDF preview first). */
export function QuoteIntroductionSendBar({ editor, preview, saveFirst, onNotice }: Props) {
  const navigate = useNavigate();
  return (
    <QuoteSendActions
      layout="bar"
      dirty={editor.dirty}
      saving={editor.saving}
      generating={preview.preparing}
      onSave={() =>
        void editor.save().then((saved) => {
          if (saved) onNotice({ severity: 'success', text: 'КП збережено.' });
        })
      }
      onSaveAndClose={() =>
        void editor.save().then((saved) => {
          if (saved) navigate('/crm/quotes', { state: { notice: 'КП збережено' } });
        })
      }
      onCancel={() => navigate('/crm/quotes')}
      onPdf={() => saveFirst.run((saved) => void preview.open(saved))}
      onSend={() => {
        onNotice(null);
        saveFirst.run((saved) => void preview.open(saved));
      }}
    />
  );
}
