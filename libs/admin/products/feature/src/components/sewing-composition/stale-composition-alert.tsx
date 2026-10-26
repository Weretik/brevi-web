import { Alert, Button } from '@mui/material';

export function StaleCompositionAlert({
  scope,
  message,
  onReload,
}: {
  scope: 'Model' | 'Article';
  message: string | null;
  onReload: () => void;
}) {
  return (
    <Alert
      severity="warning"
      action={<Button onClick={onReload}>Завантажити актуальну версію</Button>}
    >
      {message ??
        (scope === 'Article'
          ? 'Склад змінився на сервері. Чернетку збережено; завантажте актуальну версію лише якщо готові відкинути свої зміни.'
          : 'Спільний склад змінився на сервері. Чернетку збережено; завантажте актуальну версію лише якщо готові відкинути свої зміни.')}
    </Alert>
  );
}
