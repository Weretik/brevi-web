import { Box, Divider, Stack, Typography } from '@mui/material';

import { ProductCharacteristicsDetail } from './product-characteristics-detail';
import { ProductInformationDetail } from './product-information-detail';
import { ProductMarkdown } from './product-markdown';

import type { ProductDetail } from '@admin/products/data-access';

interface Props {
  product: ProductDetail;
}

export function ProductDetailContent({ product }: Props) {
  return (
    <Stack sx={{ gap: 2, mt: 3 }}>
      <Typography variant="h6">Опис</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1">Українська</Typography>
          <ProductMarkdown text={product.descriptionUk} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1">Російська</Typography>
          <ProductMarkdown text={product.descriptionRu} />
        </Box>
      </Stack>
      <Divider />
      <ProductInformationDetail blocks={product.informationBlocks} />
      <Divider />
      <ProductCharacteristicsDetail tables={product.characteristicTables} />
    </Stack>
  );
}
