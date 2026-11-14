import { Box, Stack, Typography } from '@mui/material';

import { ContentInlineText } from './content-inline-text';
import { contentPreviewEmpty } from './content-preview-empty';

import type { ContentTextBlock } from '@admin/content/model';

/** Stored text blocks with their headings, lists, bold and italic shown as formatting. */
export function ContentBlocksPreview({ blocks }: { blocks: readonly ContentTextBlock[] }) {
  if (blocks.length === 0) return contentPreviewEmpty;
  return (
    <Stack sx={{ gap: 1 }}>
      {blocks.map((block, index) =>
        block.kind === 'Heading' ? (
          <Typography key={index} component="p" variant="subtitle2">
            {block.text}
          </Typography>
        ) : block.kind === 'List' ? (
          <Box key={index} component="ul" sx={{ m: 0, pl: 2.5 }}>
            {block.items.map((item, line) => (
              <Typography key={line} component="li" variant="body2">
                <ContentInlineText text={item} />
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography key={index} variant="body2">
            {block.lead && (
              <Box component="span" sx={{ fontWeight: 600 }}>
                {block.lead}{' '}
              </Box>
            )}
            <ContentInlineText text={block.text} />
          </Typography>
        ),
      )}
    </Stack>
  );
}
