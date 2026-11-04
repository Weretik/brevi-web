import { Alert, Button, CircularProgress } from '@mui/material';

import type { SewingModel } from '../../hooks/sewing-model/use-sewing-model';

interface Props {
  model: SewingModel;
  label: string;
}

/** Loading spinner or error of the model data; null when the tab can render. */
export function SewingModelState({ model, label }: Props) {
  if (model.error)
    return (
      <Alert severity="error" action={<Button onClick={model.retry}>Повторити</Button>}>
        {model.error}
      </Alert>
    );
  if (model.loading) return <CircularProgress aria-label={label} />;
  return null;
}
