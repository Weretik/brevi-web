import { filterProductMedia } from '@admin/products/model';
import { MediaDeleteDialog, MediaGallery, MediaUpload } from '@admin/products/ui';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';

import { useMediaDeletion } from '../../hooks/media-library/use-media-deletion';
import { useMediaLibrary } from '../../hooks/media-library/use-media-library';
import { useMediaUpload } from '../../hooks/media-library/use-media-upload';

export function MediaPage() {
  const { items, loading, error, reload } = useMediaLibrary();
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const upload = useMediaUpload(setActionMessage);
  const deletion = useMediaDeletion(setActionMessage);
  const visibleItems = useMemo(() => filterProductMedia(items, search), [items, search]);
  const emptyMessage =
    items.length === 0 ? 'Медіатека поки порожня.' : 'За вашим пошуком фото не знайдено.';

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 2, justifyContent: 'space-between', mb: 2 }}
      >
        <Typography ref={headingRef} tabIndex={-1} component="h1" variant="h4">
          Медіа/Фото
        </Typography>
        <MediaUpload
          uploading={upload.uploading}
          fileName={upload.fileName}
          error={upload.error}
          onUpload={(file) => void upload.upload(file)}
        />
      </Stack>

      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
        </Alert>
      )}
      {actionMessage && (
        <Alert severity="success" onClose={() => setActionMessage(null)}>
          {actionMessage}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, my: 2 }}>
        <TextField
          type="search"
          label="Пошук за назвою фото"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
        <Button disabled={loading} onClick={reload}>
          Оновити галерею
        </Button>
      </Stack>

      {loading && items.length === 0 ? (
        <Stack sx={{ alignItems: 'center', py: 6 }}>
          <CircularProgress aria-label="Завантаження медіатеки" />
        </Stack>
      ) : (
        <MediaGallery
          items={visibleItems}
          loading={loading}
          emptyMessage={emptyMessage}
          onDelete={deletion.requestDelete}
        />
      )}

      <MediaDeleteDialog
        item={deletion.target}
        deleting={deletion.deleting}
        error={deletion.error}
        onClose={deletion.close}
        onConfirm={() => void deletion.confirm()}
        onExited={() => headingRef.current?.focus()}
      />
    </Box>
  );
}

export default MediaPage;
