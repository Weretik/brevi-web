import { Box, Chip, Stack, Typography } from '@mui/material';

import type { ProductDetail } from '@admin/products/data-access';

interface Props {
  photos: ProductDetail['photos'];
}

export function ProductDetailGallery({ photos }: Props) {
  return (
    <Stack sx={{ gap: 1, mt: 2 }}>
      <Typography variant="h6">Фото</Typography>
      {photos.length === 0 && <Typography>Фото немає.</Typography>}
      <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap' }}>
        {[...photos]
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((photo) => (
            <Box key={photo.mediaFileId} sx={{ border: 1, borderColor: 'divider', p: 1 }}>
              <Box
                component="img"
                src={photo.url}
                alt={photo.alt ?? ''}
                sx={{ width: 140, height: 140, objectFit: 'contain', display: 'block' }}
              />
              <Stack direction="row" sx={{ gap: 0.5, mt: 1 }}>
                {photo.isMain && <Chip label="Головне" size="small" />}
                <Chip label={photo.isVisible ? 'Видиме' : 'Приховане'} size="small" />
              </Stack>
              <Typography variant="caption">Alt: {photo.alt || '—'}</Typography>
            </Box>
          ))}
      </Stack>
    </Stack>
  );
}
