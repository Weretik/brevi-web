import {
  hasManualPrice,
  isFixedPriceKind,
  isSewingKind,
  quoteTierLabels,
  quoteTiers,
} from '@admin/quotes/model';
import { Alert, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';

import { QuoteManualPriceReason } from './quote-manual-price-reason';
import { QuoteOptionRow } from './quote-option-row';
import { QuoteRemoveLastFabricDialog } from '../../../../dialogs/editor/quote-remove-last-fabric-dialog';

import type {
  QuoteFabricFacts,
  QuoteItemDraft,
  QuoteOptionDraft,
  QuoteTier,
} from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  /** Item name for screen readers. */
  itemName: string;
  optionErrors: Readonly<Record<string, string>>;
  onTierChange: (
    optionKey: string,
    tier: QuoteTier,
    patch: { shown?: boolean; manual?: string },
  ) => void;
  onReasonChange: (optionKey: string, reason: string) => void;
  onRecommend: (optionKey: string) => void;
  onRemoveOption: (optionKey: string) => void;
  /** Removing the last fabric removes the whole item, after a confirmation. */
  onRemoveItem: () => void;
  fabricFacts: ReadonlyMap<number, QuoteFabricFacts>;
  onOpenSupplier?: (facts: QuoteFabricFacts) => void;
}

const firstColumn = (item: QuoteItemDraft) =>
  item.kind === 'Sewing'
    ? 'Варіант тканини'
    : item.kind === 'CustomSewing'
      ? 'Тканина'
      : item.kind === 'Embroidery'
        ? 'Рівень ціни'
        : 'Ціна';

/** The price rows of one item: a row per fabric (one row for a PPE), a column per quantity tier. */
export function QuoteItemPrices({
  item,
  itemName,
  optionErrors,
  onTierChange,
  onReasonChange,
  onRecommend,
  onRemoveOption,
  onRemoveItem,
  fabricFacts,
  onOpenSupplier,
}: Props) {
  const [confirmLast, setConfirmLast] = useState(false);
  const sewing = isSewingKind(item.kind);
  const fixed = isFixedPriceKind(item.kind);
  const embroidery = item.kind === 'Embroidery';
  const tierHidden = (tier: QuoteTier) => item.options.every((o) => !o.prices[tier].shown);
  const rowLabel = (option: QuoteOptionDraft) => `${itemName}, ${option.title}`;
  const removable = item.kind === 'Sewing' || item.kind === 'CustomSewing';
  const remove = (option: QuoteOptionDraft) =>
    item.options.length > 1 ? onRemoveOption(option.key) : setConfirmLast(true);
  const manualRows = item.options.filter((option) => item.kind === 'Ppe' && hasManualPrice(option));
  return (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label={`Ціни: ${itemName}`}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40%' }}>{firstColumn(item)}</TableCell>
              {quoteTiers.map((tier) => (
                <TableCell
                  key={tier}
                  align="right"
                  sx={{
                    color: tierHidden(tier) ? 'text.disabled' : undefined,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {quoteTierLabels[tier]}
                  {tierHidden(tier) ? ' · не в КП' : ''}
                </TableCell>
              ))}
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {item.options.map((option) => (
              <QuoteOptionRow
                key={option.key}
                option={option}
                sewing={sewing}
                embroidery={embroidery}
                editable={!fixed}
                removable={removable}
                label={rowLabel(option)}
                fabricFacts={fabricFacts}
                onOpenSupplier={onOpenSupplier}
                onRecommend={() => onRecommend(option.key)}
                onTierChange={(tier, patch) => onTierChange(option.key, tier, patch)}
                onRemove={() => remove(option)}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
      {manualRows.map((option) => (
        <QuoteManualPriceReason
          key={option.key}
          option={option}
          onChange={(reason) => onReasonChange(option.key, reason)}
        />
      ))}
      <QuoteRemoveLastFabricDialog
        open={confirmLast}
        itemName={itemName}
        onCancel={() => setConfirmLast(false)}
        onConfirm={() => {
          setConfirmLast(false);
          onRemoveItem();
        }}
      />
      {item.options.map((option) =>
        optionErrors[`option:${option.key}`] ? (
          <Alert key={option.key} severity="warning" sx={{ mx: 2, mt: 1 }}>
            {optionErrors[`option:${option.key}`]}
          </Alert>
        ) : null,
      )}
    </Box>
  );
}
