import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import {
  bookingSuppliers,
  bookingViewLabels,
  bookingViews,
  formatKyivTime,
} from '@admin/warehouse/model';
import { BookingTable, BookingUnknownTable, ReportFilterBar } from '@admin/warehouse/ui';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';
import { BookingPairDrawer } from '../../components/reports/booking-pair-drawer';
import { BookingStats } from '../../components/reports/booking-stats';
import { useFabricBookingReport } from '../../hooks/reports/use-fabric-booking-report';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';

/**
 * «Склад тканин › Що замовити › Тканина» (WH-005, WH-009): what to order first, by the nearest date a task needs it,
 * with the supplier and how much the stock covers. Opening or refreshing books nothing.
 */
export function FabricBookingPage({ title, tabs, access }: WarehouseTabProps) {
  const {
    report,
    data,
    search,
    setSearch,
    debounced,
    view,
    setView,
    supplier,
    setSupplier,
    panel,
    setPanel,
    message,
    setMessage,
    today,
    canReceive,
    pairs,
    summary,
    counts,
  } = useFabricBookingReport({ access });
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'Що замовити'}
        subtitle={
          data
            ? `Розраховано ${formatKyivTime(data.calculatedAt)}. Раніші завдання отримують тканину першими; розрахунок нічого не бронює і не списує.`
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
      {tabs}
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати, що замовити.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      {data && summary && (
        <>
          <BookingStats data={data} summary={summary} />
          <ReportFilterBar
            search={search}
            searchPlaceholder="Тканина, колір, постачальник, замовник або Ц-12"
            searchLabel="Пошук у «Що замовити»"
            views={bookingViews}
            labels={bookingViewLabels}
            counts={counts}
            view={view}
            hideEmpty={['unknown']}
            suppliers={view === 'unknown' ? [] : bookingSuppliers(data.pairs)}
            supplier={supplier}
            shown={view === 'unknown' ? null : pairs.length}
            onSearch={setSearch}
            onView={setView}
            onSupplier={setSupplier}
          />
          {view === 'unknown' ? (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Для цих позицій немає норми або плану кольорів, тому їх потреба не врахована (не як
                нуль). Додайте норму в{' '}
                <Link component={RouterLink} to="/production/fabric-norms">
                  «Норми витрати тканини»
                </Link>
                .
              </Alert>
              <BookingUnknownTable rows={data.unknown} />
            </>
          ) : (
            <BookingTable
              pairs={pairs}
              filtered={debounced.trim().length > 0 || supplier !== null || view !== 'all'}
              today={today}
              onReceive={canReceive ? (pair) => setPanel({ kind: 'receive', pair }) : null}
              onOpen={(pair) => setPanel({ kind: 'pair', pair })}
            />
          )}
        </>
      )}
      {panel?.kind === 'pair' && (
        <BookingPairDrawer
          pair={panel.pair}
          today={today}
          onReceive={canReceive ? () => setPanel({ kind: 'receive', pair: panel.pair }) : null}
          onClose={() => setPanel(null)}
        />
      )}
      {panel?.kind === 'receive' && (
        <FabricReceiptDrawer
          preset={{
            fabricCode: panel.pair.fabricCode,
            color: panel.pair.color,
            supplier: panel.pair.supplier,
          }}
          onClose={() => setPanel(null)}
          onSaved={setMessage}
        />
      )}
    </Box>
  );
}

export default FabricBookingPage;
