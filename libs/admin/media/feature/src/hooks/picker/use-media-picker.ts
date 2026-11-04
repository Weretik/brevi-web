import { useState } from 'react';

import { describeMediaUpload } from '../../model/media-upload-summary';
import { useMediaUploadQueue } from '../files/use-media-upload-queue';
import { useMediaFolders } from '../folders/use-media-folders';
import { useMediaFileSearch } from '../library/use-media-file-search';
import { useMediaToasts } from '../library/use-media-toasts';

import type { MediaLibraryUrlState } from '../../state/media-library-url-state';
import type { MediaFile } from '@admin/media/model';

/**
 * State of the «Вибрати фото» panel: its own folder and search (not in the URL), photos chosen across
 * pages and folders, and uploads into the open folder that become chosen at once.
 */
export function useMediaPicker(alreadyAddedIds: readonly number[]) {
  const [state, setState] = useState<MediaLibraryUrlState>({
    folderId: null,
    search: '',
    includeSubfolders: true,
    page: 1,
  });
  const [chosen, setChosen] = useState<ReadonlyMap<number, MediaFile>>(new Map());
  const folders = useMediaFolders(state.folderId);
  const search = useMediaFileSearch(state);
  const upload = useMediaUploadQueue();
  const toasts = useMediaToasts();
  const added = new Set(alreadyAddedIds);

  function choose(files: readonly MediaFile[]) {
    setChosen((current) => {
      const next = new Map(current);
      for (const file of files) if (!added.has(file.id)) next.set(file.id, file);
      return next;
    });
  }

  async function uploadFiles(files: File[]) {
    if (upload.active) {
      toasts.show('Зачекайте, попереднє завантаження ще триває.', 'warning');
      return;
    }
    const result = await upload.upload(files, state.folderId);
    if (!result) return;
    choose(result.files);
    const summary = describeMediaUpload(result);
    toasts.show(summary.text, summary.tone);
  }

  return {
    state,
    folders,
    search,
    upload,
    toasts,
    /** Chosen photos plus the ones the product already has, so both show a tick. */
    selectedIds: new Set([...added, ...chosen.keys()]) as ReadonlySet<number>,
    chosen: [...chosen.values()],
    isAdded: (id: number) => added.has(id),
    place: state.folderId === null ? 'Без папки' : folders.pathOf(state.folderId),
    setFolder: (folderId: number | null) =>
      setState((current) => ({ ...current, folderId, page: 1 })),
    setSearch: (value: string) => setState((current) => ({ ...current, search: value, page: 1 })),
    setPage: (page: number) => setState((current) => ({ ...current, page })),
    toggle: (file: MediaFile) => {
      if (added.has(file.id)) return;
      setChosen((current) => {
        const next = new Map(current);
        if (!next.delete(file.id)) next.set(file.id, file);
        return next;
      });
    },
    uploadFiles,
  };
}
