import { useGetWorkshopDashboardQuery } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useGetFabricBookingQuery, useGetHardwareOrderQuery } from '@admin/warehouse/data-access';
import { Alert, Box, Stack, Typography } from '@mui/material';

import { workshopMetrics, workshopStages, weekHours } from '../../model/dashboard-view';
import { fabricShortages, hardwareToOrder } from '../../model/stock-shortages';
import { DeskListCard } from '../desk-list/desk-list-card';
import { MetricStrip } from '../metrics/metric-strip';
import { WeekHoursCard } from '../side-cards/week-hours-card';
import { WorkshopBoard } from '../workshop-board/workshop-board';

import type { DashboardViewer } from '../../model/dashboard-view';

interface WorkshopDeskProps {
  viewer: DashboardViewer;
}

/**
 * «Стіл цеху» (DESK-001): the workshop board, late and ready orders, hours of the week, and what the stock lacks for the
 * orders in work. Each block needs its own page of «Права доступу».
 */
export function WorkshopDesk({ viewer }: WorkshopDeskProps) {
  const seesOrders = viewer.canSee('production-orders');
  const seesBooking = viewer.canSee('fabric-booking');
  const seesHardware = viewer.canSee('hardware-order');
  const workshop = useGetWorkshopDashboardQuery(undefined, { skip: !seesOrders });
  const booking = useGetFabricBookingQuery(undefined, { skip: !seesBooking });
  const hardware = useGetHardwareOrderQuery(undefined, { skip: !seesHardware });

  const dashboard = workshop.data;
  const hours = dashboard?.hours ?? null;
  const shortages = booking.data ? fabricShortages(booking.data) : null;
  const toOrder = hardware.data ? hardwareToOrder(hardware.data) : null;
  const sideCards = [
    hours && <WeekHoursCard key="hours" rows={weekHours(hours)} />,
    shortages && shortages.rows.length > 0 && (
      <DeskListCard
        id="fabric-shortage"
        key="fabric"
        link={{ label: 'Бронь і що замовити', to: '/warehouse/booking' }}
        list={shortages}
        moreText={(more) => `І ще ${more} — у звіті «Бронь і що замовити».`}
        title="Не вистачає тканини"
      />
    ),
    toOrder && toOrder.rows.length > 0 && (
      <DeskListCard
        id="hardware-order"
        key="hardware"
        link={{ label: 'Увесь список', to: '/warehouse/hardware' }}
        list={toOrder}
        moreText={(more) => `І ще ${more} — у звіті «Фурнітура до замовлення».`}
        title="Фурнітура до замовлення"
      />
    ),
  ].filter(Boolean);

  if (!seesOrders && !seesBooking && !seesHardware) {
    return (
      <Typography color="text.secondary">
        Для цього столу потрібні права на «Виробничі завдання» або склад тканин.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {dashboard && (
        <Typography color="text.secondary" variant="body2">
          Завдання в роботі за етапом найповільнішої позиції.
        </Typography>
      )}
      {workshop.error && (
        <Alert severity="error">
          {adminApiErrorMessage(workshop.error, 'Не вдалося завантажити дані цеху.')}
        </Alert>
      )}
      {dashboard && (
        <>
          <MetricStrip metrics={workshopMetrics(dashboard)} />
          <WorkshopBoard stages={workshopStages(dashboard)} />
        </>
      )}
      {booking.error && (
        <Alert severity="error">
          {adminApiErrorMessage(booking.error, 'Не вдалося порахувати, якої тканини бракує.')}
        </Alert>
      )}
      {hardware.error && (
        <Alert severity="error">
          {adminApiErrorMessage(hardware.error, 'Не вдалося завантажити фурнітуру до замовлення.')}
        </Alert>
      )}
      {sideCards.length > 0 && (
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          {sideCards}
        </Box>
      )}
    </Stack>
  );
}
