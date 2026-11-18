import { ReferenceBulkDeleteButton } from '@admin/references/ui';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { Button } from '@mui/material';

import { MediaUploadButton } from './media-upload-button';

import type { MediaLibraryPageState } from '../../hooks/library/use-media-library-page';

/** Header buttons of «Фото»: delete and move the chosen photos, upload new ones. */
export function MediaLibraryActions({ page }: { page: MediaLibraryPageState }) {
  const { selectedIds, fileDeletion, canEdit, canCreate, move, state, upload, uploadFiles } = page;
  return (
    <>
      <ReferenceBulkDeleteButton
        selectedCount={selectedIds.length}
        disabled={fileDeletion.deleting}
        onDelete={() => fileDeletion.request(selectedIds)}
      />
      {canEdit && selectedIds.length > 0 && (
        <Button
          variant="outlined"
          startIcon={<DriveFileMoveOutlinedIcon />}
          onClick={() => move.open(selectedIds, state.folderId)}
        >
          Перемістити
        </Button>
      )}
      {canCreate && (
        <MediaUploadButton disabled={upload.active} onFiles={(files) => void uploadFiles(files)} />
      )}
    </>
  );
}
