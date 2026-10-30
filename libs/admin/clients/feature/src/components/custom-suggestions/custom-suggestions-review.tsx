import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import type { CustomSuggestions } from '@admin/clients/model';

export function CustomSuggestionsReview({
  suggestions,
  stale,
  disabled,
  onCancel,
  onConfirm,
}: {
  suggestions: CustomSuggestions;
  stale: boolean;
  disabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Перевірте запропоновані норми</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="warning">
            Буде створено нову конфігурацію із запропонованою фурнітурою та операціями. Поточна
            конфігурація залишиться без змін. Тканини й інші введені дані будуть скопійовані; макети
            нанесень потрібно завантажити та погодити продаж повторно. Ціни потрібно розрахувати
            окремо на сервері.
          </Alert>
          <Typography>
            Вибірка: {suggestions.sampleSize} моделей. {suggestions.productType},{' '}
            {suggestions.season === 'summer' ? 'літо' : 'зима'}.
          </Typography>
          {suggestions.norms.map((row) => (
            <Typography key={`${row.kind}:${row.referenceId}`}>
              {row.kind === 'accessory' ? 'Фурнітура' : 'Операція'} #{row.referenceId}:{' '}
              {row.quantity} {row.unit}; діапазон {row.minimumQuantity}–{row.maximumQuantity}; у{' '}
              {row.sampleSize} моделях.
              {row.manualMinutes !== null && ` Явний час: ${row.manualMinutes} хв.`}
              {row.varyingNorm && ' Норма відрізняється між моделями.'}
            </Typography>
          ))}
          {stale && (
            <Alert severity="error">
              Конфігурацію змінено. Закрийте перегляд та оберіть підказки повторно.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button variant="contained" disabled={disabled || stale} onClick={onConfirm}>
          Створити нову конфігурацію за підказками
        </Button>
      </DialogActions>
    </Dialog>
  );
}
