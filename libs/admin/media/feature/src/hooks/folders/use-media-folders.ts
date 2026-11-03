import { useGetMediaFoldersQuery } from '@admin/media/data-access';
import {
  buildMediaFolderTree,
  findMediaFolderNode,
  mediaFolderAncestry,
  mediaFolderOptions,
  mediaFolderPath,
} from '@admin/media/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useMemo, useState } from 'react';

/** Loads folders once and derives the tree, select options and expanded folders. */
export function useMediaFolders(selectedId: number | null) {
  const query = useGetMediaFoldersQuery();
  const folders = useMemo(() => query.data ?? [], [query.data]);
  const tree = useMemo(() => buildMediaFolderTree(folders), [folders]);
  const options = useMemo(() => mediaFolderOptions(tree), [tree]);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(new Set());

  // Opening a folder (also by link) expands it and its parents, so it and its subfolders show.
  useEffect(() => {
    if (selectedId === null) return;
    const parents = mediaFolderAncestry(folders, selectedId);
    if (parents.length === 0) return;
    setExpandedIds((current) =>
      parents.every((id) => current.has(id)) ? current : new Set([...current, ...parents]),
    );
  }, [folders, selectedId]);

  return {
    folders,
    tree,
    options,
    expandedIds,
    loading: query.isLoading,
    error: query.error ? adminApiErrorMessage(query.error, 'Не вдалося завантажити папки.') : null,
    reload: () => void query.refetch(),
    selectedNode: selectedId === null ? null : findMediaFolderNode(tree, selectedId),
    pathOf: (id: number | null) => mediaFolderPath(folders, id),
    toggle: (id: number) =>
      setExpandedIds((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
  };
}
