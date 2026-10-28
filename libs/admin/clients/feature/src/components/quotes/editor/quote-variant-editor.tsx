import { changeQuoteSelection } from '@admin/clients/model';
import { QuoteManualPriceFields, QuotePrices } from '@admin/clients/ui';
import { Alert, Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from '@mui/material';

import { QuoteCatalogPicker } from '../selection/quote-catalog-picker';

import type { QuoteVariantDraft } from '@admin/clients/model';

export function QuoteVariantEditor({
  variant,
  disabled,
  now,
  onChange,
  onPreview,
  onMove,
  onRemove,
}: {
  variant: QuoteVariantDraft;
  disabled: boolean;
  now: number;
  onChange: (variant: QuoteVariantDraft) => void;
  onPreview: () => void;
  onMove: (step: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{ p: 2 }}
      aria-label={`Варіант ${variant.title}`}
    >
      <Stack spacing={2}>
        <TextField
          label="Назва варіанта"
          required
          disabled={disabled}
          value={variant.title}
          onChange={(event) => onChange({ ...variant, title: event.target.value })}
        />
        <QuoteCatalogPicker
          selection={variant.selection}
          disabled={disabled}
          onChange={(selection) => onChange(changeQuoteSelection(variant, selection))}
        />
        <QuoteManualPriceFields
          selection={variant.selection}
          disabled={disabled}
          onChange={(selection) => onChange(changeQuoteSelection(variant, selection))}
        />
        <QuotePrices
          variant={variant}
          disabled={disabled}
          now={now}
          onChange={(tierVisibility) => onChange({ ...variant, tierVisibility })}
        />
        <FormControlLabel
          label="Показати варіант клієнту"
          control={
            <Checkbox
              disabled={disabled}
              checked={variant.visible}
              onChange={(_, visible) => onChange({ ...variant, visible })}
            />
          }
        />
        {!variant.visible && <Alert severity="info">Варіант приховано від клієнта.</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          {variant.basis?.origin !== 'saved' && (
            <Button disabled={disabled} onClick={onPreview}>
              {variant.basis ? 'Оновити попередній розрахунок' : 'Розрахувати вибір'}
            </Button>
          )}
          <Button disabled={disabled} onClick={() => onMove(-1)}>
            Варіант вище
          </Button>
          <Button disabled={disabled} onClick={() => onMove(1)}>
            Варіант нижче
          </Button>
          <Button color="error" disabled={disabled} onClick={onRemove}>
            Видалити варіант
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
