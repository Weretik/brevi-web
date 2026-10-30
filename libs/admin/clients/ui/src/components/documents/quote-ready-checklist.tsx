import { Alert, Button, Stack, Typography } from '@mui/material';

import { quoteReadyBlocker } from '@admin/clients/model';

import type { IssuerAvailability, QuoteDetail } from '@admin/clients/model';

const blockerText = {
  archived: 'КП в архіві. Спочатку відновіть його.',
  'already-issued': 'Поточну версію вже підготовлено. Для нового КП збережіть нову чернетку.',
  'unsaved-changes': 'Спочатку збережіть зміни як нову версію.',
  'settings-loading': 'Перевіряємо активні реквізити продавця.',
  'settings-missing': 'Адміністратор має активувати реквізити продавця та шаблон документа.',
  'settings-error': 'Не вдалося перевірити активні реквізити. Оновіть дані.',
} as const;

export function QuoteReadyChecklist({
  quote,
  issuer,
  hasUnsavedChanges,
  disabled,
  busy,
  error,
  onPrepare,
}: {
  quote: QuoteDetail;
  issuer: IssuerAvailability;
  hasUnsavedChanges: boolean;
  disabled: boolean;
  busy: boolean;
  error: string | null;
  onPrepare: () => void;
}) {
  const blocker = quoteReadyBlocker(quote, issuer, hasUnsavedChanges);
  return (
    <Stack spacing={2} aria-label="Підготовка КП">
      <Typography variant="h6">Готовність КП</Typography>
      <Typography variant="body2">
        Сервер перевірить одержувача, ціни видимих варіантів, реквізити й логотип. Після успішної
        перевірки він присвоїть номер і закріпить цю версію.
      </Typography>
      {blocker && <Alert severity="info">{blockerText[blocker]}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {quote.state === 'ready' && quote.number && (
        <Alert severity="success">Версія готова. Номер КП: {quote.number}</Alert>
      )}
      <Button
        type="button"
        variant="contained"
        disabled={disabled || busy || blocker !== null}
        onClick={onPrepare}
      >
        {busy ? 'Підготовка КП…' : 'Підготувати КП'}
      </Button>
    </Stack>
  );
}
