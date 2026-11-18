import { Box, TextField } from '@mui/material';

import type { QuoteOptionDraft } from '@admin/quotes/model';

interface Props {
  option: QuoteOptionDraft;
  onChange: (reason: string) => void;
}

/** «Причина ручної ціни» under a PPE with a manual price; highlighted while empty. */
export function QuoteManualPriceReason({ option, onChange }: Props) {
  const missing = !option.manualReason.trim();
  return (
    <Box sx={{ px: 2, py: 1.5, bgcolor: missing ? 'warning.light' : 'action.hover' }}>
      <TextField
        size="small"
        fullWidth
        required
        label="Причина ручної ціни"
        placeholder="Напр.: знижка за обсяг від 500 пар"
        value={option.manualReason}
        onChange={(event) => onChange(event.target.value)}
        helperText={option.manualBy ? `Ручну ціну встановив(-ла): ${option.manualBy}` : undefined}
        slotProps={{ htmlInput: { maxLength: 500 } }}
        sx={{ bgcolor: 'background.paper' }}
      />
    </Box>
  );
}
