import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import StarIcon from '@mui/icons-material/Star';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import { ProductPhotoActions } from './product-photo-actions';

import type { ProductCardPhoto } from '@admin/products/model';

interface CardProps {
  photo: ProductCardPhoto;
  index: number;
  count: number;
  name: string;
  canEdit: boolean;
  busy: boolean;
  onMain: () => void;
  onMove: (step: -1 | 1) => void;
  onRemove: () => void;
}

/** One photo of the product, its file name, and the actions for those who may change photos. */
export function ProductPhotoCard({
  photo,
  index,
  count,
  name,
  canEdit,
  busy,
  onMain,
  onMove,
  onRemove,
}: CardProps) {
  const src = photo.thumbnailUrl ?? photo.url;
  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: 'hidden',
        borderColor: photo.isMain ? 'primary.main' : undefined,
        borderWidth: photo.isMain ? 2 : 1,
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '1 / 1', bgcolor: 'action.hover' }}>
        {src ? (
          <Box
            component="img"
            src={src}
            alt={`${name}, фото ${index + 1}`}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <Stack
            sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', gap: 0.5, p: 1 }}
          >
            <ImageNotSupportedOutlinedIcon color="disabled" />
            <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
              Файлу немає в медіатеці
            </Typography>
          </Stack>
        )}
        {photo.isMain && (
          <Chip
            size="small"
            color="primary"
            icon={<StarIcon />}
            label="Головне"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}
      </Box>
      <Stack direction="row" sx={{ alignItems: 'center', px: 1, py: 0.5, gap: 0.5, minHeight: 44 }}>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1, minWidth: 0 }}>
          {photo.fileName ?? `Фото ${photo.mediaFileId}`}
        </Typography>
        {canEdit && (
          <ProductPhotoActions
            photo={photo}
            index={index}
            count={count}
            busy={busy}
            onMain={onMain}
            onMove={onMove}
            onRemove={onRemove}
          />
        )}
      </Stack>
    </Paper>
  );
}
