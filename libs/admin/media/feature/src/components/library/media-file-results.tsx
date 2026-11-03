import { MediaFileGrid } from '@admin/media/ui';
import { Alert, Box, Button, CircularProgress, Pagination, Paper, Typography } from '@mui/material';

import type { useMediaFileSearch } from '../../hooks/library/use-media-file-search';
import type { MediaFile } from '@admin/media/model';

interface Props {
  search: ReturnType<typeof useMediaFileSearch>;
  page: number;
  selectedIds: ReadonlySet<number>;
  emptyText: string;
  folderLabel?: (file: MediaFile) => string | null;
  onOpen: (file: MediaFile) => void;
  onToggleSelected: (file: MediaFile) => void;
  onPageChange: (page: number) => void;
}

/** Photos of the current folder or search with loading, error, empty states and pages. */
export function MediaFileResults({
  search,
  page,
  selectedIds,
  emptyText,
  folderLabel,
  onOpen,
  onToggleSelected,
  onPageChange,
}: Props) {
  if (search.error) {
    return (
      <Alert
        severity="error"
        action={
          <Button disabled={search.fetching} onClick={search.reload}>
            Повторити
          </Button>
        }
      >
        {search.error}
      </Alert>
    );
  }
  if (search.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження фото" />
      </Box>
    );
  }
  if (search.files.length === 0) {
    return (
      <Paper variant="outlined" sx={{ py: 8, px: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyText}</Typography>
      </Paper>
    );
  }
  return (
    <>
      <MediaFileGrid
        files={search.files}
        loading={search.fetching}
        selectedIds={selectedIds}
        folderLabel={folderLabel}
        onOpen={onOpen}
        onToggleSelected={onToggleSelected}
      />
      {search.pageCount > 1 && (
        <Pagination
          count={search.pageCount}
          page={Math.min(page, search.pageCount)}
          onChange={(_event, next) => onPageChange(next)}
          shape="rounded"
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </>
  );
}
