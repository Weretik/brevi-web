import { lazy } from 'react';

import { WarehouseTabsPage } from '../tabs/warehouse-tabs-page';

import type { WarehouseAccess } from '@admin/warehouse/model';

const FabricBookingPage = lazy(() => import('../reports/fabric-booking-page'));
const HardwareOrderPage = lazy(() => import('../reports/hardware-order-page'));

interface Props {
  useAccess: () => WarehouseAccess;
}

/** «Склад тканин › Що замовити»: «Тканина» (бронь і потреба) and «Фурнітура», each its own right. */
export function WarehouseToOrderPage({ useAccess }: Props) {
  const access = useAccess();
  return (
    <WarehouseTabsPage
      title="Що замовити"
      access={access}
      tabs={[
        { value: 'fabric', label: 'Тканина', allowed: access.booking, Page: FabricBookingPage },
        {
          value: 'hardware',
          label: 'Фурнітура',
          allowed: access.hardware,
          Page: HardwareOrderPage,
        },
      ]}
    />
  );
}

export default WarehouseToOrderPage;
