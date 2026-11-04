import {
  MediaDropOverlay,
  MediaFolderSelect,
  MediaFolderTree,
  MediaToastStack,
  MediaUploadStatus,
} from '@admin/media/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, InputAdornment, Stack, TextField } from '@mui/material';

import { useFileDrop } from '../../hooks/files/use-file-drop';
import { useMediaPicker } from '../../hooks/picker/use-media-picker';
import { MediaFileResults } from '../library/media-file-results';
import { MediaUploadButton } from '../library/media-upload-button';

import type { MediaFile } from '@admin/media/model';

interface Props {
  /** Photos the product already has: shown ticked and not added twice. */
  alreadyAddedIds: readonly number[];
  onClose: () => void;
  onPick: (files: MediaFile[]) => void;
}

/**
 * «Вибрати фото»: the photo library in a side panel. Staff browse folders, search by name, tick photos on
 * several pages or upload new ones into the open folder, then add them all at once.
 */
export function MediaPickerDrawer({ alreadyAddedIds, onClose, onPick }: Props) {
  const picker = useMediaPicker(alreadyAddedIds);
  const drop = useFileDrop((files) => void picker.uploadFiles(files));
  const { state, folders, search, upload } = picker;
  const count = picker.chosen.length;

  return (
    <ReferenceEditorDrawer
      titleId="media-picker-title"
      title="Вибрати фото"
      description="Позначте фото в будь-яких папках або завантажте нові. Уже додані фото позначені."
      formId="media-picker-form"
      paperWidth={1040}
      readOnly={false}
      saving={upload.active}
      saveDisabled={count === 0}
      submitLabel={count > 0 ? `Додати (${count})` : 'Додати'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => {
        if (count > 0) onPick(picker.chosen);
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          type="search"
          placeholder="Пошук за назвою фото"
          value={state.search}
          onChange={(event) => picker.setSearch(event.target.value)}
          slotProps={{
            htmlInput: { 'aria-label': 'Пошук фото' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <MediaUploadButton
          disabled={upload.active}
          onFiles={(files) => void picker.uploadFiles(files)}
        />
      </Stack>
      <MediaUploadStatus total={upload.total} done={upload.done} active={upload.active} />
      {folders.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {folders.error}
        </Alert>
      )}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
        <MediaFolderSelect
          label="Папка"
          value={state.folderId}
          options={folders.options}
          emptyLabel="Усі фото"
          onChange={picker.setFolder}
        />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr' }, gap: 2 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <MediaFolderTree
            tree={folders.tree}
            selectedId={state.folderId}
            expandedIds={folders.expandedIds}
            totalCount={search.libraryTotal}
            onSelect={picker.setFolder}
            onToggle={folders.toggle}
          />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <MediaFileResults
            search={search}
            page={state.page}
            selectedIds={picker.selectedIds}
            emptyText={
              search.searching
                ? 'Нічого не знайдено. Змініть пошук або папку.'
                : 'Тут ще немає фото. Перетягніть фото сюди або натисніть «Завантажити фото».'
            }
            folderLabel={(file) =>
              state.folderId === null && file.folderId !== null
                ? folders.pathOf(file.folderId)
                : null
            }
            onOpen={picker.toggle}
            onToggleSelected={picker.toggle}
            onPageChange={picker.setPage}
          />
        </Box>
      </Box>
      <MediaDropOverlay open={drop.dragging} target={picker.place} />
      <MediaToastStack toasts={picker.toasts.toasts} onClose={picker.toasts.close} />
    </ReferenceEditorDrawer>
  );
}
