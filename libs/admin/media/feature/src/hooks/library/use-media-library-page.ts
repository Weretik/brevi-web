import { usePageRights } from '@admin/shared/ui';
import { useEffect } from 'react';

import { useMediaFileSearch } from './use-media-file-search';
import { useMediaSelection } from './use-media-selection';
import { useMediaToasts } from './use-media-toasts';
import { describeMediaUpload } from '../../model/media-upload-summary';
import { useMediaLibraryUrlState } from '../../state/media-library-url-state';
import { useFileDrop } from '../files/use-file-drop';
import { useMediaFileDeletion } from '../files/use-media-file-deletion';
import { useMediaFileEditor } from '../files/use-media-file-editor';
import { useMediaMove } from '../files/use-media-move';
import { useMediaUploadQueue } from '../files/use-media-upload-queue';
import { useMediaFolderDeletion } from '../folders/use-media-folder-deletion';
import { useMediaFolderEditor } from '../folders/use-media-folder-editor';
import { useMediaFolders } from '../folders/use-media-folders';

import type { MediaFolderNode } from '@admin/media/model';
import type { MediaFolderAction } from '@admin/media/ui';

/** Everything «Фото» does: the URL state, folders, search, selection, uploads, moves and deletions. */
export function useMediaLibraryPage() {
  const { state, update } = useMediaLibraryUrlState();
  const { canCreate, canEdit } = usePageRights();
  const toasts = useMediaToasts();
  const notify = toasts.show;
  const folders = useMediaFolders(state.folderId);
  const search = useMediaFileSearch(state);
  const selection = useMediaSelection();
  const upload = useMediaUploadQueue();
  const fileEditor = useMediaFileEditor(notify);
  const move = useMediaMove((message) => {
    selection.clear();
    notify(message);
  });
  const fileDeletion = useMediaFileDeletion((message) => {
    selection.clear();
    notify(message);
  });
  const folderEditor = useMediaFolderEditor(folders.tree, (folder, message) => {
    notify(message);
    navigate({ folderId: folder.id });
  });
  const folderDeletion = useMediaFolderDeletion((node, message) => {
    notify(message);
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
      toasts.show(
        `Папку «${node.folder.name}» не можна видалити: у ній є фото або підпапки. Спочатку перемістіть їх.`,
        'warning',
      );
    else folderDeletion.request(node);
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      notify('Посилання скопійовано.');
    } catch {
      notify('Не вдалося скопіювати посилання. Відкрийте оригінал і скопіюйте адресу.');
    }
  }

  const place = selectedNode ? folders.pathOf(selectedNode.folder.id) : 'Уся бібліотека';

  async function uploadFiles(files: File[]) {
    if (upload.active) {
      toasts.show('Зачекайте, попереднє завантаження ще триває.', 'warning');
      return;
    }
    const result = await upload.upload(files, state.folderId);
    if (!result) return;
    const summary = describeMediaUpload(result);
    toasts.show(summary.text, summary.tone);
  }
  const drop = useFileDrop((files) => void uploadFiles(files), canCreate);
  const selectedIds = [...selection.selectedIds];

  return {
    state,
    canCreate,
    canEdit,
    toasts,
    folders,
    search,
    selection,
    upload,
    fileEditor,
    move,
    fileDeletion,
    folderEditor,
    folderDeletion,
    selectedNode,
    unknownFolder,
    folderTotal,
    place,
    drop,
    selectedIds,
    navigate,
    onFolderAction,
    copyUrl,
    uploadFiles,
  };
}

/** What the «Фото» page and its parts read. */
export type MediaLibraryPageState = ReturnType<typeof useMediaLibraryPage>;
