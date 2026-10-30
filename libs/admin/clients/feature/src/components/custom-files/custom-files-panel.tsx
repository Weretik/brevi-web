import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

import { CustomFileRow } from './custom-file-row';
import { CustomFileUpload } from './custom-file-upload';
import { CustomFilesDiscard } from './custom-files-discard';
import { useCustomFiles } from '../../hooks/custom-files/use-custom-files';
import { usePrivateFileDownload } from '../../hooks/custom-files/use-private-file-download';

import type { CustomDetail } from '@admin/clients/model';

export function CustomFilesPanel({
  detail,
  disabled,
  onAccepted,
  onState,
  onAccessLost,
  versionId,
  quoteId,
}: {
  detail: CustomDetail;
  disabled: boolean;
  onAccepted: (detail: CustomDetail) => void;
  onState?: (dirty: boolean, locked: boolean) => void;
  onAccessLost?: () => void;
  versionId?: string;
  quoteId?: string;
}) {
  const files = useCustomFiles({ detail, disabled, versionId, quoteId, onAccepted, onAccessLost });
  const content = usePrivateFileDownload(files.deny);
  useEffect(() => {
    onState?.(files.dirty, files.locked);
  }, [files.dirty, files.locked, onState]);
  const failed = !!files.query.error || files.forbidden;
  const blocked = disabled || files.locked || files.query.isFetching || failed;
  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="h6">
        Приватні файли
      </Typography>
      <Alert severity="info">
        Файли доступні за правами доступу. Ознаки КП та виробництва незалежні; зміни чернетки не
        змінюють файли збережених версій.
      </Alert>
      {files.query.isFetching && (
        <CircularProgress aria-label="Завантаження списку файлів" size={24} />
      )}
      {failed && (
        <Alert
          severity="error"
          action={
            !files.forbidden && (
              <Button onClick={() => void files.query.refetch()}>Повторити список файлів</Button>
            )
          }
        >
          Файли недоступні або доступ обмежено.
        </Alert>
      )}
      {files.error && <Alert severity="error">{files.error}</Alert>}
      {content.error && <Alert severity="error">{content.error}</Alert>}
      {files.uncertain && (
        <Alert
          severity="warning"
          action={
            <Button disabled={files.pending} onClick={() => void files.retry()}>
              Повторити той самий запит
            </Button>
          }
        >
          Результат {files.retryKind === 'upload' ? 'завантаження' : 'збереження прив’язок'}{' '}
          невідомий. Зміни заблоковано до уточнення.
        </Alert>
      )}
      {!failed && !files.query.isFetching && files.rows.length === 0 && (
        <Typography>Прикріплених файлів ще немає.</Typography>
      )}
      {!failed && (
        <Stack component="ul" spacing={1} sx={{ p: 0, m: 0 }}>
          {files.rows.map((file) => (
            <CustomFileRow
              key={file.id}
              file={file}
              disabled={blocked}
              readOnly={files.readOnly}
              downloadDisabled={content.pending || files.pending}
              onChange={(flags) => files.change(file.id, flags)}
              onRemove={() => files.remove(file.id)}
              onDownload={() => void content.download(file.id, versionId, quoteId)}
            />
          ))}
        </Stack>
      )}
      {!files.readOnly && !failed && (
        <>
          <CustomFileUpload
            disabled={blocked || files.rows.length >= 30}
            onUpload={(file) => void files.stage(file)}
          />
          <Button
            variant="outlined"
            disabled={blocked || !files.dirty}
            onClick={() => void files.save()}
          >
            Зберегти прив’язки файлів
          </Button>
          <CustomFilesDiscard disabled={blocked || !files.dirty} onDiscard={files.discard} />
        </>
      )}
    </Stack>
  );
}
