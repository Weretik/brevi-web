import { MediaPickerDrawer } from '@admin/media/feature';
import { adminApi } from '@admin/shared/api-client';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import type { MediaFile } from '@admin/media/model';
import type { ProductMedia } from '@admin/products/model';

interface Props {
  alreadyAddedIds: readonly number[];
  /** Photos the editor already knows; a photo uploaded in the panel is not among them yet. */
  knownIds: readonly number[];
  onPick: (media: readonly ProductMedia[]) => void;
}

function toProductMedia(file: MediaFile): ProductMedia {
  return {
    id: file.id,
    originalFileName: file.fileName,
    publicUrl: file.publicUrl,
    contentType: file.contentType,
    status: 'Ready',
  };
}

/** «Вибрати фото» in the product card: opens the photo library panel and adds the ticked photos. */
export function ProductPhotoPicker({ alreadyAddedIds, knownIds, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  function pick(files: MediaFile[]) {
    setOpen(false);
    onPick(files.map(toProductMedia));
    // Freshly uploaded photos are missing from the editor's photo list; reload it so their previews show.
    if (files.some((file) => !knownIds.includes(file.id)))
      dispatch(adminApi.util.invalidateTags([{ type: 'Media', id: 'LIST' }]));
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddPhotoAlternateOutlinedIcon />}
        onClick={() => setOpen(true)}
        sx={{ alignSelf: 'flex-start' }}
      >
        Вибрати фото
      </Button>
      {open && (
        <MediaPickerDrawer
          alreadyAddedIds={alreadyAddedIds}
          onClose={() => setOpen(false)}
          onPick={pick}
        />
      )}
    </>
  );
}
