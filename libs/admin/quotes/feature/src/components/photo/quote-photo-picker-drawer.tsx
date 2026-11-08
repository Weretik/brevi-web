import {
  useGetQuoteProductPhotosQuery,
  useUploadQuotePhotoMutation,
} from '@admin/quotes/data-access';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Alert, Box, Button, ButtonBase, CircularProgress, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';

import type { QuoteItemDraft } from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  onClose: () => void;
  onDone: (photoUrl: string) => void;
}

interface Choice {
  key: string;
  url: string;
  previewUrl: string;
  label: string;
  badge?: string;
}

/**
 * «Змінити фото»: the item shows another photo of its product's card tab «Фото» (CAT-018), or an own photo uploaded to
 * the CDN folder «Фото КП» (crm R-33). Only this КП changes; the product keeps its main photo.
 */
export function QuotePhotoPickerDrawer({ item, onClose, onDone }: Props) {
  const photos = useGetQuoteProductPhotosQuery(item.productId ?? 0, {
    skip: item.productId === null,
    refetchOnMountOrArgChange: true,
  });
  const [upload, uploading] = useUploadQuotePhotoMutation();
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState(item.photoUrl);
  const own: Choice[] = uploaded.map((url, index) => ({
    key: `own-${index}`,
    url,
    previewUrl: url,
    label: `Своє фото ${index + 1}`,
    badge: 'Своє',
  }));
  const product: Choice[] = (photos.data ?? []).map((photo, index) => ({
    key: `product-${photo.mediaFileId}`,
    url: photo.url,
    previewUrl: photo.thumbnailUrl ?? photo.url,
    label: `Фото ${index + 1}${photo.isMain ? ', головне' : ''}`,
    badge: photo.isMain ? 'Головне' : undefined,
  }));
  const list = [...own, ...product];

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    try {
      const url = await upload(file).unwrap();
      setUploaded((current) => [url, ...current]);
      setSelected(url);
    } catch (cause) {
      setUploadError(
        (cause as { message?: string } | undefined)?.message ?? 'Не вдалося завантажити фото.',
      );
    }
  };

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
            void onFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <Button
          variant="outlined"
          startIcon={uploading.isLoading ? <CircularProgress size={16} /> : <UploadOutlinedIcon />}
          disabled={uploading.isLoading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading.isLoading ? 'Завантажуємо…' : 'Завантажити своє фото'}
        </Button>
        <Typography variant="caption" color="text.secondary">
          JPG, PNG або WebP. Фото буде лише в цьому КП.
        </Typography>
        {uploadError && <Alert severity="error">{uploadError}</Alert>}
      </Stack>
      {photos.isLoading && (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження фото" />
        </Box>
      )}
      {photos.isError && <Alert severity="error">Не вдалося завантажити фото товару.</Alert>}
      {photos.isSuccess && product.length === 0 && own.length === 0 && (
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
                onClick={() => setSelected(photo.url)}
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
