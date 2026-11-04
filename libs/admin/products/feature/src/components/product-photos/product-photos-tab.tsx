import { MediaPickerDrawer } from '@admin/media/feature';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useProductPhotos } from '../../hooks/product-photos/use-product-photos';

import type { ProductPhoto } from '@admin/products/model';

interface Props {
  productId: number;
  productName: string;
}

interface CardProps {
  photo: ProductPhoto;
  index: number;
  count: number;
  name: string;
  canEdit: boolean;
  busy: boolean;
  onMain: () => void;
  onMove: (step: -1 | 1) => void;
  onRemove: () => void;
}

function PhotoCard({
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
          <>
            {!photo.isMain && (
              <Tooltip title="Зробити головним">
                <IconButton
                  size="small"
                  disabled={busy}
                  onClick={onMain}
                  aria-label={`Зробити головним фото ${index + 1}`}
                >
                  <StarBorderOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Лівіше">
              <span>
                <IconButton
                  size="small"
                  disabled={busy || index === 0}
                  onClick={() => onMove(-1)}
                  aria-label={`Посунути фото ${index + 1} лівіше`}
                >
                  <ArrowBackOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Правіше">
              <span>
                <IconButton
                  size="small"
                  disabled={busy || index === count - 1}
                  onClick={() => onMove(1)}
                  aria-label={`Посунути фото ${index + 1} правіше`}
                >
                  <ArrowForwardOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Прибрати з товару">
              <IconButton
                size="small"
                disabled={busy}
                onClick={onRemove}
                aria-label={`Прибрати фото ${index + 1}`}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Paper>
  );
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
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            disabled={busy}
            onClick={() => setPicking(true)}
          >
            Додати з медіатеки
          </Button>
          <Button
            component="label"
            variant="outlined"
            startIcon={<FileUploadOutlinedIcon />}
            disabled={busy}
          >
            Завантажити
            <input
              hidden
              multiple
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Завантажити фото товару"
              onChange={(event) => {
                photos.upload(Array.from(event.target.files ?? []));
                event.target.value = '';
              }}
            />
          </Button>
          {busy && <CircularProgress size={20} aria-label="Збереження фото" />}
          <Typography variant="body2" color="text.secondary">
            Головне фото показується в списку товарів і в КП.
          </Typography>
        </Stack>
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
            <PhotoCard
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
