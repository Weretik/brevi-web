import { Stack, Typography } from '@mui/material';

import { ProductDetailSection } from './product-detail-section';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  sewing: NonNullable<ProductDetail['sewing']>;
}

export function SewingProductDetail({ sewing }: Props) {
  return (
    <ProductDetailSection label="Виробництво" title="Виробництво">
      <Stack sx={{ gap: 1 }}>
        <Typography>Метри на виріб: {sewing.metersPerProduct}</Typography>
        <Typography>
          Продуктивність:{' '}
          {sewing.piecesPerShift === null ? 'ще не розраховано' : sewing.piecesPerShift}
        </Typography>
        <Typography variant="subtitle1">Тканини</Typography>
        {sewing.fabrics.length === 0 && <Typography>Тканини не вибрані.</Typography>}
        {[...sewing.fabrics]
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((fabric) => (
            <Typography key={fabric.fabricId}>
              {fabric.name} · {fabric.isPrimary ? 'основна' : 'додаткова'} · поточна ціна{' '}
              {fabric.price}
            </Typography>
          ))}
        <Typography variant="subtitle1">Фурнітура</Typography>
        {sewing.accessories.length === 0 && <Typography>Фурнітура не вибрана.</Typography>}
        {[...sewing.accessories]
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((accessory) => (
            <Typography key={accessory.garmentAccessoryId}>
              {accessory.name} · кількість {accessory.quantity} · поточна ціна {accessory.price}
            </Typography>
          ))}
        <Typography variant="subtitle1">Операції</Typography>
        {sewing.operations.length === 0 && <Typography>Операції не вибрані.</Typography>}
        {sewing.operations.map((operation) => (
          <Typography key={operation.id}>
            {operation.name} · {operation.minutes} хв
          </Typography>
        ))}
      </Stack>
    </ProductDetailSection>
  );
}
