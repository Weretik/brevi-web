import { MediaPickerDrawer } from '@admin/media/feature';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { ProductPhotoCard } from './product-photo-card';
import { ProductPhotosToolbar } from './product-photos-toolbar';
import { useProductPhotos } from '../../hooks/product-photos/use-product-photos';

interface Props {
  productId: number;
  productName: string;
}

/**
 * Tab «Фото» of a product card (CAT-018): the main photo (used by КП and the «Товари» list) and the
 * others in order. Admin and the Director change them; a manager only views. Removing a photo keeps
 * it in the library.
 */
export function ProductPhotosTab({ productId, productName }: Props) {
  const photos = useProductPhotos(productId);
  const [picking, setPicking] = useState(false);
  const { canEdit, busy } = photos;

  return (
    <Stack sx={{ gap: 2 }}>
      {canEdit && (
        <ProductPhotosToolbar
          busy={busy}
          onPick={() => setPicking(true)}
          onUpload={photos.upload}
        />
      )}
      {photos.message && (
        <Alert severity="error" onClose={photos.clearMessage}>
          {photos.message}
        </Alert>
      )}
      {photos.loading && <CircularProgress aria-label="Завантаження фото" />}
      {photos.error && (
        <Alert severity="error" action={<Button onClick={photos.reload}>Повторити</Button>}>
          {photos.error}
        </Alert>
      )}
      {!photos.loading && !photos.error && photos.photos.length === 0 && (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {canEdit ? 'Фото ще немає. Додайте їх з медіатеки або завантажте.' : 'Фото ще немає.'}
          </Typography>
        </Paper>
      )}
      {photos.photos.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          }}
        >
          {photos.photos.map((photo, index) => (
            <ProductPhotoCard
              key={photo.mediaFileId}
              photo={photo}
              index={index}
              count={photos.photos.length}
              name={productName}
              canEdit={canEdit}
              busy={busy}
              onMain={() => photos.makeMain(photo.mediaFileId)}
              onMove={(step) => photos.move(index, step)}
              onRemove={() => photos.remove(photo.mediaFileId)}
            />
          ))}
        </Box>
      )}
      {picking && (
        <MediaPickerDrawer
          alreadyAddedIds={photos.photos.map((photo) => photo.mediaFileId)}
          onClose={() => setPicking(false)}
          onPick={(files) => {
            setPicking(false);
            photos.addFromLibrary(files.map((file) => file.id));
          }}
        />
      )}
    </Stack>
  );
}
