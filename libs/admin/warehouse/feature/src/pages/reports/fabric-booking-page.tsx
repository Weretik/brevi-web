import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { useGetFabricBookingQuery } from '@admin/warehouse/data-access';
import { formatKyivTime, formatMeters, searchBooking } from '@admin/warehouse/model';
import { BookingTable, BookingUnknownTable, ReportStats } from '@admin/warehouse/ui';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

/**
 * «Склад тканин › Бронь і що замовити» (WH-005): the stock handed to the plans of open orders in
 * order of the orders. Opening or refreshing books nothing.
 */
export function FabricBookingPage() {
  const report = useGetFabricBookingQuery();
  const [search, setSearch] = useState('');
  const [onlyToOrder, setOnlyToOrder] = useState(false);
  const data = report.data;
  const pairs = useMemo(
    () => searchBooking(data?.pairs ?? [], search, onlyToOrder),
    [data, search, onlyToOrder],
  );
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Бронь і потреба в тканині"
        subtitle={
          data
            ? `Розраховано ${formatKyivTime(data.calculatedAt)}. Раніші замовлення отримують тканину першими; звіт нічого не бронює і не списує.`
            : 'Що відкриті завдання ще потребують і що треба замовити'
        }
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => void report.refetch()}
          >
            Оновити розрахунок
          </Button>
        }
      />
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати бронь.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && (
        <>
          <ReportStats
            stats={[
              { label: 'Заброньовано', value: formatMeters(data.reserved) },
              { label: 'Вільно', value: formatMeters(data.free) },
              {
                label: 'Потрібно замовити',
                value: formatMeters(data.toOrder),
                tone: data.toOrder > 0 ? 'error' : undefined,
              },
            ]}
          />
          {data.unknown.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              У {data.unknown.length} позицій план невідомий: їх потреба не врахована (не як нуль).
              Список нижче.
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <ReferenceSearchBar
                placeholder="Тканина, колір, замовник або номер"
                label="Пошук тканини або замовлення"
                value={search}
                onChange={setSearch}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch checked={onlyToOrder} onChange={(_, checked) => setOnlyToOrder(checked)} />
              }
              label="Лише те, що потрібно замовити"
            />
          </Box>
          <BookingTable pairs={pairs} searching={search.trim().length > 0 || onlyToOrder} />
          {data.unknown.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Невідомий план
              </Typography>
              <BookingUnknownTable rows={data.unknown} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default FabricBookingPage;
