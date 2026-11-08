import { QuoteChangeModelDrawer } from '../../components/custom-sewing/quote-change-model-drawer';
import { QuoteCustomSewingDrawer } from '../../components/custom-sewing/quote-custom-sewing-drawer';
import { QuoteModelChangesDrawer } from '../../components/custom-sewing/quote-model-changes-drawer';
import { QuoteRepriceDrawer } from '../../components/editor/quote-reprice-drawer';
import { QuoteResponsibleDrawer } from '../../components/editor/quote-responsible-drawer';
import { QuoteEmbroideryDrawer } from '../../components/embroidery/quote-embroidery-drawer';
import { QuoteHistoryDrawer } from '../../components/lifecycle/quote-history-drawer';
import { QuotePhotoPickerDrawer } from '../../components/photo/quote-photo-picker-drawer';
import { QuoteCatalogPickerDrawer } from '../../components/picker/quote-catalog-picker-drawer';
import { QuoteFabricPickerDrawer } from '../../components/picker/quote-fabric-picker-drawer';
import { QuoteSendDrawer } from '../../components/sending/quote-send-drawer';

import type { useQuoteEditor } from '../../hooks/editor/use-quote-editor';
import type { Quote, QuoteActor } from '@admin/quotes/model';

export type QuoteEditorPanel =
  | { kind: 'catalog' }
  | { kind: 'embroidery' }
  | { kind: 'fabric'; itemKey: string }
  | { kind: 'custom'; itemKey?: string }
  | { kind: 'photo'; itemKey: string }
  | { kind: 'changes'; itemKey: string }
  | { kind: 'responsible' }
  | { kind: 'reprice' }
  | { kind: 'history' }
  | { kind: 'send' };

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
  const { quote, draft } = editor;
  if (!panel) return null;
  const item =
    'itemKey' in panel && panel.itemKey
      ? draft.items.find((candidate) => candidate.key === panel.itemKey)
      : undefined;

  switch (panel.kind) {
    case 'catalog':
      return (
        <QuoteCatalogPickerDrawer
          onClose={onClose}
          onAdd={(items) => {
            editor.addItems(items);
            onClose();
          }}
        />
      );
    case 'changes':
      return item ? <QuoteModelChangesDrawer item={item} onClose={onClose} /> : null;
    case 'fabric':
      return item ? (
        <QuoteFabricPickerDrawer
          item={item}
          onClose={onClose}
          onAdd={(options) => {
            editor.addOptions(item.key, options);
            onClose();
          }}
        />
      ) : null;
    case 'custom':
      if (item?.kind === 'Sewing')
        return (
          <QuoteChangeModelDrawer
            item={item}
            onClose={onClose}
            onDone={(next) => {
              editor.updateItem(item.key, { ...next, key: item.key });
              onClose();
            }}
          />
        );
      if (panel.itemKey && !item) return null;
      return (
        <QuoteCustomSewingDrawer
          item={item}
          onClose={onClose}
          onDone={(next) => {
            if (item) editor.updateItem(item.key, { ...next, key: item.key });
            else editor.addItems([next]);
            onClose();
          }}
        />
      );
    case 'embroidery':
      return (
        <QuoteEmbroideryDrawer
          ensureSaved={() => (quote && !editor.dirty ? Promise.resolve(quote) : editor.save())}
          onClose={onClose}
          onAdded={(next) => {
            editor.applyServerQuote(next);
            onClose();
          }}
        />
      );
    case 'photo':
      return item ? (
        <QuotePhotoPickerDrawer
          item={item}
          onClose={onClose}
          onDone={(photoUrl) => {
            editor.updateItem(item.key, { photoUrl });
            onClose();
          }}
        />
      ) : null;
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
  }
}
