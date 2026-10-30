import { useGetCustomTemplateQuery } from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { CustomTemplateActions } from './custom-template-actions';

import type { CustomDetail, CustomTemplateDetail } from '@admin/clients/model';

/** Retain the action owner and captured request while background reads change. */
export function CustomTemplateSelection({
  id,
  detail,
  disabled,
  onApplied,
  onBusy,
  onAccessLost,
}: {
  id: string;
  detail: CustomDetail | null;
  disabled: boolean;
  onApplied: (draft: CustomDetail) => void;
  onBusy: (busy: boolean) => void;
  onAccessLost?: () => void;
}) {
  const query = useGetCustomTemplateQuery({ id }, { skip: false });
  const [snapshot, setSnapshot] = useState<CustomTemplateDetail | null>(null);
  const [busy, setBusy] = useState(false);
  const denied = isAdminApiError(query.error) && [401, 403, 404].includes(query.error.status);
  const state = useCallback(
    (value: boolean) => {
      setBusy(value);
      onBusy(value);
    },
    [onBusy],
  );
  useEffect(() => {
    if (!busy && !query.error && !query.isFetching && query.currentData)
      setSnapshot(query.currentData);
  }, [busy, query.error, query.isFetching, query.currentData]);
  useEffect(() => {
    if (denied) onAccessLost?.();
  }, [denied, onAccessLost]);
  if (denied) return <Alert severity="error">Шаблон не знайдено або доступ обмежено.</Alert>;
  return (
    <Stack spacing={2}>
      {query.error && (
        <Alert
          severity="error"
          action={
            <Button disabled={disabled || busy} onClick={() => void query.refetch()}>
              Оновити шаблон
            </Button>
          }
        >
          Не вдалося оновити шаблон. Поточний запит і введення збережено.
        </Alert>
      )}
      {query.isFetching && <Typography role="status">Завантаження шаблону…</Typography>}
      {snapshot && (
        <CustomTemplateActions
          key={`${snapshot.id}:${snapshot.revision}`}
          value={snapshot}
          detail={detail}
          disabled={disabled || !!query.isFetching || !!query.error}
          onApplied={onApplied}
          onBusy={state}
          onAccessLost={onAccessLost}
          onRefresh={() => void query.refetch()}
        />
      )}
    </Stack>
  );
}
