import { financeAttachmentLimits, formatFileSize } from '@admin/accounting/model';
import { usePageRights } from '@admin/shared/ui';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useRef } from 'react';

import type { FinanceAttachment } from '@admin/accounting/model';

interface Props {
  files: FinanceAttachment[];
  loading: boolean;
  /** A failed load, upload, open or delete, in the server's words. */
  error: string | null;
  busy: boolean;
  /** Null hides «Додати файл» and «Видалити» (a voided operation). */
  onAdd: ((files: File[]) => void) | null;
  onOpen: (file: FinanceAttachment) => void;
  onDelete: ((file: FinanceAttachment) => void) | null;
}

const dayFormat = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Kyiv',
});

/** «Файли» of an operation: open in a new tab, add PDF/JPG/PNG up to 10 МБ, delete. */
export function FinanceAttachmentList({
  files,
  loading,
  error,
  busy,
  onAdd: addFiles,
  onOpen,
  onDelete: deleteFile,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const rights = usePageRights();
  // «Права доступу» → «Бухгалтерія»: adding a file is «Створення», removing one «Видалення».
  const onAdd = rights.canCreate ? addFiles : null;
  const onDelete = rights.canDelete ? deleteFile : null;
  return (
    <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
      {error && (
        <Alert severity="error" sx={{ alignSelf: 'stretch' }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress size={20} aria-label="Завантаження файлів" />
      ) : files.length ? (
        <List dense disablePadding aria-label="Файли операції" sx={{ alignSelf: 'stretch' }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              disableGutters
              secondaryAction={
                onDelete && (
                  <IconButton
                    edge="end"
                    size="small"
                    disabled={busy}
                    aria-label={`Видалити файл ${file.fileName}`}
                    onClick={() => onDelete(file)}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    sx={{ textAlign: 'left', wordBreak: 'break-word' }}
                    onClick={() => onOpen(file)}
                  >
                    {file.fileName}
                  </Link>
                }
                secondary={`${formatFileSize(file.sizeBytes)} · ${dayFormat.format(new Date(file.createdAt))}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        !error && (
          <Typography variant="body2" color="text.secondary">
            Файлів немає.
          </Typography>
        )
      )}
      {onAdd && (
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={busy ? <CircularProgress size={16} /> : <AttachFileIcon />}
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            Додати файл
          </Button>
          <Typography variant="caption" color="text.secondary">
            PDF, JPG або PNG до 10 МБ
          </Typography>
          <input
            ref={input}
            type="file"
            hidden
            multiple
            accept={financeAttachmentLimits.accept}
            aria-label="Додати файли до операції"
            onChange={(event) => {
              const picked = Array.from(event.target.files ?? []);
              event.target.value = '';
              if (picked.length) onAdd(picked);
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}
