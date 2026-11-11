import { ProductionItemForm } from '@admin/production/ui';
import {
  Alert,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useEmbroideryPicker } from '../../hooks/orders/use-embroidery-picker';
import { useProductionColors } from '../../hooks/orders/use-production-colors';

import type {
  CreateOrderLine,
  ProductionItemErrors,
  ProductionQuoteDraftItem,
  ProductionQuoteDraftOption,
} from '@admin/production/model';

interface Props {
  item: ProductionQuoteDraftItem;
  line: CreateOrderLine;
  errors: (ProductionItemErrors & { optionId?: string }) | undefined;
  disabled: boolean;
  onChange: (line: CreateOrderLine) => void;
}

const optionLabel = (option: ProductionQuoteDraftOption) =>
  [option.title, option.fabricCode, option.fabricName].filter(Boolean).join(' · ');

/** A КП item: whether it goes to the workshop, in which fabric, and what the workshop needs. */
export function ProductionOrderCreateLine({ item, line, errors, disabled, onChange }: Props) {
  const embroidery = useEmbroideryPicker();
  const colors = useProductionColors();
  const id = `quote-item-${item.quoteItemId}`;
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack sx={{ gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={line.include}
              disabled={disabled}
              onChange={(event) => onChange({ ...line, include: event.target.checked })}
            />
          }
          label={
            <Typography sx={{ fontWeight: 600 }}>
              {item.modelCode ? `${item.modelCode} · ${item.name}` : item.name}
            </Typography>
          }
        />
        {line.include && (
          <>
            {item.options.length === 0 ? (
              <Alert severity="warning">
                У КП немає тканини для цієї позиції. Додайте її в КП або зніміть позицію.
              </Alert>
            ) : (
              <TextField
                id={`${id}-option`}
                select
                label="Тканина"
                required
                disabled={disabled}
                value={line.optionId ?? ''}
                error={Boolean(errors?.optionId)}
                helperText={errors?.optionId}
                onChange={(event) =>
                  onChange({ ...line, optionId: Number(event.target.value) || null })
                }
              >
                {item.options.map((option) => (
                  <MenuItem key={option.optionId} value={option.optionId}>
                    {optionLabel(option)}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {!item.norm && (
              <Alert severity="warning">
                Для моделі немає норми тканини, тож план тканини не порахується.
              </Alert>
            )}
            <ProductionItemForm
              idPrefix={id}
              values={line.values}
              errors={errors ?? {}}
              norm={item.norm}
              withRate={false}
              disabled={disabled}
              colors={colors}
              embroidery={embroidery}
              onChange={(values) => onChange({ ...line, values })}
            />
          </>
        )}
      </Stack>
    </Paper>
  );
}
