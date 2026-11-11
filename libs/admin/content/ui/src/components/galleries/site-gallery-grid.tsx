import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';

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
      {items.map((item, index) => {
        const name = certificates
          ? item.title.uk || `Документ ${index + 1}`
          : item.title.uk || `Фото ${index + 1}`;
        return (
          <Paper
            key={item.photoId ?? item.legacyPath ?? index}
            variant="outlined"
            sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
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
              <Stack direction="row" sx={{ px: 1, pb: 1, gap: 0.5, alignItems: 'center' }}>
                <Tooltip title="Раніше">
                  <span>
                    <IconButton
                      size="small"
                      aria-label={`${name}: раніше`}
                      disabled={disabled || index === 0}
                      onClick={() => onMove(index, -1)}
                    >
                      <ArrowBackOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Пізніше">
                  <span>
                    <IconButton
                      size="small"
                      aria-label={`${name}: пізніше`}
                      disabled={disabled || index === items.length - 1}
                      onClick={() => onMove(index, 1)}
                    >
                      <ArrowForwardOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Редагувати">
                  <span>
                    <IconButton
                      size="small"
                      aria-label={`Редагувати: ${name}`}
                      disabled={disabled}
                      onClick={() => onEdit(index)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Прибрати з сайту">
                  <span>
                    <IconButton
                      size="small"
                      aria-label={`Прибрати: ${name}`}
                      disabled={disabled}
                      onClick={() => onDelete(index)}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}
