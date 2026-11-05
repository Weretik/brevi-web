import { useGetQuoteProductPhotosQuery } from '@admin/quotes/data-access';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, ButtonBase, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';

import type { QuoteItemDraft } from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  onClose: () => void;
  onDone: (photoUrl: string) => void;
}

/**
 * «Змінити фото»: the item shows another photo of its product's card tab «Фото» (CAT-018).
 * Only this КП changes; the product keeps its main photo.
 */
export function QuotePhotoPickerDrawer({ item, onClose, onDone }: Props) {
  const photos = useGetQuoteProductPhotosQuery(item.productId ?? 0, {
    skip: item.productId === null,
    refetchOnMountOrArgChange: true,
  });
  const [selected, setSelected] = useState(item.photoUrl);
  const list = photos.data ?? [];

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
      {photos.isLoading && (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження фото" />
        </Box>
      )}
      {photos.isError && <Alert severity="error">Не вдалося завантажити фото товару.</Alert>}
      {photos.isSuccess && list.length === 0 && (
        <Typography color="text.secondary">
          У товару немає фото. Додайте їх у картці товару на вкладці «Фото».
        </Typography>
      )}
      {list.length > 0 && (
        <Box
          role="radiogroup"
          aria-label="Фото товару"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 1.5,
          }}
        >
          {list.map((photo, index) => {
            const checked = photo.url === selected;
            return (
              <ButtonBase
                key={photo.mediaFileId}
                role="radio"
                aria-checked={checked}
                aria-label={`Фото ${index + 1}${photo.isMain ? ', головне' : ''}`}
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
                  src={photo.thumbnailUrl ?? photo.url}
                  alt=""
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
                {photo.isMain && (
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
                    Головне
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
