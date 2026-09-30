import { Box, Stack, Typography } from '@mui/material';

import type { ProductDetail } from '@admin/products/data-access';

interface Props {
  product: ProductDetail;
}

export function ProductDetailHeader({ product }: Props) {
  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="h4" component="h1">
        {product.name}
      </Typography>
      <Typography>Російська назва: {product.ruName}</Typography>
      <Box>
        <Typography>ID: {product.id}</Typography>
        <Typography>Slug: {product.slug}</Typography>
        <Typography>Тип: {product.type === 'Sewing' ? 'Швейний товар' : 'ЗІЗ'}</Typography>
        <Typography>Створено: {new Date(product.createdAtUtc).toLocaleString('uk-UA')}</Typography>
        <Typography>
          Змінено:{' '}
          {product.updatedAtUtc ? new Date(product.updatedAtUtc).toLocaleString('uk-UA') : '—'}
        </Typography>
        <Typography>
          Категорії: {product.categories.map((category) => category.name).join(', ') || '—'}
        </Typography>
        <Typography>
          Мінімальна оптова ціна:{' '}
          {product.minimumWholesalePrice > 0
            ? product.minimumWholesalePrice.toLocaleString('uk-UA')
            : 'Не розраховано'}
        </Typography>
      </Box>
    </Stack>
  );
}
