import { useState } from 'react';

import { useOrderQuickParam } from './use-order-quick-param';
import { useProductionModelSummary } from './use-production-model-summary';
import { useProductionOrders } from './use-production-orders';
import { useProductionOrdersExport } from './use-production-orders-export';

import type { ProductionOrdersImport, ProductionOrdersView } from '@admin/production/ui';

/** «Виробничі завдання»: the list or the model summary, the filter panel, import, export, the order open from the address and the message. */
export function useProductionOrdersPage() {
  const list = useProductionOrders();
  const [view, setView] = useState<ProductionOrdersView>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const summary = useProductionModelSummary(list.query, view === 'summary');
  const [message, setMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState<ProductionOrdersImport | null>(null);
  const exporter = useProductionOrdersExport(setMessage);
  const quick = useOrderQuickParam();
  const page = list.page;
  const attention = page?.attention ?? { overdue: 0, dueSoon: 0 };
  return {
    list,
    view,
    setView,
    filtersOpen,
    setFiltersOpen,
    summary,
    message,
    setMessage,
    importing,
    setImporting,
    exporter,
    quick,
    page,
    attention,
  };
}
