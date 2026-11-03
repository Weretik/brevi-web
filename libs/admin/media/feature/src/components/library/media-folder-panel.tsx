import { MediaFolderTree } from '@admin/media/ui';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

import type { useMediaFolders } from '../../hooks/folders/use-media-folders';
import type { MediaFolderNode } from '@admin/media/model';
import type { MediaFolderAction } from '@admin/media/ui';

interface Props {
  folders: ReturnType<typeof useMediaFolders>;
  selectedId: number | null;
  libraryTotal: number | null;
  onSelect: (id: number | null) => void;
  onCreate: () => void;
  onAction: (action: MediaFolderAction, node: MediaFolderNode) => void;
}

/** Left column: the folder tree; above the photos on phones and tablets. */
export function MediaFolderPanel({
  folders,
  selectedId,
  libraryTotal,
  onSelect,
  onCreate,
  onAction,
}: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        alignSelf: 'start',
        position: { lg: 'sticky' },
        top: { lg: 80 },
        maxHeight: { xs: 320, lg: 'calc(100dvh - 104px)' },
        overflowY: 'auto',
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', px: 1, pb: 0.5 }}
      >
        <Typography variant="h6" component="h2">
          Папки
        </Typography>
        <Button size="small" startIcon={<CreateNewFolderOutlinedIcon />} onClick={onCreate}>
          Нова папка
        </Button>
      </Stack>
      {folders.error && (
        <Alert
          severity="error"
          sx={{ m: 1 }}
          action={<Button onClick={folders.reload}>Повторити</Button>}
        >
          {folders.error}
        </Alert>
      )}
      {folders.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} aria-label="Завантаження папок" />
        </Box>
      ) : (
        <MediaFolderTree
          tree={folders.tree}
          selectedId={selectedId}
          expandedIds={folders.expandedIds}
          totalCount={libraryTotal}
          onSelect={onSelect}
          onToggle={folders.toggle}
          onAction={onAction}
        />
      )}
    </Paper>
  );
}
