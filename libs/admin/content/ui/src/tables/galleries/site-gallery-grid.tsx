import { Box, Typography } from '@mui/material';

import { SiteGalleryCard } from './site-gallery-card';

import type { SiteGalleryItem, SiteGalleryKind } from '@admin/content/model';

interface Props {
  kind: SiteGalleryKind;
  items: readonly SiteGalleryItem[];
  canEdit: boolean;
  disabled: boolean;
  onEdit: (index: number) => void;
  onMove: (index: number, by: -1 | 1) => void;
  onDelete: (index: number) => void;
}

/**
 * The pictures of «Наші роботи» or «Сертифікати» in the order the site shows them. Only problems are marked:
 * a library photo that was deleted and a file of the site that waits for the transfer.
 */
export function SiteGalleryGrid({
  kind,
  items,
  canEdit,
  disabled,
  onEdit,
  onMove,
  onDelete,
}: Props) {
  const certificates = kind === 'certificates';
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {certificates ? 'Документів немає: сайт показує свої.' : 'Фото немає: сайт показує свої.'}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: `repeat(auto-fill, minmax(${certificates ? 220 : 180}px, 1fr))`,
      }}
    >
      {items.map((item, index) => (
        <SiteGalleryCard
          key={item.photoId ?? item.legacyPath ?? index}
          item={item}
          index={index}
          count={items.length}
          certificates={certificates}
          canEdit={canEdit}
          disabled={disabled}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
