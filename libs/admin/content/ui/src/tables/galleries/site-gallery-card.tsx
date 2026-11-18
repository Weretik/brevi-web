import { Box, Paper, Stack, Typography } from '@mui/material';

import { SiteGalleryCardActions } from './site-gallery-card-actions';

import type { SiteGalleryItem } from '@admin/content/model';

/** One picture of the gallery with its number, title and only the problems; the order and edit buttons below. */
export function SiteGalleryCard({
  item,
  index,
  count,
  certificates,
  canEdit,
  disabled,
  onEdit,
  onMove,
  onDelete,
}: {
  item: SiteGalleryItem;
  index: number;
  count: number;
  certificates: boolean;
  canEdit: boolean;
  disabled: boolean;
  onEdit: (index: number) => void;
  onMove: (index: number, by: -1 | 1) => void;
  onDelete: (index: number) => void;
}) {
  const name = certificates
    ? item.title.uk || `Документ ${index + 1}`
    : item.title.uk || `Фото ${index + 1}`;
  return (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          aspectRatio: certificates ? '3 / 4' : '4 / 3',
          bgcolor: 'action.hover',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {item.thumbnailUrl ? (
          <Box
            component="img"
            src={item.thumbnailUrl}
            alt={name}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: certificates ? 'contain' : 'cover',
            }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Немає фото
          </Typography>
        )}
      </Box>
      <Stack sx={{ p: 1.5, gap: 0.5, flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {index + 1}
        </Typography>
        {certificates ? (
          <>
            <Typography variant="subtitle2">{name}</Typography>
            {item.note.uk && (
              <Typography variant="body2" color="text.secondary">
                {item.note.uk}
              </Typography>
            )}
            {item.standards.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {item.standards.join(' · ')}
              </Typography>
            )}
          </>
        ) : (
          item.title.uk && <Typography variant="body2">{item.title.uk}</Typography>
        )}
        {item.missing && (
          <Typography variant="caption" color="error">
            Фото видалено з бібліотеки «Фото»: сайт його не покаже.
          </Typography>
        )}
        {item.photoId === null && item.legacyPath && (
          <Typography variant="caption" color="warning.main">
            Ще не в бібліотеці «Фото».
          </Typography>
        )}
      </Stack>
      {canEdit && (
        <SiteGalleryCardActions
          name={name}
          first={index === 0}
          last={index === count - 1}
          disabled={disabled}
          onMove={(by) => onMove(index, by)}
          onEdit={() => onEdit(index)}
          onDelete={() => onDelete(index)}
        />
      )}
    </Paper>
  );
}
