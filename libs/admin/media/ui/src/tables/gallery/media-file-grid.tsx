import { formatMediaDimensions, formatMediaFileSize } from '@admin/media/model';
import { Box, Card, CardActionArea, Checkbox, Typography } from '@mui/material';

import { MediaFilePreview } from '../../components/gallery/media-file-preview';

import type { MediaFile } from '@admin/media/model';

interface Props {
  files: readonly MediaFile[];
  loading: boolean;
  selectedIds: ReadonlySet<number>;
  /** Folder path shown under the name, for example while searching the whole library. */
  folderLabel?: (file: MediaFile) => string | null;
  onOpen: (file: MediaFile) => void;
  onToggleSelected: (file: MediaFile) => void;
}

/** Photo cards with a selection checkbox; a click opens the photo's side panel. */
export function MediaFileGrid({
  files,
  loading,
  selectedIds,
  folderLabel,
  onOpen,
  onToggleSelected,
}: Props) {
  return (
    <Box
      component="ul"
      aria-label="Фото"
      aria-busy={loading}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 168px), 1fr))',
        gap: 1.5,
        listStyle: 'none',
        m: 0,
        p: 0,
        opacity: loading ? 0.6 : 1,
        transition: (theme) => theme.transitions.create('opacity'),
      }}
    >
      {files.map((file) => {
        const selected = selectedIds.has(file.id);
        const folder = folderLabel?.(file);
        const dimensions = formatMediaDimensions(file.width, file.height);
        return (
          <Card
            component="li"
            key={file.id}
            variant="outlined"
            sx={{
              position: 'relative',
              minWidth: 0,
              borderColor: selected ? 'primary.main' : 'divider',
            }}
          >
            <Checkbox
              checked={selected}
              onChange={() => onToggleSelected(file)}
              slotProps={{ input: { 'aria-label': `Вибрати «${file.fileName}»` } }}
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 0.5,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            />
            <CardActionArea onClick={() => onOpen(file)} aria-label={`Відкрити «${file.fileName}»`}>
              <MediaFilePreview file={file} ratio="1 / 1" preferThumbnail />
              <Box sx={{ px: 1.25, py: 1 }}>
                <Typography variant="body2" noWrap title={file.fileName} sx={{ fontWeight: 600 }}>
                  {file.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap component="p">
                  <Box
                    component="span"
                    sx={{
                      fontFamily: 'var(--admin-font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatMediaFileSize(file.sizeInBytes)}
                    {dimensions ? ` · ${dimensions}` : ''}
                  </Box>
                  {folder ? ` · ${folder}` : ''}
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
