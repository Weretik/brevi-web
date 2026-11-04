import {
  formatDay,
  formatMeters,
  formatMoney,
  itemApplicationKindLabels,
} from '@admin/production/model';
import { ReferenceDetailsList } from '@admin/references/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import type { ProductionItem, ProductionOrderPermissions } from '@admin/production/model';
import type { ReferenceDetailsItem } from '@admin/references/ui';

interface Props {
  item: ProductionItem;
  permissions: ProductionOrderPermissions;
  onEdit?: () => void;
}

/** One position of an order as the workshop reads it; prices only for those who see them. */
export function ProductionItemCard({ item, permissions, onEdit }: Props) {
  const details: ReferenceDetailsItem[] = [
    { label: 'Кількість', value: `${item.quantity} шт.`, mono: true },
    { label: 'Готово до', value: formatDay(item.dueDate), mono: true },
    {
      label: 'Кольори',
      value: [item.mainColor, ...item.additionalColors].join(' + '),
    },
    { label: 'Плановий розхід тканини', value: formatMeters(item.plannedFabricMeters), mono: true },
    { label: 'Розміри', value: item.sizesText },
    { label: 'Технічні зміни', value: item.technicalChanges },
    { label: 'Коментар', value: item.comment },
    {
      label: 'Нанесення',
      value: item.applications.length
        ? item.applications
            .map((x) =>
              [itemApplicationKindLabels[x.kind], x.place, x.description, x.color]
                .filter(Boolean)
                .join(', '),
            )
            .join('\n')
        : null,
    },
  ];
  if (permissions.seesSewingRate)
    details.push({ label: 'Розцінка пошиття', value: formatMoney(item.sewingRate), mono: true });
  if (permissions.seesReportPrice)
    details.push({
      label: 'Ціна з КП для звіту',
      value: formatMoney(item.reportUnitPrice),
      mono: true,
    });

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2 }}
      aria-label={`Позиція ${item.position}: ${item.modelName}`}
    >
      <Stack
        direction="row"
        sx={{ gap: 2, mb: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h3" variant="h6">
            {item.position}. {item.modelName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily: 'var(--admin-font-mono)' }}
          >
            {[item.modelCode, item.fabricCode].filter(Boolean).join(' · ')}
            {item.fabricName ? ` — ${item.fabricName}` : ''}
          </Typography>
        </Box>
        {onEdit && (
          <Button
            size="small"
            startIcon={<EditOutlinedIcon />}
            aria-label={`Змінити позицію ${item.position}: ${item.modelName}`}
            onClick={onEdit}
          >
            Змінити
          </Button>
        )}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          '& dl': { display: 'contents' },
        }}
      >
        <ReferenceDetailsList items={details} />
      </Box>
    </Paper>
  );
}
