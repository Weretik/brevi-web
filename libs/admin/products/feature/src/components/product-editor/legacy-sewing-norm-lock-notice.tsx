import { Alert, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  locked: boolean;
  loading: boolean;
  message?: string;
  error?: string | null;
  productId?: number;
  onRetry?: () => void;
}

export function LegacySewingNormLockNotice({
  locked,
  loading,
  message,
  error,
  productId,
  onRetry,
}: Props) {
  if (!locked || !message) return null;
  return (
    <Alert
      severity={error ? 'error' : loading ? 'info' : 'warning'}
      action={
        <Stack direction="row" sx={{ gap: 1 }}>
          {error && onRetry && <Button onClick={onRetry}>Повторити перевірку</Button>}
          {productId && (
            <Button component={Link} to={`/references/products/${productId}`}>
              До артикулів і складу
            </Button>
          )}
        </Stack>
      }
      sx={{ mb: 2 }}
    >
      {message}
    </Alert>
  );
}
