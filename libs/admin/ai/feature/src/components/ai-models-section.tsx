import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { Button, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';

import type { AiModelTier, AiSettingsErrors, AiSettingsFormValues } from '@admin/ai/model';

interface Props {
  values: AiSettingsFormValues;
  errors: AiSettingsErrors;
  hasKey: boolean;
  disabled: boolean;
  testingTier: AiModelTier | null;
  canTest: boolean;
  onChange: (values: AiSettingsFormValues) => void;
  onTest: (tier: AiModelTier) => void;
}

const tiers = [
  {
    tier: 'Fast' as const,
    title: 'Основна модель',
    hint: 'Читає кожен рахунок. Дешева.',
    model: 'fastModel' as const,
    input: 'fastInputPrice' as const,
    output: 'fastOutputPrice' as const,
  },
  {
    tier: 'Strong' as const,
    title: 'Сильна модель',
    hint: 'Лише повтор, коли суми не зійшлися.',
    model: 'strongModel' as const,
    input: 'strongInputPrice' as const,
    output: 'strongOutputPrice' as const,
  },
];

/** On/off, two models with prices per 1M tokens, the monthly limit. */
export function AiModelsSection({
  values,
  errors,
  hasKey,
  disabled,
  testingTier,
  canTest,
  onChange,
  onTest,
}: Props) {
  const set = (field: keyof AiSettingsFormValues, value: string | boolean) =>
    onChange({ ...values, [field]: value });

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack>
        <FormControlLabel
          control={
            <Switch
              checked={values.enabled}
              disabled={disabled || (!hasKey && !values.enabled)}
              onChange={(event) => set('enabled', event.target.checked)}
            />
          }
          label="ШІ увімкнено"
        />
        {errors.enabled && (
          <Typography variant="caption" color="error">
            {errors.enabled}
          </Typography>
        )}
      </Stack>
      {tiers.map((row) => (
        <Stack key={row.tier} sx={{ gap: 1 }}>
          <Typography variant="subtitle2">
            {row.title}{' '}
            <Typography component="span" variant="caption" color="text.secondary">
              {row.hint}
            </Typography>
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ gap: 1, alignItems: { sm: 'flex-start' } }}
          >
            <TextField
              label="Модель"
              size="small"
              value={values[row.model]}
              error={Boolean(errors[row.model])}
              helperText={errors[row.model]}
              disabled={disabled}
              onChange={(event) => set(row.model, event.target.value)}
              sx={{ flex: 2 }}
            />
            <TextField
              label="Вхід, $ за 1 млн"
              size="small"
              inputMode="decimal"
              value={values[row.input]}
              error={Boolean(errors[row.input])}
              helperText={errors[row.input]}
              disabled={disabled}
              onChange={(event) => set(row.input, event.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Вихід, $ за 1 млн"
              size="small"
              inputMode="decimal"
              value={values[row.output]}
              error={Boolean(errors[row.output])}
              helperText={errors[row.output]}
              disabled={disabled}
              onChange={(event) => set(row.output, event.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<FactCheckOutlinedIcon />}
              disabled={disabled || !canTest}
              onClick={() => onTest(row.tier)}
            >
              {testingTier === row.tier ? 'Перевірка…' : 'Перевірити'}
            </Button>
          </Stack>
        </Stack>
      ))}
      <TextField
        label="Ліміт на місяць, $"
        size="small"
        inputMode="decimal"
        value={values.monthlyLimitUsd}
        error={Boolean(errors.monthlyLimitUsd)}
        helperText={
          errors.monthlyLimitUsd ??
          'Коли витрати місяця дійдуть до ліміту, ШІ зупиниться до наступного місяця.'
        }
        disabled={disabled}
        onChange={(event) => set('monthlyLimitUsd', event.target.value)}
        sx={{ maxWidth: 260 }}
      />
    </Stack>
  );
}
