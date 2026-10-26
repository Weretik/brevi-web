import { Alert, Button, CircularProgress } from '@mui/material';

interface Props {
  listError: string | null;
  lookupError: string | null;
  modelError: string | null;
  selectedError: string | null;
  loading: boolean;
  scope: 'Model' | 'Article';
  onRetryList: () => void;
  onRetryLookups: () => void;
  onRetryModel: () => void;
  onRetrySelected: () => void;
}

export function CompositionStatusPanels({
  listError,
  lookupError,
  modelError,
  selectedError,
  loading,
  scope,
  onRetryList,
  onRetryLookups,
  onRetryModel,
  onRetrySelected,
}: Props) {
  return (
    <>
      {listError && (
        <Alert severity="error" action={<Button onClick={onRetryList}>Повторити</Button>}>
          {listError}
        </Alert>
      )}
      {lookupError && (
        <Alert severity="error" action={<Button onClick={onRetryLookups}>Повторити</Button>}>
          {lookupError}
        </Alert>
      )}
      {modelError && (
        <Alert severity="error" action={<Button onClick={onRetryModel}>Повторити</Button>}>
          {modelError}
        </Alert>
      )}
      {scope === 'Article' && selectedError && (
        <Alert severity="error" action={<Button onClick={onRetrySelected}>Повторити</Button>}>
          {selectedError}
        </Alert>
      )}
      {loading && <CircularProgress aria-label="Завантаження складу, артикулів і довідників" />}
    </>
  );
}
