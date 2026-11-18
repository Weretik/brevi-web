import { QuoteEditorItemPanels } from './quote-editor-item-panels';
import { QuoteRepriceDrawer } from '../editor/quote-reprice-drawer';
import { QuoteResponsibleDrawer } from '../editor/quote-responsible-drawer';
import { QuoteHistoryDrawer } from '../lifecycle/quote-history-drawer';
import { QuoteSendDrawer } from '../sending/quote-send-drawer';

import type { QuoteEditorPanel } from './quote-editor-item-panels';
import type { useQuoteEditor } from '../../hooks/editor/use-quote-editor';
import type { Quote, QuoteActor } from '@admin/quotes/model';

export type { QuoteEditorPanel } from './quote-editor-item-panels';

interface Props {
  panel: QuoteEditorPanel | null;
  editor: ReturnType<typeof useQuoteEditor>;
  actor: QuoteActor;
  onClose: () => void;
  /** The КП went to another manager the actor cannot see. */
  onHandedOver: () => void;
  onSent: (next: Quote) => void;
}

/** The side panels of the КП editor; one is open at a time. */
export function QuoteEditorPanels({ panel, editor, actor, onClose, onHandedOver, onSent }: Props) {
  const { quote } = editor;
  if (!panel) return null;

  switch (panel.kind) {
    case 'responsible':
      return quote ? (
        <QuoteResponsibleDrawer
          quote={quote}
          onClose={onClose}
          onDone={(next) => {
            onClose();
            if (actor.canSeeAll || next.responsible.userId === actor.userId)
              editor.applyServerQuote(next);
            else onHandedOver();
          }}
        />
      ) : null;
    case 'reprice':
      return quote ? (
        <QuoteRepriceDrawer
          quote={quote}
          onClose={onClose}
          onApplied={() => {
            onClose();
            void editor.reload();
          }}
        />
      ) : null;
    case 'history':
      return quote ? (
        <QuoteHistoryDrawer quoteId={quote.id} number={quote.number} onClose={onClose} />
      ) : null;
    case 'send':
      return quote ? (
        <QuoteSendDrawer
          quote={quote}
          actor={actor}
          onClose={onClose}
          onSent={(next) => {
            onClose();
            editor.applyServerQuote(next);
            onSent(next);
          }}
        />
      ) : null;
    default:
      return <QuoteEditorItemPanels panel={panel} editor={editor} onClose={onClose} />;
  }
}
