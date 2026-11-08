import {
  hasManualPrice,
  isFixedPriceKind,
  isSewingKind,
  quoteTierLabels,
  quoteTiers,
} from '@admin/quotes/model';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import {
  Alert,
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { QuoteFabricLine } from './quote-fabric-line';
import { QuotePriceCell } from './quote-price-cell';
import { QuoteRemoveLastFabricDialog } from './quote-remove-last-fabric-dialog';

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
              <TableRow key={option.key}>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Stack direction="row" sx={{ gap: 0.5, alignItems: 'flex-start' }}>
                    {sewing && (
                      <IconButton
                        size="small"
                        aria-pressed={option.isRecommended}
                        aria-label={
                          option.isRecommended
                            ? `Не рекомендувати: ${rowLabel(option)}`
                            : `Рекомендувати клієнту: ${rowLabel(option)}`
                        }
                        title={option.isRecommended ? 'Не рекомендувати' : 'Рекомендувати клієнту'}
                        onClick={() => onRecommend(option.key)}
                        sx={{
                          ml: -0.75,
                          mt: -0.25,
                          flexShrink: 0,
                          color: option.isRecommended ? 'primary.dark' : 'text.disabled',
                        }}
                      >
                        {option.isRecommended ? (
                          <StarOutlinedIcon fontSize="small" />
                        ) : (
                          <StarBorderOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                        {sewing || embroidery ? option.title : 'За одиницю'}
                      </Typography>
                      {option.isRecommended && (
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ color: 'primary.dark', fontWeight: 600, ml: 0.75 }}
                        >
                          рекомендуємо
                        </Typography>
                      )}
                      {sewing && (
                        <QuoteFabricLine
                          option={option}
                          fabricFacts={fabricFacts}
                          onOpenSupplier={onOpenSupplier}
                        />
                      )}
                      {!sewing && option.details && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {option.details}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>
                {quoteTiers.map((tier) => (
                  <TableCell key={tier} align="right" sx={{ verticalAlign: 'top' }}>
                    <QuotePriceCell
                      tier={tier}
                      price={option.prices[tier]}
                      editable={!fixed}
                      label={rowLabel(option)}
                      onManualChange={(manual) => onTierChange(option.key, tier, { manual })}
                      onShownChange={(shown) => onTierChange(option.key, tier, { shown })}
                    />
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                  {removable && (
                    <Tooltip title="Прибрати тканину">
                      <IconButton
                        size="small"
                        aria-label={`Прибрати тканину: ${rowLabel(option)}`}
                        onClick={() => remove(option)}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {manualRows.map((option) => {
        const missing = !option.manualReason.trim();
        return (
          <Box
            key={option.key}
            sx={{ px: 2, py: 1.5, bgcolor: missing ? 'warning.light' : 'action.hover' }}
          >
            <TextField
              size="small"
              fullWidth
              required
              label="Причина ручної ціни"
              placeholder="Напр.: знижка за обсяг від 500 пар"
              value={option.manualReason}
              onChange={(event) => onReasonChange(option.key, event.target.value)}
              helperText={
                option.manualBy ? `Ручну ціну встановив(-ла): ${option.manualBy}` : undefined
              }
              slotProps={{ htmlInput: { maxLength: 500 } }}
              sx={{ bgcolor: 'background.paper' }}
            />
          </Box>
        );
      })}
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
