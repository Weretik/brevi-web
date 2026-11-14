import { oneOffItemDraft } from '@admin/quotes/model';
import { QuoteAddItems, QuoteItemCard, QuoteNotesCard } from '@admin/quotes/ui';
import { Box, Typography } from '@mui/material';

import type { useQuoteEditor } from '../../hooks/editor/use-quote-editor';
import type { QuoteEditorPanel } from '../../pages/editor/quote-editor-panels';
import type { QuoteFabricFacts } from '@admin/quotes/model';

/** The anchor of «Додати позицію», for jumping to it from a save problem. */
export const quoteAddItemsAnchor = 'quote-add-items';

interface Props {
  editor: ReturnType<typeof useQuoteEditor>;
  fabricFacts: ReadonlyMap<number, QuoteFabricFacts>;
  onOpenSupplier: ((facts: QuoteFabricFacts) => void) | undefined;
  onPanel: (panel: QuoteEditorPanel) => void;
}

/** The items of a КП «під запит» with their prices, the add buttons and the notes. */
export function QuoteEditorItems({ editor, fabricFacts, onOpenSupplier, onPanel }: Props) {
  const { draft } = editor;
  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mt: 1 }}>
        Позиції{' '}
        <Box
          component="span"
          sx={{ fontFamily: 'var(--admin-font-mono)', color: 'text.secondary' }}
        >
          {draft.items.length}
        </Box>
      </Typography>
      {draft.items.map((item, index) => (
        <QuoteItemCard
          key={item.key}
          item={item}
          position={index + 1}
          isFirst={index === 0}
          isLast={index === draft.items.length - 1}
          itemError={editor.errors[`item:${item.key}`]}
          optionErrors={editor.errors}
          onChange={(patch) => editor.updateItem(item.key, patch)}
          onTierChange={(optionKey, tier, patch) =>
            editor.setTier(item.key, optionKey, tier, patch)
          }
          onOptionChange={(optionKey, change) => editor.updateOption(item.key, optionKey, change)}
          onRecommend={(optionKey) => editor.recommend(item.key, optionKey)}
          onRemoveOption={(optionKey) => editor.removeOption(item.key, optionKey)}
          onAddFabric={() => onPanel({ kind: 'fabric', itemKey: item.key })}
          onEditComposition={() => onPanel({ kind: 'custom', itemKey: item.key })}
          onChangePhoto={() => onPanel({ kind: 'photo', itemKey: item.key })}
          onShowChanges={() => onPanel({ kind: 'changes', itemKey: item.key })}
          onMove={(offset) => editor.moveItem(item.key, offset)}
          onRemove={() => editor.removeItem(item.key)}
          fabricFacts={fabricFacts}
          onOpenSupplier={onOpenSupplier}
        />
      ))}
      <Box id={quoteAddItemsAnchor} sx={{ scrollMarginTop: 96 }}>
        <QuoteAddItems
          empty={draft.items.length === 0}
          onAddProduct={() => onPanel({ kind: 'catalog' })}
          onAddOneOff={() => editor.addItems([oneOffItemDraft()])}
          onAddCustom={() => onPanel({ kind: 'custom' })}
          onAddEmbroidery={() => onPanel({ kind: 'embroidery' })}
        />
      </Box>
      <QuoteNotesCard
        clientComment={draft.clientComment}
        managerNote={draft.managerNote}
        onChange={editor.change}
      />
    </>
  );
}
