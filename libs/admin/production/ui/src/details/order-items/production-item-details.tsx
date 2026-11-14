import { applicationText, formatMeters, formatMoney } from '@admin/production/model';
import { ReferenceDetailsList } from '@admin/references/ui';
import { Box, Stack } from '@mui/material';

import { ProductionItemEmbroideries } from './production-item-embroideries';

import type { ProductionItem, ProductionOrderPermissions } from '@admin/production/model';
import type { ReferenceDetailsItem } from '@admin/references/ui';

interface Props {
  item: ProductionItem;
  permissions: ProductionOrderPermissions;
}

/**
 * «Деталі» of an item as the workshop reads it: fabric, colours, sizes, changes, comment, applications with
 * the linked embroidery, planned fabric and, for those who see them, the prices. Empty fields are left out;
 * quantity and «Готово до» are in the panel header.
 */
export function ProductionItemDetails({ item, permissions }: Props) {
  const fabric = [item.fabricCode, item.fabricName].filter(Boolean).join(' — ');
  const details: ReferenceDetailsItem[] = [
    { label: 'Тканина', value: fabric || null },
    { label: 'Кольори', value: [item.mainColor, ...item.additionalColors].join(' + ') },
    { label: 'Розміри', value: item.sizesText },
    { label: 'Технічні зміни', value: item.technicalChanges },
    { label: 'Коментар', value: item.comment },
    {
      label: 'Нанесення',
      value: item.applications.length ? item.applications.map(applicationText).join('\n') : null,
    },
    {
      label: 'Плановий розхід тканини',
      value: item.plannedFabricMeters === null ? null : formatMeters(item.plannedFabricMeters),
      mono: true,
    },
  ];
  if (permissions.seesSewingRate)
    details.push({
      label: 'Розцінка пошиття',
      value: item.sewingRate === null ? null : formatMoney(item.sewingRate),
      mono: true,
    });
  if (permissions.seesReportPrice)
    details.push({
      label: 'Ціна з КП для звіту',
      value: item.reportUnitPrice === null ? null : formatMoney(item.reportUnitPrice),
      mono: true,
    });

  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          '& dl': { display: 'contents' },
        }}
      >
        <ReferenceDetailsList items={details.filter((x) => x.value?.trim())} />
      </Box>
      <ProductionItemEmbroideries
        applications={item.applications}
        canOpenCalculation={permissions.canCopy}
      />
    </Stack>
  );
}
