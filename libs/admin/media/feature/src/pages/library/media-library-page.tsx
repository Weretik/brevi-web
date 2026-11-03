import { MediaUploadStatus } from '@admin/media/ui';
import {
  ReferenceBulkDeleteButton,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';

import { MediaFileDrawer } from '../../components/files/media-file-drawer';
import { MediaMoveDrawer } from '../../components/files/media-move-drawer';
import { MediaFolderDrawer } from '../../components/folders/media-folder-drawer';
import { MediaFileResults } from '../../components/library/media-file-results';
import { MediaFolderPanel } from '../../components/library/media-folder-panel';
import { MediaLibraryFilters } from '../../components/library/media-library-filters';
import { MediaUploadButton } from '../../components/library/media-upload-button';
import { MediaDeleteDialogs } from '../../dialogs/media-delete-dialogs';
import { useMediaFileDeletion } from '../../hooks/files/use-media-file-deletion';
import { useMediaFileEditor } from '../../hooks/files/use-media-file-editor';
import { useMediaMove } from '../../hooks/files/use-media-move';
import { useMediaUploadQueue } from '../../hooks/files/use-media-upload-queue';
import { useMediaFolderDeletion } from '../../hooks/folders/use-media-folder-deletion';
import { useMediaFolderEditor } from '../../hooks/folders/use-media-folder-editor';
import { useMediaFolders } from '../../hooks/folders/use-media-folders';
import { useMediaFileSearch } from '../../hooks/library/use-media-file-search';
import { useMediaSelection } from '../../hooks/library/use-media-selection';
import { useMediaLibraryUrlState } from '../../state/media-library-url-state';

import type { MediaFolderNode } from '@admin/media/model';
import type { MediaFolderAction } from '@admin/media/ui';

export function MediaLibraryPage() {
  const { state, update } = useMediaLibraryUrlState();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const folders = useMediaFolders(state.folderId);
  const search = useMediaFileSearch(state);
  const selection = useMediaSelection();
  const upload = useMediaUploadQueue();
  const fileEditor = useMediaFileEditor(setActionMessage);
  const move = useMediaMove((message) => {
    selection.clear();
    setActionMessage(message);
  });
  const fileDeletion = useMediaFileDeletion((message) => {
    selection.clear();
    setActionMessage(message);
  });
  const folderEditor = useMediaFolderEditor(folders.tree, (folder, message) => {
    setActionMessage(message);
    navigate({ folderId: folder.id });
  });
  const folderDeletion = useMediaFolderDeletion((node, message) => {
    setActionMessage(message);
    if (state.folderId === node.folder.id) navigate({ folderId: node.folder.parentId });
  });

  const selectedNode = folders.selectedNode;
  const unknownFolder = state.folderId !== null && !folders.loading && !selectedNode;
  const folderTotal = selectedNode
    ? state.includeSubfolders
      ? selectedNode.totalCount
      : selectedNode.folder.fileCount
    : (search.libraryTotal ?? search.total);

  // A page past the end (after deleting the last photos) goes back to the last page.
  const lastPage = search.loading ? null : search.pageCount;
  useEffect(() => {
    if (lastPage !== null && state.page > lastPage) update({ page: lastPage });
  }, [lastPage, state.page, update]);

  function navigate(patch: Parameters<typeof update>[0]) {
    selection.clear();
    update(patch);
  }

  function onFolderAction(action: MediaFolderAction, node: MediaFolderNode) {
    if (action === 'add-child') folderEditor.create(node.folder.id);
    else if (action === 'edit') folderEditor.edit(node);
    else if (node.totalCount > 0 || node.children.length > 0)
      setActionMessage(
        `Не вдалося видалити папку «${node.folder.name}»: у ній є фото або підпапки. Спочатку перемістіть їх.`,
      );
    else folderDeletion.request(node);
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setActionMessage('Посилання скопійовано.');
    } catch {
      setActionMessage('Не вдалося скопіювати посилання. Відкрийте оригінал і скопіюйте адресу.');
    }
  }

  const place = selectedNode ? folders.pathOf(selectedNode.folder.id) : 'Уся бібліотека';
  const selectedIds = [...selection.selectedIds];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, minWidth: 0 }}>
      <ReferencePageHeader
        overline="Дані"
        title="Фото"
        subtitle={place}
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={selectedIds.length}
              disabled={fileDeletion.deleting}
              onDelete={() => fileDeletion.request(selectedIds)}
            />
            {selectedIds.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<DriveFileMoveOutlinedIcon />}
                onClick={() => move.open(selectedIds, state.folderId)}
              >
                Перемістити
              </Button>
            )}
            <MediaUploadButton
              disabled={upload.active}
              onFiles={(files) => void upload.upload(files, state.folderId)}
            />
          </>
        }
      />
      <ReferenceListAlerts
        error={null}
        loading={false}
        onRetry={() => undefined}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <MediaUploadStatus
        total={upload.total}
        done={upload.done}
        active={upload.active}
        failures={upload.failures}
        onClose={upload.reset}
      />

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

        <Box component="section" aria-label="Фото в папці" sx={{ minWidth: 0 }}>
          <ReferenceSearchBar
            label="Пошук фото"
            placeholder={
              selectedNode
                ? `Знайти фото за назвою в «${selectedNode.folder.name}»…`
                : 'Знайти фото за назвою…'
            }
            value={state.search}
            onChange={(value) => navigate({ search: value })}
          />
          <MediaLibraryFilters
            selectedNode={selectedNode}
            includeSubfolders={state.includeSubfolders}
            found={search.total}
            total={folderTotal}
            selectedCount={selectedIds.length}
            canSelectAll={search.files.length > 0}
            onIncludeSubfolders={(includeSubfolders) => navigate({ includeSubfolders })}
            onSelectAll={() => selection.selectAll(search.files.map((file) => file.id))}
            onClearSelection={selection.clear}
          />
          <MediaFileResults
            search={search}
            page={state.page}
            selectedIds={selection.selectedIds}
            emptyText={
              unknownFolder
                ? 'Такої папки немає. Оберіть іншу зліва.'
                : search.searching
                  ? 'За вашим пошуком фото не знайдено.'
                  : selectedNode
                    ? 'У цій папці ще немає фото. Завантажте їх кнопкою «Завантажити фото».'
                    : 'Бібліотека поки порожня.'
            }
            folderLabel={
              search.searching || !selectedNode || state.includeSubfolders
                ? (file) =>
                    file.folderId === state.folderId ? null : folders.pathOf(file.folderId)
                : undefined
            }
            onOpen={fileEditor.open}
            onToggleSelected={(file) => selection.toggle(file.id)}
            onPageChange={(page) => navigate({ page })}
          />
        </Box>
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
    </Box>
  );
}

export default MediaLibraryPage;
