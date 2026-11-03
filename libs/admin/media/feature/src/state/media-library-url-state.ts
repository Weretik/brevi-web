import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface MediaLibraryUrlState {
  folderId: number | null;
  search: string;
  includeSubfolders: boolean;
  page: number;
}

function positiveInteger(value: string | null): number | null {
  const number = Number(value);
  return value && Number.isSafeInteger(number) && number > 0 ? number : null;
}

function read(params: URLSearchParams): MediaLibraryUrlState {
  return {
    folderId: positiveInteger(params.get('folder')),
    search: params.get('q') ?? '',
    includeSubfolders: params.get('sub') !== '0',
    page: positiveInteger(params.get('page')) ?? 1,
  };
}

/** Folder, search, subfolder switch and page live in the URL, so a link opens the same view. */
export function useMediaLibraryUrlState() {
  const [params, setParams] = useSearchParams();

  // Reads the current URL inside the setter, so a stable callback never writes stale values.
  const update = useCallback(
    (patch: Partial<MediaLibraryUrlState>) =>
      setParams(
        (current) => {
          const next = { ...read(current), page: 1, ...patch };
          const result = new URLSearchParams(current);
          const set = (name: string, value: string | null) =>
            value === null ? result.delete(name) : result.set(name, value);
          set('folder', next.folderId === null ? null : String(next.folderId));
          set('q', next.search ? next.search : null);
          set('sub', next.includeSubfolders ? null : '0');
          set('page', next.page > 1 ? String(next.page) : null);
          return result;
        },
        { replace: true },
      ),
    [setParams],
  );

  return { state: read(params), update };
}
