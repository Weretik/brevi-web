import { useGetCustomFilesQuery } from '@admin/clients/data-access';
import { Alert, MenuItem, Stack, TextField } from '@mui/material';

import type { CustomApplication } from '@admin/clients/model';

export function CustomArtworkPicker({
  id,
  rows,
  disabled,
  onChange,
}: {
  id: string;
  rows: readonly CustomApplication[];
  disabled: boolean;
  onChange: (rows: readonly CustomApplication[]) => void;
}) {
  const files = useGetCustomFilesQuery({ id });
  if (!rows.length) return null;
  if (files.error)
    return <Alert severity="warning">Макети недоступні. Перевірте список приватних файлів.</Alert>;
  return (
    <Stack spacing={2}>
      {rows.map((row, index) => (
        <TextField
          key={index}
          select
          label={`Макет нанесення ${index + 1}`}
          value={row.artworkFileId ?? ''}
          disabled={disabled || files.isFetching || !files.currentData}
          onChange={(event) =>
            onChange(
              rows.map((value, position) =>
                position === index
                  ? { ...value, artworkFileId: event.target.value || null }
                  : value,
              ),
            )
          }
        >
          <MenuItem value="">Без макета</MenuItem>
          {row.artworkFileId &&
            !files.currentData?.some((file) => file.id === row.artworkFileId) && (
              <MenuItem value={row.artworkFileId}>
                Збережений макет недоступний — оберіть інший
              </MenuItem>
            )}
          {files.currentData?.map((file) => (
            <MenuItem key={file.id} value={file.id}>
              {file.contentType} · {file.id}
            </MenuItem>
          ))}
        </TextField>
      ))}
    </Stack>
  );
}
