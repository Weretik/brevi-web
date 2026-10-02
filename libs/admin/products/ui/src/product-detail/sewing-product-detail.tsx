import { Box, Stack, Typography } from '@mui/material';

import { ProductDetailSection } from './product-detail-section';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  sewing: NonNullable<ProductDetail['sewing']>;
}

const priceBands = [
  { key: 'price1To10', label: '1–10' },
  { key: 'price11To39', label: '11–39' },
  { key: 'price40Plus', label: '40+' },
] as const;

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
        <Typography variant="subtitle1">Ціни за тканиною</Typography>
        {sewing.prices === null ? (
          <Typography>Ще не розраховано.</Typography>
        ) : (
          <>
            {sewing.prices.byFabric.map((price) => (
              <Box key={price.fabricId} sx={{ border: 1, borderColor: 'divider', p: 1 }}>
                <Typography>Тканина #{price.fabricId}</Typography>
                {priceBands.map((band) => (
                  <Typography key={band.key}>
                    {band.label}: {price[band.key]}
                  </Typography>
                ))}
              </Box>
            ))}
            <Typography variant="subtitle1">Мінімум і максимум за діапазонами</Typography>
            {priceBands.map((band) => {
              const range = sewing.prices?.ranges[band.key];
              return (
                <Typography key={band.key}>
                  {band.label}:{' '}
                  {range
                    ? `мін. ${range.minPrice} (тканина #${range.minFabricId}), макс. ${range.maxPrice} (тканина #${range.maxFabricId})`
                    : 'ще не розраховано'}
                </Typography>
              );
            })}
          </>
        )}
      </Stack>
    </ProductDetailSection>
  );
}
