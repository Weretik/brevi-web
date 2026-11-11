import {
  applySiteGalleryItemForm,
  newSiteGalleryItem,
  siteGalleryItemFormOf,
  siteGalleryLabels,
  validateSiteGalleryItem,
} from '@admin/content/model';
import { SiteGalleryItemForm } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import type {
  SiteGalleryItem,
  SiteGalleryItemErrors,
  SiteGalleryItemFormValues,
  SiteGalleryKind,
} from '@admin/content/model';

interface Props {
  kind: SiteGalleryKind;
  item: SiteGalleryItem;
  isNew: boolean;
  saving: boolean;
  /** Ids already in the list: the picker marks them. */
  takenIds: readonly number[];
  onClose: () => void;
  /** Saves the picture; resolves to the reason when the save is refused. */
  onSubmit: (item: SiteGalleryItem) => Promise<string | null>;
}

/** One picture of «Наші роботи» or one document of «Сертифікати» in the «Цех» side panel. */
export function SiteGalleryItemDrawer({
  kind,
  item,
  isNew,
  saving,
  takenIds,
  onClose,
  onSubmit,
}: Props) {
  const [photo, setPhoto] = useState(item);
  const [values, setValues] = useState<SiteGalleryItemFormValues>(() =>
    siteGalleryItemFormOf(item),
  );
  const [errors, setErrors] = useState<SiteGalleryItemErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const label = siteGalleryLabels[kind].item;

  async function submit() {
    const found = validateSiteGalleryItem(kind, values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage('Виправте позначені поля.');
      return;
    }
    setMessage(await onSubmit(applySiteGalleryItemForm(photo, values)));
  }

  return (
    <>
      <ReferenceEditorDrawer
        titleId="site-gallery-item-title"
        title={isNew ? `Новий: ${label.toLowerCase()}` : label}
        description={
          kind === 'certificates'
            ? 'Скан, назва, на що поширюється документ і стандарти. Сайт покаже зміни протягом кількох хвилин.'
            : 'Фото і підпис. Сайт покаже зміни протягом кількох хвилин.'
        }
        formId="site-gallery-item-form"
        paperWidth={560}
        readOnly={false}
        saving={saving}
        submitLabel={isNew ? 'Додати' : 'Зберегти'}
        editLabel={null}
        onClose={onClose}
        onEdit={() => undefined}
        onSubmit={submit}
      >
        <Stack sx={{ gap: 2 }}>
          {message && <Alert severity="error">{message}</Alert>}
          <SiteGalleryItemForm
            kind={kind}
            values={values}
            errors={errors}
            thumbnailUrl={photo.thumbnailUrl ?? photo.url}
            disabled={saving}
            onChange={setValues}
            onReplacePhoto={() => setPicking(true)}
          />
        </Stack>
      </ReferenceEditorDrawer>
      {picking && (
        <MediaPickerDrawer
          alreadyAddedIds={takenIds}
          onClose={() => setPicking(false)}
          onPick={(files) => {
            setPicking(false);
            const file = files[0];
            if (file)
              setPhoto({ ...newSiteGalleryItem(file), title: photo.title, note: photo.note });
          }}
        />
      )}
    </>
  );
}
