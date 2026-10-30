import { QuoteProductionActions } from '@admin/clients/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { useQuoteProduction } from '../../../hooks/documents/production/use-quote-production';

import type { QuoteDetail } from '@admin/clients/model';

export function QuoteProductionPanel({
  detail,
  disabled,
  onLock,
}: {
  detail: QuoteDetail;
  disabled: boolean;
  onLock: (pending: boolean, uncertain: boolean) => void;
}) {
  const state = useQuoteProduction(detail, disabled, onLock);
  return (
    <Stack spacing={2} component="section" aria-label="Виробничий пакет КП">
      <Typography variant="h6">Виробничий пакет</Typography>
      {state.action.forbidden ? (
        <Alert severity="error">Доступ до КП втрачено. Оновіть список.</Alert>
      ) : (
        <>
          <QuoteProductionActions
            choices={state.choices}
            selected={state.selection}
            artifact={state.artifact}
            locked={state.locked}
            canExport={state.canExport}
            versionNumber={detail.versionNumber}
            onSelect={state.select}
            onExport={state.exportZip}
            onDownload={state.download}
          />
          {state.action.error && <Alert severity="error">{state.action.error}</Alert>}
          {state.action.uncertain && (
            <Button
              type="button"
              disabled={state.action.pending}
              onClick={() => void state.action.execute()}
            >
              Повторити той самий запит
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}
