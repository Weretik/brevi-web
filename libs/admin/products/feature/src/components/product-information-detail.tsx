import { Box, Stack, Typography } from '@mui/material';

import type { ProductDetail } from '@admin/products/data-access';

interface Props {
  blocks: ProductDetail['informationBlocks'];
}

export function ProductInformationDetail({ blocks }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Інформація</Typography>
      {blocks.length === 0 && <Typography>Інформаційних блоків немає.</Typography>}
      {[...blocks]
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((block, index) => (
          <Box key={`${block.sortOrder}-${index}`} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
            <Typography>Українська: {block.titleUk}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{block.textUk}</Typography>
            <Typography sx={{ mt: 1 }}>Російська: {block.titleRu}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{block.textRu}</Typography>
          </Box>
        ))}
    </Stack>
  );
}
