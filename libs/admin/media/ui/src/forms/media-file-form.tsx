import { MEDIA_ALT_MAX_LENGTH, MEDIA_FILE_NAME_MAX_LENGTH } from '@admin/media/model';
import { Stack, TextField } from '@mui/material';

import { MediaFolderSelect } from './media-folder-select';

import type { MediaFileDraft, MediaFileDraftErrors, MediaFolderOption } from '@admin/media/model';

interface Props {
  draft: MediaFileDraft;
  errors: MediaFileDraftErrors;
  folderOptions: readonly MediaFolderOption[];
  disabled: boolean;
  onChange: (draft: MediaFileDraft) => void;
}

export function MediaFileForm({ draft, errors, folderOptions, disabled, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2.5 }}>
      <TextField
        autoFocus
        required
        fullWidth
        label="Назва фото"
        value={draft.fileName}
        disabled={disabled}
        error={Boolean(errors.fileName)}
        helperText={errors.fileName ?? 'За нею фото шукають у бібліотеці.'}
        onChange={(event) => onChange({ ...draft, fileName: event.target.value })}
        slotProps={{ htmlInput: { maxLength: MEDIA_FILE_NAME_MAX_LENGTH } }}
      />
      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Опис для сайту (alt)"
        value={draft.alt}
        disabled={disabled}
        error={Boolean(errors.alt)}
        helperText={
          errors.alt ?? 'Що зображено на фото. Його читають пошуковики і програми для незрячих.'
        }
        onChange={(event) => onChange({ ...draft, alt: event.target.value })}
        slotProps={{ htmlInput: { maxLength: MEDIA_ALT_MAX_LENGTH } }}
      />
      <MediaFolderSelect
        label="Папка"
        value={draft.folderId}
        options={folderOptions}
        emptyLabel="Без папки"
        disabled={disabled}
        onChange={(folderId) => onChange({ ...draft, folderId })}
      />
    </Stack>
  );
}
