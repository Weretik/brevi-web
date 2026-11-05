import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Stack, TextField, Typography } from '@mui/material';

import type { AiModelValues } from '../hooks/use-ai-settings';
import type { AiSettingsErrors } from '@admin/ai/model';

interface Props {
  values: AiModelValues;
  errors: AiSettingsErrors;
  saving: boolean;
  onChange: (values: AiModelValues) => void;
  onClose: () => void;
  onSave: () => void;
}

const tiers = [
  {
    title: 'Основна модель',
    hint: 'Читає кожен рахунок. Дешева.',
    model: 'fastModel' as const,
    input: 'fastInputPrice' as const,
    output: 'fastOutputPrice' as const,
  },
  {
    title: 'Сильна модель',
    hint: 'Лише повтор, коли суми не зійшлися.',
    model: 'strongModel' as const,
    input: 'strongInputPrice' as const,
    output: 'strongOutputPrice' as const,
  },
];

/** Models and their prices in the «Цех» side panel; changed rarely. */
export function AiModelsDrawer({ values, errors, saving, onChange, onClose, onSave }: Props) {
  const set = (field: keyof AiModelValues, value: string) =>
    onChange({ ...values, [field]: value });
  return (
    <ReferenceEditorDrawer
      titleId="ai-models-drawer-title"
      title="Моделі й ціни"
      description="Ціни з сайту OpenAI, $ за 1 млн токенів. За ними рахуються витрати і ліміт."
      formId="ai-models-form"
      paperWidth={520}
      readOnly={false}
      saving={saving}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={onSave}
    >
      <Stack sx={{ gap: 3 }}>
        {tiers.map((row) => (
          <Stack key={row.model} sx={{ gap: 1.5 }}>
            <Typography variant="subtitle2">
              {row.title}{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                {row.hint}
              </Typography>
            </Typography>
            <TextField
              label={`${row.title}: назва`}
              size="small"
              value={values[row.model]}
              error={Boolean(errors[row.model])}
              helperText={errors[row.model]}
              disabled={saving}
              onChange={(event) => set(row.model, event.target.value)}
            />
            <Stack direction="row" sx={{ gap: 1 }}>
              <TextField
                label="Вхід, $"
                size="small"
                inputMode="decimal"
                value={values[row.input]}
                error={Boolean(errors[row.input])}
                helperText={errors[row.input]}
                disabled={saving}
                onChange={(event) => set(row.input, event.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Вихід, $"
                size="small"
                inputMode="decimal"
                value={values[row.output]}
                error={Boolean(errors[row.output])}
                helperText={errors[row.output]}
                disabled={saving}
                onChange={(event) => set(row.output, event.target.value)}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
