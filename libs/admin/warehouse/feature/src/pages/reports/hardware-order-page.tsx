import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetHardwareOrderQuery } from '@admin/warehouse/data-access';
import {
  formatKyivTime,
  hardwareWorkbook,
  kyivToday,
  XLSX_MIME_TYPE,
} from '@admin/warehouse/model';
import { HardwareIncompleteTable, HardwareNeedTable, ReportStats } from '@admin/warehouse/ui';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { downloadFile } from '../../hooks/files/download-file';

/**
 * «Склад тканин › Фурнітура до замовлення» (WH-005): the full accessory need of open orders by
 * the composition of their models. Stock and issues are not taken off.
 */
export function HardwareOrderPage() {
  const report = useGetHardwareOrderQuery();
  const data = report.data;
  const unchecked = data?.needs.filter((x) => !x.nameChecked) ?? [];
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Фурнітура до замовлення"
        subtitle={`Повна потреба відкритих замовлень за складом моделей. Складські залишки та видачі не віднімаються.${data ? ` Розраховано ${formatKyivTime(data.calculatedAt)}.` : ''}`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => void report.refetch()}
            >
              Оновити
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              disabled={!data}
              onClick={() =>
                data &&
                downloadFile(
                  hardwareWorkbook(data),
                  `furnitura-do-zamovlennia-${kyivToday()}.xlsx`,
                  XLSX_MIME_TYPE,
                )
              }
            >
              Excel
            </Button>
          </Stack>
        }
      />
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати потребу у фурнітурі.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && (
        <>
          <ReportStats
            stats={[
              { label: 'Активних замовлень', value: String(data.orders) },
              { label: 'Позицій-моделей', value: String(data.items) },
              { label: 'Позицій фурнітури', value: String(data.needs.length) },
            ]}
          />
          {data.incomplete.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Потреба неповна: для {data.incomplete.length} рядків кількість невідома. Список нижче.
            </Alert>
          )}
          <HardwareNeedTable needs={data.needs} />
          {data.incomplete.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Потреба неповна
              </Typography>
              <HardwareIncompleteTable rows={data.incomplete} />
            </Box>
          )}
          {unchecked.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Потрібна перевірка назв</Typography>
              <Typography variant="body2" color="text.secondary">
                Кількість врахована, але назви немає в довіднику:{' '}
                {unchecked.map((x) => x.code).join(', ')}.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default HardwareOrderPage;
