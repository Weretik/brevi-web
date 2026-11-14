import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Button, Card, Stack } from '@mui/material';

import { QuoteItemDescription } from './card/quote-item-description';
import { QuoteItemFooter } from './card/quote-item-footer';
import { QuoteItemTitle } from './card/quote-item-title';
import { QuoteItemMenu } from './quote-item-menu';
import { QuoteItemPhoto } from './quote-item-photo';
import { QuoteItemPrices } from './quote-item-prices';

import type {
  QuoteFabricFacts,
  QuoteItemDraft,
  QuoteOptionDraft,
  QuoteTier,
} from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  itemError: string | undefined;
  optionErrors: Readonly<Record<string, string>>;
  onChange: (patch: Partial<QuoteItemDraft>) => void;
  onTierChange: (
    optionKey: string,
    tier: QuoteTier,
    patch: { shown?: boolean; manual?: string },
  ) => void;
  onOptionChange: (
    optionKey: string,
    change: (option: QuoteOptionDraft) => QuoteOptionDraft,
  ) => void;
  onRecommend: (optionKey: string) => void;
  onRemoveOption: (optionKey: string) => void;
  onAddFabric: () => void;
  /** «Змінити склад» of a «Виріб з нуля» or a Catalog model. */
  onEditComposition: () => void;
  /** «Змінити фото»: another photo of the item's product (CAT-018). */
  onChangePhoto?: () => void;
  /** «Що змінено» of a changed Catalog model: its differences from the Catalog composition. */
  onShowChanges?: () => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
  /** Current Reference fabrics for the manager line under each fabric (R-31). */
  fabricFacts: ReadonlyMap<number, QuoteFabricFacts>;
  /** Opens the card of a fabric's supplier (R-32). */
  onOpenSupplier?: (facts: QuoteFabricFacts) => void;
}

/** The anchor the «Перед надсиланням» links scroll to. */
export const quoteItemAnchor = (key: string) => `quote-item-${key}`;

/** A compact КП item: header, the price table and the description, always open for editing. */
export function QuoteItemCard({
  item,
  position,
  isFirst,
  isLast,
  itemError,
  optionErrors,
  onChange,
  onTierChange,
  onOptionChange,
  onRecommend,
  onRemoveOption,
  onAddFabric,
  onEditComposition,
  onChangePhoto,
  onShowChanges,
  onMove,
  onRemove,
  fabricFacts,
  onOpenSupplier,
}: Props) {
  const oneOff = item.kind === 'OneOffPpe';
  const custom = item.kind === 'CustomSewing';
  const label = oneOff ? item.name || 'Разова позиція' : item.name;
  return (
    <Card
      variant="outlined"
      id={quoteItemAnchor(item.key)}
      aria-label={`Позиція ${position}: ${label}`}
      sx={{ scrollMarginTop: 96, borderColor: itemError ? 'warning.main' : undefined }}
    >
      <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start', p: 2, pb: 1.5 }}>
        <QuoteItemPhoto photoUrl={item.photoUrl} label={label} onChange={onChangePhoto} />
        <QuoteItemTitle
          item={item}
          position={position}
          onChange={onChange}
          onShowChanges={onShowChanges}
        />
        {(item.kind === 'Sewing' || custom) && (
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={onEditComposition}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Змінити склад
          </Button>
        )}
        <QuoteItemMenu
          label={label}
          onChangePhoto={onChangePhoto}
          isFirst={isFirst}
          isLast={isLast}
          onMove={onMove}
          onRemove={onRemove}
        />
      </Stack>

      <QuoteItemPrices
        item={item}
        itemName={label}
        optionErrors={optionErrors}
        onTierChange={onTierChange}
        onReasonChange={(optionKey, reason) =>
          onOptionChange(optionKey, (current) => ({ ...current, manualReason: reason }))
        }
        onRecommend={onRecommend}
        onRemoveOption={onRemoveOption}
        onRemoveItem={onRemove}
        fabricFacts={fabricFacts}
        onOpenSupplier={onOpenSupplier}
      />

      <QuoteItemDescription item={item} onChange={onChange} />
      <QuoteItemFooter
        item={item}
        onChange={onChange}
        onAddFabric={onAddFabric}
        onEditComposition={onEditComposition}
      />
      {itemError && (
        <Alert severity="warning" sx={{ m: 2, mt: 0 }}>
          {itemError}
        </Alert>
      )}
    </Card>
  );
}
