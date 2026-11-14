import { Box, Typography } from '@mui/material';

import { contentPreviewEmpty } from './content-preview-empty';

/** A titled part of a preview; `text` shows a plain value or «Не заповнено». */
export function ContentPreviewPart({
  title,
  text,
  children,
}: {
  title: string;
  text?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <Box>
      <Typography component="h4" variant="overline" color="text.secondary">
        {title}
      </Typography>
      {children ?? (text ? <Typography variant="body2">{text}</Typography> : contentPreviewEmpty)}
    </Box>
  );
}
