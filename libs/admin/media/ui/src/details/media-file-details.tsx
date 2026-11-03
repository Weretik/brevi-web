import { formatMediaDate, formatMediaDimensions, formatMediaFileSize } from '@admin/media/model';
import { ReferenceDetailsList } from '@admin/references/ui';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Button, Card, Stack, Typography } from '@mui/material';

import { MediaFilePreview } from '../components/gallery/media-file-preview';

import type { MediaFile, MediaUsage } from '@admin/media/model';

interface Props {
  file: MediaFile;
  folderPath: string;
  /** Null while the usages are still loading. */
  usages: readonly MediaUsage[] | null;
  onCopyUrl: (url: string) => void;
}

/** Read-only view of a photo in its side panel: big preview, facts and where it is used. */
export function MediaFileDetails({ file, folderPath, usages, onCopyUrl }: Props) {
  return (
    <Stack sx={{ gap: 2.5 }}>
      <Card variant="outlined">
        <MediaFilePreview file={file} />
      </Card>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ContentCopyOutlinedIcon />}
          onClick={() => onCopyUrl(file.publicUrl)}
        >
          Копіювати посилання
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<OpenInNewOutlinedIcon />}
          href={file.publicUrl}
          target="_blank"
          rel="noreferrer"
        >
          Відкрити оригінал
        </Button>
      </Stack>
      <ReferenceDetailsList
        items={[
          { label: 'Назва', value: file.fileName },
          { label: 'Опис для сайту (alt)', value: file.alt },
          { label: 'Папка', value: folderPath },
          { label: 'Розмір', value: formatMediaFileSize(file.sizeInBytes), mono: true },
          {
            label: 'Розміри, px',
            value: formatMediaDimensions(file.width, file.height),
            mono: true,
          },
          { label: 'Тип', value: file.contentType, mono: true },
          { label: 'Завантажено', value: formatMediaDate(file.createdAt), mono: true },
        ]}
      />
      <Box>
        <Typography variant="overline" color="text.secondary" component="h3">
          Де використовується
        </Typography>
        {usages === null ? (
          <Typography variant="body2" color="text.secondary">
            Перевіряємо…
          </Typography>
        ) : usages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Ніде. Фото можна видалити.
          </Typography>
        ) : (
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {usages.map((usage) => (
              <Typography component="li" variant="body2" key={`${usage.area}-${usage.ownerId}`}>
                {usage.area}: {usage.title}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
}
