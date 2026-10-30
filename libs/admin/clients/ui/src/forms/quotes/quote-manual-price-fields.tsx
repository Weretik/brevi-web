import { Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material';

import type { QuotePriceSelection } from '@admin/clients/model';

const labels = { retail: 'Роздріб', wholesale: 'Опт', largeWholesale: 'Великий опт' } as const;
export function QuoteManualPriceFields({
  selection,
  disabled,
  onChange,
}: {
  selection: QuotePriceSelection;
  disabled: boolean;
  onChange: (selection: QuotePriceSelection) => void;
}) {
  if (selection.kind === 'sewing' || selection.kind === 'customSewing') return null;
  if (selection.kind === 'ppe')
    return (
      <Stack spacing={2}>
        <FormControlLabel
          label="Ручна зміна ціни СІЗ"
          control={
            <Checkbox
              checked={!!selection.override}
              disabled={disabled}
              onChange={(_, checked) =>
                onChange({
                  ...selection,
                  override: checked ? { tier: 'retail', amount: 0, reason: '' } : undefined,
                })
              }
            />
          }
        />
        {selection.override && (
          <>
            <TextField
              select
              label="Рівень ручної ціни"
              disabled={disabled}
              value={selection.override.tier}
              onChange={(event) =>
                onChange({
                  ...selection,
                  override: {
                    ...selection.override!,
                    tier: event.target.value as 'retail' | 'wholesale' | 'largeWholesale',
                  },
                })
              }
            >
              {Object.entries(labels).map(([code, label]) => (
                <MenuItem key={code} value={code}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Ручна ціна, грн"
              type="number"
              value={selection.override.amount || ''}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...selection,
                  override: { ...selection.override!, amount: Number(event.target.value) },
                })
              }
              slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
            />
            <TextField
              label="Причина зміни ціни"
              required
              value={selection.override.reason}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...selection,
                  override: { ...selection.override!, reason: event.target.value },
                })
              }
            />
          </>
        )}
      </Stack>
    );
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {(['retail', 'wholesale', 'largeWholesale'] as const).map((tier) => (
          <TextField
            key={tier}
            label={`${labels[tier]}, грн`}
            type="number"
            required
            value={selection.prices[tier] || ''}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...selection,
                prices: { ...selection.prices, [tier]: Number(event.target.value) },
              })
            }
            slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
          />
        ))}
      </Stack>
      <TextField
        label="Підстава ручних цін"
        required
        value={selection.prices.reason}
        disabled={disabled}
        onChange={(event) =>
          onChange({ ...selection, prices: { ...selection.prices, reason: event.target.value } })
        }
      />
    </Stack>
  );
}
