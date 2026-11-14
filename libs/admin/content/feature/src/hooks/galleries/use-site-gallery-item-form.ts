import {
  applySiteGalleryItemForm,
  newSiteGalleryItem,
  siteGalleryItemFormOf,
  validateSiteGalleryItem,
} from '@admin/content/model';
import { useState } from 'react';

import type {
  SiteGalleryItem,
  SiteGalleryItemErrors,
  SiteGalleryItemFormValues,
  SiteGalleryKind,
} from '@admin/content/model';

type PickedPhoto = Parameters<typeof newSiteGalleryItem>[0];

/**
 * The side panel of one gallery picture: its photo (replaceable from «Фото»), the texts, their errors and
 * the reason a save was refused.
 */
export function useSiteGalleryItemForm(
  kind: SiteGalleryKind,
  item: SiteGalleryItem,
  onSubmit: (item: SiteGalleryItem) => Promise<string | null>,
) {
  const [photo, setPhoto] = useState(item);
  const [values, setValues] = useState<SiteGalleryItemFormValues>(() =>
    siteGalleryItemFormOf(item),
  );
  const [errors, setErrors] = useState<SiteGalleryItemErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  async function submit() {
    const found = validateSiteGalleryItem(kind, values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage('Виправте позначені поля.');
      return;
    }
    setMessage(await onSubmit(applySiteGalleryItemForm(photo, values)));
  }

  /** A new photo from the library keeps the texts already typed. */
  function replacePhoto(file: PickedPhoto | undefined) {
    setPicking(false);
    if (file) setPhoto({ ...newSiteGalleryItem(file), title: photo.title, note: photo.note });
  }

  return { photo, values, setValues, errors, message, picking, setPicking, submit, replacePhoto };
}
