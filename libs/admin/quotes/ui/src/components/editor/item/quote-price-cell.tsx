import {
  formatQuotePrice,
  parseQuotePrice,
  priceInputText,
  quoteTierLabels,
} from '@admin/quotes/model';
import { Box, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';

import type { QuotePriceDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  tier: QuoteTier;
  price: QuotePriceDraft;
  /** PPE and one-off PPE: the price can be typed; a sewing price only comes from the Catalog. */
  editable: boolean;
  /** Row name for screen readers, «Рукавиці, Ціна»; the tier is added here. */
  label: string;
  onManualChange: (manual: string) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One quantity price in the item table; a price hidden from the client is grey. */
export function QuotePriceCell({ tier, price, editable, label, onManualChange }: Props) {
  const name = `${label}, ${quoteTierLabels[tier]}`;
  const typed = price.manual.trim();
  const manual = typed !== '' && parseQuotePrice(typed) !== price.source;
  const hiddenHint = price.shown ? '' : 'Не показується в КП';

  if (!editable)
    return (
      <Tooltip title={hiddenHint}>
        <Typography
          component="span"
          sx={{ ...mono, color: price.shown ? 'text.primary' : 'text.disabled' }}
        >
          {formatQuotePrice(price.source)}
        </Typography>
      </Tooltip>
    );

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <TextField
        size="small"
        value={price.manual}
        placeholder={price.source === null ? '0,00' : priceInputText(price.source)}
        onChange={(event) => onManualChange(event.target.value)}
        slotProps={{
          htmlInput: { inputMode: 'decimal', 'aria-label': `Ціна: ${name}` },
          input: {
            startAdornment: manual ? (
              <InputAdornment position="start">
                <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                  вручну
                </Typography>
              </InputAdornment>
            ) : undefined,
            endAdornment: <InputAdornment position="end">₴</InputAdornment>,
          },
        }}
        sx={{
          width: 150,
          opacity: price.shown ? 1 : 0.6,
          '& input': { ...mono, textAlign: 'right' },
          ...(manual && { '& .MuiOutlinedInput-root': { bgcolor: 'primary.light' } }),
        }}
      />
      {manual && price.source !== null && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ...mono, textDecoration: 'line-through' }}
          aria-label={`Ціна каталогу: ${formatQuotePrice(price.source)}`}
        >
          {formatQuotePrice(price.source)}
        </Typography>
      )}
    </Box>
  );
}
