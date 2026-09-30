import { Stack, Typography } from '@mui/material';

import type { ProductDetail } from '@admin/products/data-access';

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
    <Stack sx={{ gap: 1, mt: 3 }}>
      <Typography variant="h6">Ціни ЗІЗ</Typography>
      <Typography>Постачальник: {ppe.supplier.name}</Typography>
      <Typography>Базова ціна: {ppe.basePrice}</Typography>
      <Typography>Роздрібний відсоток: {percentText(ppe.retailPercent)}</Typography>
      <Typography>Оптовий відсоток: {percentText(ppe.wholesalePercent)}</Typography>
      <Typography>Роздрібна ціна: {ppe.retailPrice}</Typography>
      <Typography>Оптова ціна: {ppe.wholesalePrice}</Typography>
    </Stack>
  );
}
