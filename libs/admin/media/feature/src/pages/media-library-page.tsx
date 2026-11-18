import { MediaDropOverlay, MediaToastStack, MediaUploadStatus } from '@admin/media/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import { Box } from '@mui/material';

import { MediaFileDrawer } from '../components/files/media-file-drawer';
import { MediaMoveDrawer } from '../components/files/media-move-drawer';
import { MediaFolderDrawer } from '../components/folders/media-folder-drawer';
import { MediaFolderPanel } from '../components/library/media-folder-panel';
import { MediaLibraryActions } from '../components/library/media-library-actions';
import { MediaLibraryFiles } from '../components/library/media-library-files';
import { MediaDeleteDialogs } from '../dialogs/media-delete-dialogs';
import { useMediaLibraryPage } from '../hooks/library/use-media-library-page';

export function MediaLibraryPage() {
  const page = useMediaLibraryPage();
  const { state, toasts, folders, search, upload, fileEditor, move, fileDeletion } = page;
  const { folderEditor, folderDeletion, place, drop, navigate, onFolderAction, copyUrl } = page;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, minWidth: 0 }}>
      <ReferencePageHeader
        overline="Дані"
        title="Фото"
        subtitle={place}
        actions={<MediaLibraryActions page={page} />}
      />
      <MediaUploadStatus total={upload.total} done={upload.done} active={upload.active} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '300px minmax(0, 1fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <MediaFolderPanel
          folders={folders}
          selectedId={state.folderId}
          libraryTotal={search.libraryTotal}
          onSelect={(folderId) => navigate({ folderId })}
          onCreate={() => folderEditor.create(state.folderId)}
          onAction={onFolderAction}
        />

        <MediaLibraryFiles page={page} />
      </Box>

      <MediaFileDrawer
        editor={fileEditor}
        folderOptions={folders.options}
        pathOf={folders.pathOf}
        onCopyUrl={(url) => void copyUrl(url)}
      />
      <MediaMoveDrawer move={move} folderOptions={folders.options} />
      <MediaFolderDrawer editor={folderEditor} />
      <MediaDeleteDialogs files={fileDeletion} folder={folderDeletion} />
      <MediaDropOverlay open={drop.dragging} target={place} />
      <MediaToastStack toasts={toasts.toasts} onClose={toasts.close} />
    </Box>
  );
}

export default MediaLibraryPage;
