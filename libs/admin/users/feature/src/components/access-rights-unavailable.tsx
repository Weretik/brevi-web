import { Alert, Box, Button, CircularProgress } from '@mui/material';

import { isForbiddenError } from '../errors/access-error-message';

interface Props {
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}

/** Before the rights load: a spinner, «only the administrator», or a retry. */
export function AccessRightsUnavailable({ isError, error, onRetry }: Props) {
  return isError ? (
    isForbiddenError(error) ? (
      <Alert severity="warning">Лише адміністратор може керувати правами доступу.</Alert>
    ) : (
      <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити права доступу.
      </Alert>
    )
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress aria-label="Завантаження прав доступу" />
    </Box>
  );
}
