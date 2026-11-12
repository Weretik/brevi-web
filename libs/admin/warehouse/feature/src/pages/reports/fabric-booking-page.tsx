import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { useGetFabricBookingQuery } from '@admin/warehouse/data-access';
import {
  bookingSuppliers,
  bookingToOrderSummary,
  bookingViewCounts,
  bookingViewLabels,
  bookingViews,
  filterBooking,
  formatKyivTime,
  formatMeters,
  kyivToday,
} from '@admin/warehouse/model';
import {
  BookingTable,
  BookingUnknownTable,
  ReportFilterBar,
  ReportStats,
} from '@admin/warehouse/ui';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, Link } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';
import { BookingPairDrawer } from '../../components/reports/booking-pair-drawer';
import { useDebouncedValue } from '../../hooks/debounce/use-debounced-value';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';
import type { BookingPair, BookingView } from '@admin/warehouse/model';

type Panel = { kind: 'pair'; pair: BookingPair } | { kind: 'receive'; pair: BookingPair } | null;

const plural = (count: number, one: string, few: string, many: string) => {
  const tens = count % 100;
  const units = count % 10;
  if (tens >= 11 && tens <= 14) return many;
  if (units === 1) return one;
  if (units >= 2 && units <= 4) return few;
  return many;
};

/**
 * «Склад тканин › Що замовити › Тканина» (WH-005, WH-009): what to order first, by the nearest date a task needs it,
 * with the supplier and how much the stock covers. Opening or refreshing books nothing.
 */
export function FabricBookingPage({ title, tabs, access }: WarehouseTabProps) {
  const report = useGetFabricBookingQuery();
  const data = report.data;
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 200);
  const [view, setView] = useState<BookingView>('toOrder');
  const [supplier, setSupplier] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState<string | null>(null);
  const today = kyivToday();
  const canReceive = Boolean(data?.canReceive && (access?.stock ?? true));

  const pairs = useMemo(
    () => (data && view !== 'unknown' ? filterBooking(data.pairs, view, supplier, debounced) : []),
    [data, view, supplier, debounced],
  );
  const summary = data ? bookingToOrderSummary(data.pairs) : null;
  const counts = data ? bookingViewCounts(data, supplier) : { toOrder: 0, all: 0, unknown: 0 };

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
          <ReportStats
            stats={[
              {
                label: 'Замовити',
                value: formatMeters(summary.meters),
                tone: summary.meters > 0 ? 'error' : undefined,
                hint:
                  summary.pairs > 0
                    ? `${summary.pairs} ${plural(summary.pairs, 'пара', 'пари', 'пар')} · ${summary.suppliers} ${plural(summary.suppliers, 'постачальник', 'постачальники', 'постачальників')}`
                    : undefined,
              },
              { label: 'У броні', value: formatMeters(data.reserved) },
              { label: 'Вільно на складі', value: formatMeters(data.free) },
              ...(data.unknown.length > 0
                ? [
                    {
                      label: 'Без плану',
                      value: `${data.unknown.length} поз.`,
                      tone: 'warning' as const,
                      hint: 'Потреба невідома, не враховано',
                    },
                  ]
                : []),
            ]}
          />
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
