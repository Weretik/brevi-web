import { lazy } from 'react';

import { WarehouseTabsPage } from '../tabs/warehouse-tabs-page';

import type { WarehouseAccess } from '@admin/warehouse/model';

const FabricPlanFactPage = lazy(() => import('./fabric-plan-fact-page'));
const FabricConsumptionPage = lazy(() => import('./fabric-consumption-page'));
const FabricValuationPage = lazy(() => import('./fabric-valuation-page'));

interface Props {
  useAccess: () => WarehouseAccess;
}

/** «Склад тканин › Звіти»: «План і факт», «Витрата за період» and «Вартість», each its own right. */
export function WarehouseReportsPage({ useAccess }: Props) {
  const access = useAccess();
  return (
    <WarehouseTabsPage
      title="Звіти"
      tabs={[
        {
          value: 'plan-fact',
          label: 'План і факт',
          allowed: access.planFact,
          Page: FabricPlanFactPage,
        },
        {
          value: 'consumption',
          label: 'Витрата за період',
          allowed: access.stock,
          Page: FabricConsumptionPage,
        },
        {
          value: 'valuation',
          label: 'Вартість',
          allowed: access.valuation,
          Page: FabricValuationPage,
        },
      ]}
    />
  );
}

export default WarehouseReportsPage;
