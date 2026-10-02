import { Box, Typography } from '@mui/material';

import { ProductDetailSection } from './product-detail-section';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  tables: ProductDetail['characteristicTables'];
}

export function ProductCharacteristicsDetail({ tables }: Props) {
  return (
    <ProductDetailSection label="Характеристики" title="Характеристики">
      {tables.length === 0 && <Typography>Таблиць характеристик немає.</Typography>}
      {[...tables]
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((table, tableIndex) => (
          <Box
            key={`${table.sortOrder}-${tableIndex}`}
            sx={{ border: 1, borderColor: 'divider', p: 2 }}
          >
            <Typography variant="subtitle1">Українська: {table.titleUk}</Typography>
            <Typography variant="subtitle1">Російська: {table.titleRu}</Typography>
            {[...table.rows]
              .sort((left, right) => left.sortOrder - right.sortOrder)
              .map((row, rowIndex) => (
                <Box key={`${row.sortOrder}-${rowIndex}`} sx={{ mt: 1 }}>
                  <Typography>
                    {row.labelUk}: {row.valueUk}
                  </Typography>
                  <Typography>
                    {row.labelRu}: {row.valueRu}
                  </Typography>
                </Box>
              ))}
          </Box>
        ))}
    </ProductDetailSection>
  );
}
