import { Tab, Tabs } from '@mui/material';
import { Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { WarehouseTabProps } from './warehouse-tab';
import type { WarehouseAccess } from '@admin/warehouse/model';
import type { ComponentType } from 'react';

export interface WarehouseTabDefinition {
  value: string;
  label: string;
  /** The tab's own page of «Права доступу». */
  allowed: boolean;
  Page: ComponentType<WarehouseTabProps>;
}

interface Props {
  title: string;
  tabs: readonly WarehouseTabDefinition[];
  /** Passed on to every tab page. */
  access?: WarehouseAccess;
}

/**
 * One menu item of «Склад тканин» holding several reports as tabs, kept in `?tab=`. A person sees only
 * the tabs their rights open; an unknown or closed tab falls back to the first open one.
 */
export function WarehouseTabsPage({ title, tabs, access }: Props) {
  const [params, setParams] = useSearchParams();
  const open = tabs.filter((tab) => tab.allowed);
  const current = open.find((tab) => tab.value === params.get('tab')) ?? open[0];
  if (!current) return null;
  const row =
    open.length > 1 ? (
      <Tabs
        value={current.value}
        onChange={(_event, next: string) => setParams({ tab: next }, { replace: true })}
        sx={{ mb: 2 }}
      >
        {open.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
    ) : null;
  const { Page } = current;
  return (
    <Suspense fallback={null}>
      <Page key={current.value} title={title} tabs={row} access={access} />
    </Suspense>
  );
}
