import { siteGalleryLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Box, Button, Stack, TextField } from '@mui/material';

import type {
  SiteGalleryItemErrors,
  SiteGalleryItemFormValues,
  SiteGalleryKind,
} from '@admin/content/model';

interface Props {
  kind: SiteGalleryKind;
  values: SiteGalleryItemFormValues;
  errors: SiteGalleryItemErrors;
  thumbnailUrl: string | null;
  disabled: boolean;
  onChange: (values: SiteGalleryItemFormValues) => void;
  /** Opens «Фото» to put another photo in place of this one. */
  onReplacePhoto: () => void;
}

/**
 * One picture of «Наші роботи» (a description) or one document of «Сертифікати» (title, what clothing it covers,
 * standards). An empty Russian text shows the Ukrainian one on the site.
 */
export function SiteGalleryItemForm({
  kind,
  values,
  errors,
  thumbnailUrl,
  disabled,
  onChange,
  onReplacePhoto,
}: Props) {
  const certificates = kind === 'certificates';
  const set = (patch: Partial<SiteGalleryItemFormValues>) => onChange({ ...values, ...patch });
  const field = (
    name: keyof SiteGalleryItemFormValues,
    label: string,
    max: number,
    helper: string,
    multiline = false,
  ) => (
    <TextField
      label={label}
      value={values[name]}
      disabled={disabled}
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      error={Boolean(errors[name])}
      helperText={errors[name] ?? helper}
      slotProps={{ htmlInput: { maxLength: max } }}
      onChange={(event) => set({ [name]: event.target.value })}
      fullWidth
    />
  );

  return (
    <>
      <ReferenceFormSection title={certificates ? 'Скан документа' : 'Фото'}>
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          {thumbnailUrl && (
            <Box
              component="img"
              src={thumbnailUrl}
              alt=""
              sx={{ width: 120, height: 120, objectFit: 'contain', bgcolor: 'action.hover' }}
            />
          )}
          <Button variant="outlined" disabled={disabled} onClick={onReplacePhoto}>
            Замінити з «Фото»
          </Button>
        </Stack>
      </ReferenceFormSection>
      <ReferenceFormSection title={certificates ? 'Назва' : 'Підпис'}>
        {field(
          'titleUk',
          certificates ? 'Назва українською' : 'Підпис українською',
          siteGalleryLimits.title,
          certificates
            ? 'Наприклад: Декларація про відповідність ЗІЗ.'
            : 'Що на фото: пошукові системи читають цей текст. Можна лишити порожнім.',
        )}
        {field(
          'titleRu',
          certificates ? 'Назва російською' : 'Підпис російською',
          siteGalleryLimits.title,
          'Порожнє поле: сайт покаже український текст.',
        )}
      </ReferenceFormSection>
      {certificates && (
        <ReferenceFormSection title="На що поширюється">
          {field(
            'noteUk',
            'Пояснення українською',
            siteGalleryLimits.note,
            'Який одяг охоплює документ.',
            true,
          )}
          {field(
            'noteRu',
            'Пояснення російською',
            siteGalleryLimits.note,
            'Порожнє поле: сайт покаже український текст.',
            true,
          )}
          {field(
            'standards',
            'Стандарти',
            siteGalleryLimits.standards * (siteGalleryLimits.standard + 1),
            `Кожен стандарт з нового рядка, до ${siteGalleryLimits.standards}.`,
            true,
          )}
        </ReferenceFormSection>
      )}
    </>
  );
}
