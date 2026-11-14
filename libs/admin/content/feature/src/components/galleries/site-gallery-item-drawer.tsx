import { siteGalleryLabels } from '@admin/content/model';
import { SiteGalleryItemForm } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useSiteGalleryItemForm } from '../../hooks/galleries/use-site-gallery-item-form';

import type { SiteGalleryItem, SiteGalleryKind } from '@admin/content/model';

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
  const { photo, values, setValues, errors, message, picking, setPicking, submit, replacePhoto } =
    useSiteGalleryItemForm(kind, item, onSubmit);
  const label = siteGalleryLabels[kind].item;

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
          onPick={(files) => replacePhoto(files[0])}
        />
      )}
    </>
  );
}
