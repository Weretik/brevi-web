import { formatQuotePrice, quoteTierLabels } from '@admin/quotes/model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import type { QuotePriceDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  tier: QuoteTier;
  price: QuotePriceDraft;
  /** PPE and one-off PPE: the price can be typed; a sewing price only comes from the Catalog. */
  editable: boolean;
  /** Row name for screen readers, «Рукавиці, Ціна»; the tier is added here. */
  label: string;
  onShownChange: (shown: boolean) => void;
  onManualChange: (manual: string) => void;
}

/** One of the three quantity prices with its «показати в КП» switch. */
export function QuotePriceBox({
  tier,
  price,
  editable,
  label,
  onShownChange,
  onManualChange,
}: Props) {
  const name = `${label}, ${quoteTierLabels[tier]}`;
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        p: 1,
        minWidth: 0,
        opacity: price.shown ? 1 : 0.6,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {quoteTierLabels[tier]}
      </Typography>
      {editable ? (
        <TextField
          size="small"
          fullWidth
          value={price.manual}
          placeholder={price.source === null ? '0,00' : formatQuotePrice(price.source)}
          onChange={(event) => onManualChange(event.target.value)}
          slotProps={{
            htmlInput: { inputMode: 'decimal', 'aria-label': `Ціна: ${name}` },
            input: { endAdornment: <InputAdornment position="end">₴</InputAdornment> },
          }}
          sx={{ mt: 0.5, '& input': { fontFamily: 'var(--admin-font-mono)', textAlign: 'right' } }}
        />
      ) : (
        <Typography
          sx={{
            fontFamily: 'var(--admin-font-mono)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 16,
            mt: 0.5,
          }}
        >
          {formatQuotePrice(price.source)}
        </Typography>
      )}
      <FormControlLabel
        sx={{ mt: 0.5, mr: 0 }}
        control={
          <Checkbox
            size="small"
            checked={price.shown}
            onChange={(event) => onShownChange(event.target.checked)}
            slotProps={{ input: { 'aria-label': `Показати в КП: ${name}` } }}
          />
        }
        label={<Typography variant="caption">показати в КП</Typography>}
      />
    </Box>
  );
}
