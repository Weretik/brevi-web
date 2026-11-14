import { usePageRights } from '@admin/shared/ui';
import { useGetFabricBookingQuery } from '@admin/warehouse/data-access';
import {
  bookingToOrderSummary,
  bookingViewCounts,
  filterBooking,
  kyivToday,
} from '@admin/warehouse/model';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../debounce/use-debounced-value';

import type { WarehouseTabProps } from '../../pages/tabs/warehouse-tab';
import type { BookingPair, BookingView } from '@admin/warehouse/model';

type Panel = { kind: 'pair'; pair: BookingPair } | { kind: 'receive'; pair: BookingPair } | null;

/** «Що замовити › Тканина»: pairs to order with the search, view and supplier chips, the open side panel and the right to record a receipt. */
export function useFabricBookingReport({ access }: { access: WarehouseTabProps['access'] }) {
  const report = useGetFabricBookingQuery();
  const data = report.data;
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 200);
  const [view, setView] = useState<BookingView>('toOrder');
  const [supplier, setSupplier] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState<string | null>(null);
  const today = kyivToday();
  const { can } = usePageRights();
  const canReceive = Boolean(
    data?.canReceive && (access?.stock ?? true) && can('create', 'fabric-stock'),
  );

  const pairs = useMemo(
    () => (data && view !== 'unknown' ? filterBooking(data.pairs, view, supplier, debounced) : []),
    [data, view, supplier, debounced],
  );
  const summary = data ? bookingToOrderSummary(data.pairs) : null;
  const counts = data ? bookingViewCounts(data, supplier) : { toOrder: 0, all: 0, unknown: 0 };
  return {
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
  };
}
