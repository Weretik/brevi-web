import {
  useGetCustomSewingVersionsQuery,
  useGetCustomSewingVersionQuery,
} from '@admin/clients/data-access';
import { Alert, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { CustomFilesPanel } from '../../custom-files/custom-files-panel';

import type { CustomDetail, CustomVersion } from '@admin/clients/model';

export function CustomVersionPicker({
  id,
  disabled,
  onPin,
  detail,
  onAccessLost,
}: {
  id: string;
  disabled: boolean;
  onPin?: (version: CustomVersion) => void;
  detail?: CustomDetail;
  onAccessLost?: () => void;
}) {
  const [page, setPage] = useState(1);
  const versions = useGetCustomSewingVersionsQuery({ id, page });
  const [selected, setSelected] = useState('');
  const version = useGetCustomSewingVersionQuery({ id, versionId: selected }, { skip: !selected });
  const failed = !!versions.error || !!version.error;
  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="subtitle1">
        Збережені версії
      </Typography>
      {versions.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void versions.refetch()}>Повторити</Button>}
        >
          Версії недоступні або доступ обмежено.
        </Alert>
      )}
      {!versions.isFetching && !versions.error && !versions.currentData?.rows.length && (
        <Typography>Версій ще немає. Розрахуйте конфігурацію та збережіть версію.</Typography>
      )}
      {!failed && !!versions.currentData?.rows.length && (
        <TextField
          select
          label="Незмінна версія пошиття"
          value={selected}
          disabled={disabled || versions.isFetching}
          onChange={(event) => setSelected(event.target.value)}
        >
          <MenuItem value="">Оберіть версію</MenuItem>
          {selected && !versions.currentData.rows.some((row) => row.id === selected) && (
            <MenuItem value={selected}>Вибрана збережена версія</MenuItem>
          )}
          {versions.currentData.rows.map((row) => (
            <MenuItem key={row.id} value={row.id}>
              №{row.number} · {row.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {!failed && (versions.currentData?.totalPages ?? 0) > 1 && (
        <Stack direction="row" spacing={1}>
          <Button
            disabled={disabled || page <= 1 || versions.isFetching}
            onClick={() => setPage(page - 1)}
          >
            Попередні версії
          </Button>
          <Typography>Сторінка {page}</Typography>
          <Button
            disabled={
              disabled || page >= (versions.currentData?.totalPages ?? 0) || versions.isFetching
            }
            onClick={() => setPage(page + 1)}
          >
            Наступні версії
          </Button>
        </Stack>
      )}
      {version.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void version.refetch()}>Повторити читання версії</Button>}
        >
          Не вдалося прочитати вибрану версію.
        </Alert>
      )}
      {!failed && version.currentData && (
        <Typography>
          Склад: {version.currentData.configuration.name}. Великий опт:{' '}
          {version.currentData.basis.largeWholesale?.toLocaleString('uk-UA')} грн. Ціна зафіксована
          у версії.
        </Typography>
      )}
      {onPin && !failed && (
        <Button
          variant="contained"
          disabled={disabled || !version.currentData || version.isFetching || !!version.error}
          onClick={() => {
            if (version.currentData) onPin(version.currentData);
          }}
        >
          Використати версію в КП
        </Button>
      )}
      {detail && selected && !failed && version.currentData && !version.isFetching && (
        <CustomFilesPanel
          key={`${id}:${selected}`}
          detail={{ ...detail, canEdit: false }}
          versionId={selected}
          disabled={disabled}
          onAccepted={() => undefined}
          onAccessLost={onAccessLost}
        />
      )}
    </Stack>
  );
}
