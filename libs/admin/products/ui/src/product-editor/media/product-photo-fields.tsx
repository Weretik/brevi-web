import { addReadyPhoto, moveOrdered, removePhoto, setMainPhoto } from '@admin/products/model';
import {
  Alert,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import type { ProductLookups } from '../core/product-lookups';
import type { ProductDraft, ProductMedia } from '@admin/products/model';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  lookups: ProductLookups;
  /** The «Вибрати фото» button with the photo library panel. */
  renderPicker: (
    alreadyAddedIds: readonly number[],
    onPick: (media: readonly ProductMedia[]) => void,
  ) => ReactNode;
}

export function ProductPhotoFields({ draft, setDraft, errors, lookups, renderPicker }: Props) {
  function addPhotos(media: readonly ProductMedia[]) {
    setDraft((current) => ({
      ...current,
      photos: media.reduce((photos, item) => addReadyPhoto(photos, item), current.photos),
    }));
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Фото</Typography>
      {errors['photos'] && <Alert severity="error">{errors['photos']}</Alert>}
      {draft.photos.map((photo, index) => {
        const media = lookups.media.find((item) => item.id === photo.mediaFileId);
        return (
          <Stack key={photo.mediaFileId} sx={{ gap: 1, border: 1, borderColor: 'divider', p: 1 }}>
            {media?.publicUrl && (
              <img
                src={media.publicUrl}
                alt={photo.alt || media.originalFileName}
                style={{ maxWidth: 180, maxHeight: 140, objectFit: 'contain' }}
              />
            )}
            <Typography>{media?.originalFileName ?? `Медіа #${photo.mediaFileId}`}</Typography>
            <TextField
              label="Alt"
              size="small"
              value={photo.alt ?? ''}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  photos: current.photos.map((item, position) =>
                    position === index ? { ...item, alt: event.target.value } : item,
                  ),
                }))
              }
            />
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={photo.isVisible}
                    onChange={(_, checked) =>
                      setDraft((current) => ({
                        ...current,
                        photos: current.photos.map((item, position) =>
                          position === index ? { ...item, isVisible: checked } : item,
                        ),
                      }))
                    }
                  />
                }
                label="Видиме"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={photo.isMain}
                    onChange={(_, checked) =>
                      setDraft((current) => ({
                        ...current,
                        photos: checked ? setMainPhoto(current.photos, index) : current.photos,
                      }))
                    }
                  />
                }
                label="Головне"
              />
              <Button
                disabled={index === 0}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    photos: moveOrdered(current.photos, index, -1),
                  }))
                }
              >
                Вгору
              </Button>
              <Button
                disabled={index === draft.photos.length - 1}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    photos: moveOrdered(current.photos, index, 1),
                  }))
                }
              >
                Вниз
              </Button>
              <Button
                color="error"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    photos: removePhoto(current.photos, index),
                  }))
                }
              >
                Прибрати
              </Button>
            </Stack>
          </Stack>
        );
      })}
      {renderPicker(
        draft.photos.map((photo) => photo.mediaFileId),
        addPhotos,
      )}
    </Stack>
  );
}
