import { QuoteChangeModelDrawer } from '../custom-sewing/quote-change-model-drawer';
import { QuoteCustomSewingDrawer } from '../custom-sewing/quote-custom-sewing-drawer';
import { QuoteModelChangesDrawer } from '../custom-sewing/quote-model-changes-drawer';
import { QuoteEmbroideryDrawer } from '../embroidery/quote-embroidery-drawer';
import { QuotePhotoPickerDrawer } from '../photo/quote-photo-picker-drawer';
import { QuoteCatalogPickerDrawer } from '../picker/quote-catalog-picker-drawer';
import { QuoteFabricPickerDrawer } from '../picker/quote-fabric-picker-drawer';

import type { useQuoteEditor } from '../../hooks/editor/use-quote-editor';

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
  panel: QuoteEditorPanel;
  editor: ReturnType<typeof useQuoteEditor>;
  onClose: () => void;
}

/** The side panels that add or change items: Catalog, fabrics, «Виріб з нуля», changes, photo, embroidery. */
export function QuoteEditorItemPanels({ panel, editor, onClose }: Props) {
  const { quote, draft } = editor;
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
    default:
      return null;
  }
}
