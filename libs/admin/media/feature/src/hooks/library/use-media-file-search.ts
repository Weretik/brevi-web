import { useSearchMediaFilesQuery } from '@admin/media/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useState } from 'react';

import { useDebouncedValue } from './use-debounced-value';

import type { MediaLibraryUrlState } from '../../state/media-library-url-state';

export const MEDIA_PAGE_SIZE = 48;

/** Server-side search of the current folder; remembers the size of the whole library. */
export function useMediaFileSearch(state: MediaLibraryUrlState) {
  const search = useDebouncedValue(state.search.trim());
  const query = useSearchMediaFilesQuery({
    folderId: state.folderId,
    includeSubfolders: state.includeSubfolders,
    search,
    page: state.page,
    pageSize: MEDIA_PAGE_SIZE,
  });
  const page = query.currentData;
  const [libraryTotal, setLibraryTotal] = useState<number | null>(null);
  const isWholeLibrary = state.folderId === null && !search;
  useEffect(() => {
    if (isWholeLibrary && page) setLibraryTotal(page.total);
  }, [isWholeLibrary, page]);

  return {
    files: page?.items ?? [],
    total: page?.total ?? 0,
    pageCount: page ? Math.max(1, Math.ceil(page.total / MEDIA_PAGE_SIZE)) : 1,
    libraryTotal,
    searching: Boolean(search),
    loading: query.isLoading || (query.isFetching && !page),
    fetching: query.isFetching,
    error: query.error ? adminApiErrorMessage(query.error, 'Не вдалося завантажити фото.') : null,
    reload: () => void query.refetch(),
  };
}
