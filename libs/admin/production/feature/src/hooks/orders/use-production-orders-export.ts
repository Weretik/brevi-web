import { useLazyGetProductionOrdersQuery } from '@admin/production/data-access';
import { productionOrdersCsv } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductionOrderListQuery, ProductionOrderSummary } from '@admin/production/model';

const exportPageSize = 200;

function download(text: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/** «Експорт»: every order the filters show, as a CSV file that Excel opens. */
export function useProductionOrdersExport(onError: (message: string) => void) {
  const [load] = useLazyGetProductionOrdersQuery();
  const [busy, setBusy] = useState(false);

  async function run(query: ProductionOrderListQuery, today: string) {
    setBusy(true);
    try {
      const rows: ProductionOrderSummary[] = [];
      for (let page = 1; ; page += 1) {
        const result = await load({ ...query, page, pageSize: exportPageSize }).unwrap();
        rows.push(...result.items);
        if (rows.length >= result.total || result.items.length === 0) break;
      }
      download(productionOrdersCsv(rows), `vyrobnychi-zavdannia-${today}.csv`);
    } catch (error) {
      onError(adminApiErrorMessage(error, 'Не вдалося вивантажити завдання.'));
    } finally {
      setBusy(false);
    }
  }

  return { busy, run };
}
