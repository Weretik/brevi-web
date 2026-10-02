import { Stack, Typography } from '@mui/material';

import { ProductDetailSection } from './product-detail-section';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  ppe: NonNullable<ProductDetail['ppe']>;
}

function percentText(percent: NonNullable<ProductDetail['ppe']>['retailPercent']): string {
  return percent.source === 'Reference'
    ? `довідник «${percent.reference.name}» ${percent.reference.value}${percent.reference.unit}`
    : `власний ${percent.customPercent}%`;
}

export function PpeProductDetail({ ppe }: Props) {
  return (
    <ProductDetailSection label="Ціни ЗІЗ" title="Ціни ЗІЗ">
      <Stack sx={{ gap: 1 }}>
        <Typography>Постачальник: {ppe.supplier.name}</Typography>
        <Typography>Базова ціна: {ppe.basePrice}</Typography>
        <Typography>Роздрібний відсоток: {percentText(ppe.retailPercent)}</Typography>
        <Typography>Оптовий відсоток: {percentText(ppe.wholesalePercent)}</Typography>
        <Typography>Роздрібна ціна: {ppe.retailPrice}</Typography>
        <Typography>Оптова ціна: {ppe.wholesalePrice}</Typography>
      </Stack>
    </ProductDetailSection>
  );
}
