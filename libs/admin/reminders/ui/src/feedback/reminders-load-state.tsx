import { Alert, Box, Button, CircularProgress } from '@mui/material';

interface Props {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyText: string;
  loadingLabel: string;
  onRetry: () => void;
}

/** Loading, error with «Повторити», and empty states for one server-data area. */
export function RemindersLoadState({
  loading,
  error,
  empty,
  emptyText,
  loadingLabel,
  onRetry,
}: Props) {
  if (loading)
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress aria-label={loadingLabel} />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" action={<Button onClick={onRetry}>Повторити</Button>}>
        {error}
      </Alert>
    );
  if (empty) return <Alert severity="info">{emptyText}</Alert>;
  return null;
}
