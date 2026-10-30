import { Alert, Button, Stack, Typography } from '@mui/material';

export function IntroductionSelectionReview({
  serverApprovedForCurrentSelection,
  blockers,
  disabled,
  checking,
  applying,
  onCheck,
  onApply,
}: {
  serverApprovedForCurrentSelection: boolean;
  blockers: readonly string[];
  disabled: boolean;
  checking: boolean;
  applying: boolean;
  onCheck: () => void;
  onApply: () => void;
}) {
  return (
    <Stack spacing={2} aria-label="Перевірка добірки">
      <Typography variant="h6">Перевірка добірки</Typography>
      <Typography variant="body2">
        Сервер перевірить сезон, різні моделі, головну позицію, тканину, метадані, посилання та
        велику гуртову ціну. Добірка не надсилається автоматично.
      </Typography>
      {blockers.map((message, index) => (
        <Alert severity="error" key={index}>
          {message}
        </Alert>
      ))}
      {serverApprovedForCurrentSelection && blockers.length === 0 && (
        <Alert severity="success">Поточну добірку перевірено сервером.</Alert>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button type="button" disabled={disabled || checking || applying} onClick={onCheck}>
          {checking ? 'Перевіряємо…' : 'Перевірити добірку'}
        </Button>
        <Button
          type="button"
          variant="contained"
          disabled={
            disabled ||
            checking ||
            applying ||
            !serverApprovedForCurrentSelection ||
            blockers.length > 0
          }
          onClick={onApply}
        >
          {applying ? 'Створюємо чернетку…' : 'Застосувати як нову чернетку'}
        </Button>
      </Stack>
      <Typography variant="caption">
        Для нової чернетки сервер бере поточні схвалені ціни. Раніше виданий PDF залишається
        незмінним.
      </Typography>
    </Stack>
  );
}
