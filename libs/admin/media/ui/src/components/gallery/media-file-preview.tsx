import BrokenImageOutlined from '@mui/icons-material/BrokenImageOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { MediaFile } from '@admin/media/model';

interface Props {
  file: Pick<MediaFile, 'publicUrl' | 'fileName' | 'alt'> &
    Partial<Pick<MediaFile, 'thumbnailUrl'>>;
  /** CSS aspect ratio of the frame. */
  ratio?: string;
  /** Grid cards load the small WebP preview; the original is the fallback. */
  preferThumbnail?: boolean;
}

/** The photo itself, fitted into a quiet frame; a broken link shows a short note. */
export function MediaFilePreview({ file, ratio = '4 / 3', preferThumbnail = false }: Props) {
  const sources = [preferThumbnail ? file.thumbnailUrl : null, file.publicUrl].filter(
    (url): url is string => Boolean(url),
  );
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const src = sources.find((url) => !failedUrls.includes(url));
  if (!src) {
    return (
      <Stack
        sx={{
          aspectRatio: ratio,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}
      >
        <BrokenImageOutlined aria-hidden="true" />
        <Typography variant="caption">Прев’ю недоступне</Typography>
      </Stack>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt={file.alt || file.fileName}
      loading="lazy"
      decoding="async"
      onError={() => setFailedUrls((current) => [...current, src])}
      sx={{
        display: 'block',
        width: '100%',
        aspectRatio: ratio,
        objectFit: 'contain',
        bgcolor: 'action.hover',
      }}
    />
  );
}
