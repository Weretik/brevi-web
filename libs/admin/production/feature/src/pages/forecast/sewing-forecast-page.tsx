import {
  useGetSewingForecastQuery,
  useSaveSewingForecastQueueMutation,
} from '@admin/production/data-access';
import { formatDay, formatMoney } from '@admin/production/model';
import { SewingForecastTable } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Typography } from '@mui/material';
import { useState } from 'react';

/** «Швейний цех › Прогноз пошиття»: the queue of «Нове» orders and when sewing ends. */
export function SewingForecastPage() {
  const forecast = useGetSewingForecastQuery();
  const [save, saving] = useSaveSewingForecastQueueMutation();
  const [message, setMessage] = useState<string | null>(null);
  const data = forecast.data;
  const settings = data?.settings ?? null;

  async function move(index: number, by: -1 | 1) {
    if (!data || saving.isLoading) return;
    const ids = data.rows.map((row) => row.orderId);
    const [moved] = ids.splice(index, 1);
    if (moved === undefined) return;
    ids.splice(index + by, 0, moved);
    try {
      await save({ version: data.version, orderIds: ids }).unwrap();
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося змінити черговість.'));
    }
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Прогноз пошиття"
        subtitle={
          data
            ? `Рахуємо з ${formatDay(data.startDate)}, лише робочі дні пн–пт`
            : 'Коли орієнтовно закінчиться пошиття завдань «Нове»'
        }
        actions={null}
      />
      <ReferenceListAlerts
        error={
          forecast.error
            ? adminApiErrorMessage(forecast.error, 'Не вдалося завантажити прогноз.')
            : null
        }
        loading={forecast.isFetching || saving.isLoading}
        onRetry={() => void forecast.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      {data?.problem && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {data.problem}
        </Alert>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Орієнтовне завершення пошиття, не обіцяна дата доставки.
        {settings &&
          ` Швачок: ${settings.seamstressCount}, хвилин у зміні: ${settings.shiftMinutes}${settings.minuteCost !== null ? `, хвилина ${formatMoney(settings.minuteCost)}` : ''}.`}
        {data?.canReorder && ' Порядок черги змінюйте стрілками.'}
      </Typography>
      {data && (
        <SewingForecastTable
          rows={data.rows}
          showMinutes={data.settings !== null}
          busy={saving.isLoading || forecast.isFetching}
          onMove={data.canReorder ? (index, by) => void move(index, by) : undefined}
        />
      )}
    </Box>
  );
}

export default SewingForecastPage;
