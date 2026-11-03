import BrokenImageOutlined from '@mui/icons-material/BrokenImageOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { MediaFile } from '@admin/media/model';

interface Props {
  file: Pick<MediaFile, 'publicUrl' | 'fileName' | 'alt'>;
  /** CSS aspect ratio of the frame. */
  ratio?: string;
}

/** The photo itself, fitted into a quiet frame; a broken link shows a short note. */
export function MediaFilePreview({ file, ratio = '4 / 3' }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
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
      src={file.publicUrl}
      alt={file.alt || file.fileName}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
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
