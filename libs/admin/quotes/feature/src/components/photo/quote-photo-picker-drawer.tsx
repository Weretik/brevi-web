import { ReferenceEditorDrawer } from '@admin/references/ui';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Alert, Box, Button, ButtonBase, CircularProgress, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { useQuotePhotoChoices } from '../../hooks/photo/use-quote-photo-choices';

import type { QuoteItemDraft } from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  onClose: () => void;
  onDone: (photoUrl: string) => void;
}

/**
 * «Змінити фото»: the item shows another photo of its product's card tab «Фото» (CAT-018), or an own photo uploaded to
 * the CDN folder «Фото КП» (crm R-33). Only this КП changes; the product keeps its main photo.
 */
export function QuotePhotoPickerDrawer({ item, onClose, onDone }: Props) {
  const picker = useQuotePhotoChoices(item);
  const { photos, choices: list, selected } = picker;
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <ReferenceEditorDrawer
      titleId="quote-photo-title"
      title="Змінити фото"
      description={`${item.name}. Зміна діє лише в цьому КП; головне фото товару не змінюється.`}
      formId="quote-photo-form"
      paperWidth={520}
      readOnly={false}
      saving={false}
      saveDisabled={!selected || selected === item.photoUrl}
      submitLabel="Вибрати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => {
        if (selected) onDone(selected);
      }}
    >
      <Stack sx={{ gap: 1, mb: 2, alignItems: 'flex-start' }}>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          aria-label="Файл фото"
          onChange={(event) => {
            void picker.uploadFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <Button
          variant="outlined"
          startIcon={picker.uploading ? <CircularProgress size={16} /> : <UploadOutlinedIcon />}
          disabled={picker.uploading}
          onClick={() => fileInput.current?.click()}
        >
          {picker.uploading ? 'Завантажуємо…' : 'Завантажити своє фото'}
        </Button>
        <Typography variant="caption" color="text.secondary">
          JPG, PNG або WebP. Фото буде лише в цьому КП.
        </Typography>
        {picker.uploadError && <Alert severity="error">{picker.uploadError}</Alert>}
      </Stack>
      {photos.isLoading && (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження фото" />
        </Box>
      )}
      {photos.isError && <Alert severity="error">Не вдалося завантажити фото товару.</Alert>}
      {photos.isSuccess && list.length === 0 && (
        <Typography color="text.secondary">
          У товару немає фото. Завантажте своє або додайте фото в картці товару на вкладці «Фото».
        </Typography>
      )}
      {list.length > 0 && (
        <Box
          role="radiogroup"
          aria-label="Фото для КП"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 1.5,
          }}
        >
          {list.map((photo) => {
            const checked = photo.url === selected;
            return (
              <ButtonBase
                key={photo.key}
                role="radio"
                aria-checked={checked}
                aria-label={photo.label}
                onClick={() => picker.select(photo.url)}
                sx={{
                  position: 'relative',
                  display: 'block',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: 2,
                  borderColor: checked ? 'primary.main' : 'divider',
                  aspectRatio: '1 / 1',
                  bgcolor: 'action.hover',
                }}
              >
                <Box
                  component="img"
                  src={photo.previewUrl}
                  alt=""
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
                {photo.badge && (
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      left: 6,
                      top: 6,
                      typography: 'caption',
                      fontWeight: 600,
                      px: 0.75,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                    }}
                  >
                    {photo.badge}
                  </Box>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      )}
    </ReferenceEditorDrawer>
  );
}
