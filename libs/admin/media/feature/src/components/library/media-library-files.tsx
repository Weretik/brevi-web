import { ReferenceSearchBar } from '@admin/references/ui';
import { Box } from '@mui/material';

import { MediaFileResults } from './media-file-results';
import { MediaLibraryFilters } from './media-library-filters';

import type { MediaLibraryPageState } from '../../hooks/library/use-media-library-page';

/** The photos of the chosen folder: search, filters, selection and the result grid. */
export function MediaLibraryFiles({ page }: { page: MediaLibraryPageState }) {
  const { state, search, selection, selectedNode, folderTotal, selectedIds, unknownFolder } = page;
  const { folders, fileEditor, navigate } = page;
  return (
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
                ? 'У цій папці ще немає фото. Перетягніть їх сюди або натисніть «Завантажити фото».'
                : 'Бібліотека поки порожня. Перетягніть фото сюди або натисніть «Завантажити фото».'
        }
        folderLabel={
          search.searching || !selectedNode || state.includeSubfolders
            ? (file) => (file.folderId === state.folderId ? null : folders.pathOf(file.folderId))
            : undefined
        }
        onOpen={fileEditor.open}
        onToggleSelected={(file) => selection.toggle(file.id)}
        onPageChange={(page) => navigate({ page })}
      />
    </Box>
  );
}
