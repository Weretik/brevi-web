import { ReferenceFormSection } from '@admin/references/ui';
import {
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  ListItemText,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import { ppeMarkupPercent } from '../../components/ppe-card/ppe-markup-format';

import type { PpeCreateFieldsProps } from './ppe-create-fields-props';
import type { PpeCardRule } from '../../components/ppe-card/ppe-card-prices';

export interface PpeCreateRuleOption extends PpeCardRule {
  name: string;
}

interface Props extends PpeCreateFieldsProps {
  rules: readonly PpeCreateRuleOption[];
}

const markups = (rule: PpeCreateRuleOption) =>
  [
    `роздріб ${ppeMarkupPercent(rule.retailMarkup)}`,
    `опт ${ppeMarkupPercent(rule.wholesaleMarkup)}`,
    `великий опт ${ppeMarkupPercent(rule.largeWholesaleMarkup)}`,
  ].join(' · ');

/** Block 3 «Ціна»: supplier price and the markup rule the three prices come from. */
export function PpeCreatePriceFields({ values, errors, disabled, onChange, rules }: Props) {
  return (
    <ReferenceFormSection title="Ціна">
      <TextField
        label="Ціна постачальника, ₴"
        required
        value={values.supplierPrice}
        onChange={(event) => onChange('supplierPrice', event.target.value)}
        error={Boolean(errors.supplierPrice)}
        helperText={errors.supplierPrice ?? 'До 2 знаків після коми.'}
        disabled={disabled}
        fullWidth
        slotProps={{
          htmlInput: { inputMode: 'decimal', sx: { fontFamily: 'var(--admin-font-mono)' } },
          input: { endAdornment: <InputAdornment position="end">₴</InputAdornment> },
        }}
      />
      <TextField
        select
        label="Правило націнки"
        required
        value={values.ruleCode}
        onChange={(event) => onChange('ruleCode', event.target.value)}
        error={Boolean(errors.ruleCode)}
        helperText={errors.ruleCode ?? 'Правила редагуються в «Параметри ціноутворення».'}
        disabled={disabled}
        fullWidth
        slotProps={{ select: { renderValue: (value) => (value === '' ? '—' : String(value)) } }}
      >
        <MenuItem value="">—</MenuItem>
        {rules.map((rule) => (
          <MenuItem key={rule.name} value={rule.name}>
            <ListItemText primary={rule.name} secondary={markups(rule)} />
          </MenuItem>
        ))}
      </TextField>
      <Stack>
        <FormControlLabel
          control={
            <Switch
              checked={values.allowManualPrice}
              onChange={(event) => onChange('allowManualPrice', event.target.checked)}
              disabled={disabled}
            />
          }
          label="Дозволити ручну ціну"
        />
        <FormHelperText sx={{ mt: 0 }}>
          Автооновлення від постачальника не змінює ціну. Вмикайте, тільки якщо ціну постачальника
          вводите вручну.
        </FormHelperText>
      </Stack>
    </ReferenceFormSection>
  );
}
