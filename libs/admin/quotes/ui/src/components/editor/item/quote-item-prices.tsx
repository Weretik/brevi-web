import { hasManualPrice, isSewingKind, quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import {
  Alert,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { QuoteOptionMenu } from './quote-option-menu';
import { QuotePriceCell } from './quote-price-cell';

import type { QuoteItemDraft, QuoteOptionDraft, QuoteTier } from '@admin/quotes/model';

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
}

const firstColumn = (item: QuoteItemDraft) =>
  item.kind === 'Sewing' ? 'Варіант тканини' : item.kind === 'CustomSewing' ? 'Тканина' : 'Ціна';

/** The price rows of one item: a row per fabric (one row for a PPE), a column per quantity tier. */
export function QuoteItemPrices({
  item,
  itemName,
  optionErrors,
  onTierChange,
  onReasonChange,
  onRecommend,
  onRemoveOption,
}: Props) {
  const sewing = isSewingKind(item.kind);
  const tierHidden = (tier: QuoteTier) => item.options.every((o) => !o.prices[tier].shown);
  const rowLabel = (option: QuoteOptionDraft) => `${itemName}, ${option.title}`;
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
                <TableCell>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {sewing ? option.title : 'За одиницю'}
                    </Typography>
                    {option.isRecommended && (
                      <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        ★ рекомендуємо
                      </Typography>
                    )}
                  </Stack>
                  {(option.details || option.fabricInfo) && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {[option.details, option.fabricInfo].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                </TableCell>
                {quoteTiers.map((tier) => (
                  <TableCell key={tier} align="right">
                    <QuotePriceCell
                      tier={tier}
                      price={option.prices[tier]}
                      editable={!sewing}
                      label={rowLabel(option)}
                      onManualChange={(manual) => onTierChange(option.key, tier, { manual })}
                    />
                  </TableCell>
                ))}
                <TableCell align="right">
                  <QuoteOptionMenu
                    option={option}
                    label={rowLabel(option)}
                    canRecommend={item.kind === 'Sewing'}
                    canRemove={item.kind === 'Sewing' && item.options.length > 1}
                    onShownChange={(tier, shown) => onTierChange(option.key, tier, { shown })}
                    onRecommend={() => onRecommend(option.key)}
                    onRemove={() => onRemoveOption(option.key)}
                  />
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
