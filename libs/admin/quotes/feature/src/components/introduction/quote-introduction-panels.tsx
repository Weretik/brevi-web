import { QuoteIntroModelPickerDrawer } from './quote-intro-model-picker-drawer';
import { QuoteIntroTemplateSaveDrawer } from './quote-intro-template-save-drawer';
import { QuoteIntroTemplatesDrawer } from './quote-intro-templates-drawer';
import { QuoteHistoryDrawer } from '../lifecycle/quote-history-drawer';
import { QuoteSendDrawer } from '../sending/quote-send-drawer';

import type { QuoteIntroductionNotice } from './quote-introduction-notices';
import type { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import type {
  Quote,
  QuoteActor,
  QuoteIntroDraft,
  QuoteIntroSeason,
  QuoteIntroSlotDraft,
} from '@admin/quotes/model';

export type QuoteIntroductionPanel =
  | { kind: 'pick'; season: QuoteIntroSeason; slot: QuoteIntroSlotDraft }
  | { kind: 'templates' }
  | { kind: 'save-template' }
  | { kind: 'history' }
  | { kind: 'send' };

interface Props {
  panel: QuoteIntroductionPanel | null;
  actor: QuoteActor;
  quote: Quote | null;
  draft: QuoteIntroDraft;
  editor: Pick<
    ReturnType<typeof useQuoteIntroductionEditor>,
    'chooseModel' | 'applyTemplate' | 'applyServerQuote'
  >;
  onClose: () => void;
  onNotice: (notice: QuoteIntroductionNotice) => void;
}

/** The side panel open over the introduction quote: model picker, templates, history or sending. */
export function QuoteIntroductionPanels({
  panel,
  actor,
  quote,
  draft,
  editor,
  onClose,
  onNotice,
}: Props) {
  const usedProductIds = new Set(
    draft.pages.flatMap((page) =>
      page.slots.map((slot) => slot.productId).filter((x): x is number => x !== null),
    ),
  );
  return (
    <>
      {panel?.kind === 'pick' && (
        <QuoteIntroModelPickerDrawer
          season={panel.season}
          usedProductIds={usedProductIds}
          onClose={onClose}
          onChoose={(product, variant) => {
            editor.chooseModel(panel.slot, product, variant);
            onClose();
          }}
        />
      )}
      {panel?.kind === 'templates' && (
        <QuoteIntroTemplatesDrawer
          onClose={onClose}
          onApply={async (template) => {
            await editor.applyTemplate(template);
            onClose();
            onNotice({ severity: 'success', text: `Застосовано шаблон «${template.name}».` });
          }}
        />
      )}
      {panel?.kind === 'save-template' && (
        <QuoteIntroTemplateSaveDrawer
          draft={draft}
          onClose={onClose}
          onSaved={(name) => {
            onClose();
            onNotice({ severity: 'success', text: `Шаблон «${name}» збережено.` });
          }}
        />
      )}
      {panel?.kind === 'history' && quote && (
        <QuoteHistoryDrawer quoteId={quote.id} number={quote.number} onClose={onClose} />
      )}
      {panel?.kind === 'send' && quote && (
        <QuoteSendDrawer
          quote={quote}
          actor={actor}
          onClose={onClose}
          onSent={(next) => {
            onClose();
            editor.applyServerQuote(next);
            onNotice({ severity: 'success', text: `КП ${next.number} надіслано.` });
          }}
        />
      )}
    </>
  );
}
