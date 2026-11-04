import { reportPriceTierLabels } from '@admin/production/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Box, MenuItem, Paper, TextField } from '@mui/material';

import type {
  CreateOrderFormValues,
  ProductionOrderHeaderErrors,
  ReportPriceTier,
} from '@admin/production/model';

interface Props {
  values: CreateOrderFormValues;
  errors: ProductionOrderHeaderErrors;
  disabled: boolean;
  onChange: (values: CreateOrderFormValues) => void;
}

const tiers = Object.keys(reportPriceTierLabels) as ReportPriceTier[];

/** Client, date, which КП price goes to reports, and a comment of the new order. */
export function ProductionOrderCreateHeader({ values, errors, disabled, onChange }: Props) {
  const header = values.header;
  const setHeader = (next: Partial<typeof header>) =>
    onChange({ ...values, header: { ...header, ...next } });
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <ReferenceFormSection title="Завдання">
        <Box
          sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}
        >
          <TextField
            label="Клієнт"
            required
            value={header.clientName}
            error={Boolean(errors.clientName)}
            helperText={errors.clientName}
            disabled={disabled}
            onChange={(event) => setHeader({ clientName: event.target.value })}
          />
          <TextField
            label="Дата створення"
            type="date"
            required
            value={header.orderDate}
            error={Boolean(errors.orderDate)}
            helperText={errors.orderDate}
            disabled={disabled}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(event) => setHeader({ orderDate: event.target.value })}
          />
          <TextField
            select
            label="Ціна для звіту"
            value={values.priceTier}
            disabled={disabled}
            helperText="Яку ціну КП брати у звіти"
            onChange={(event) =>
              onChange({ ...values, priceTier: event.target.value as ReportPriceTier })
            }
          >
            {tiers.map((tier) => (
              <MenuItem key={tier} value={tier}>
                {reportPriceTierLabels[tier]}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <TextField
          label="Коментар"
          multiline
          minRows={2}
          value={header.comment}
          disabled={disabled}
          onChange={(event) => setHeader({ comment: event.target.value })}
        />
      </ReferenceFormSection>
    </Paper>
  );
}
