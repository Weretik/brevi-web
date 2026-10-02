import { Box, Stack, Typography } from '@mui/material';

import { ProductCharacteristicsDetail } from './product-characteristics-detail';
import { ProductDetailSection } from './product-detail-section';
import { ProductInformationDetail } from './product-information-detail';
import { ProductMarkdown } from '../product-content/product-markdown';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  product: ProductDetail;
}

export function ProductDetailContent({ product }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ProductDetailSection label="Опис" title="Опис">
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
      </ProductDetailSection>
      <ProductInformationDetail blocks={product.informationBlocks} />
      <ProductCharacteristicsDetail tables={product.characteristicTables} />
    </Stack>
  );
}
