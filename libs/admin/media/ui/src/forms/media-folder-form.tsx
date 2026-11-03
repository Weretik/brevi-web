import { MEDIA_FOLDER_NAME_MAX_LENGTH } from '@admin/media/model';
import { Stack, TextField } from '@mui/material';

import { MediaFolderSelect } from './media-folder-select';

import type { MediaFolderDraft, MediaFolderOption } from '@admin/media/model';

interface Props {
  draft: MediaFolderDraft;
  parentOptions: readonly MediaFolderOption[];
  nameError: string | null;
  parentError: string | null;
  disabled: boolean;
  onChange: (draft: MediaFolderDraft) => void;
}

export function MediaFolderForm({
  draft,
  parentOptions,
  nameError,
  parentError,
  disabled,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2.5 }}>
      <TextField
        autoFocus
        required
        fullWidth
        label="Назва папки"
        value={draft.name}
        disabled={disabled}
        error={Boolean(nameError)}
        helperText={nameError ?? 'Без символів / і \\.'}
        onChange={(event) => onChange({ ...draft, name: event.target.value })}
        slotProps={{ htmlInput: { maxLength: MEDIA_FOLDER_NAME_MAX_LENGTH } }}
      />
      <MediaFolderSelect
        label="Де лежить"
        value={draft.parentId}
        options={parentOptions}
        emptyLabel="Верхній рівень"
        error={parentError}
        disabled={disabled}
        onChange={(parentId) => onChange({ ...draft, parentId })}
      />
    </Stack>
  );
}
