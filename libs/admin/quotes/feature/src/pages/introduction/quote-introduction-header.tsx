import { quoteIntroPageErrors } from '@admin/quotes/model';
import { QuoteMoreMenu } from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';

import { QuoteIntroductionActions } from './quote-introduction-actions';

import type { QuoteIntroductionNotice } from '../../components/introduction/quote-introduction-notices';
import type { QuoteIntroductionPanel } from '../../components/introduction/quote-introduction-panels';
import type { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import type { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import type { Quote, QuoteIntroDraft } from '@admin/quotes/model';

interface Props {
  editor: ReturnType<typeof useQuoteIntroductionEditor>;
  draft: QuoteIntroDraft;
  lifecycle: ReturnType<typeof useQuoteLifecycle>;
  canDelete: boolean;
  onDelete: (quote: Quote) => void;
  onPanel: (panel: QuoteIntroductionPanel) => void;
  onNotice: (notice: QuoteIntroductionNotice | null) => void;
}

const sentLabel = (at: string | null) =>
  at ? ` · надіслано ${new Date(at).toLocaleDateString('uk-UA')}` : '';

/** The header of «КП для знайомства»: number and sending date, templates and «Ще». */
export function QuoteIntroductionHeader({
  editor,
  draft,
  lifecycle,
  canDelete,
  onDelete,
  onPanel,
  onNotice,
}: Props) {
  const { quote } = editor;
  return (
    <ReferencePageHeader
      overline="Менеджер сервісу"
      title="КП для знайомства"
      subtitle={
        quote
          ? `КП ${quote.number}${sentLabel(quote.lastSentAt)}`
          : 'Самостійна добірка для холодного контакту: лише актуальні моделі, тканини та ціни з каталогу.'
      }
      actions={
        <>
          <QuoteIntroductionActions
            onRestart={() => {
              onNotice(null);
              editor.restart();
            }}
            onTemplates={() => onPanel({ kind: 'templates' })}
            onSaveTemplate={() => {
              if (Object.keys(quoteIntroPageErrors(draft)).length > 0)
                onNotice({
                  severity: 'warning',
                  text: 'Щоб зберегти шаблон, оберіть усі моделі й тканини.',
                });
              else onPanel({ kind: 'save-template' });
            }}
          />
          {quote && (
            <QuoteMoreMenu
              dirty={editor.dirty}
              busy={lifecycle.busy}
              onHistory={() => onPanel({ kind: 'history' })}
              onCopy={() => void lifecycle.copy()}
              onDelete={canDelete ? () => onDelete(quote) : undefined}
            />
          )}
        </>
      }
    />
  );
}
