import { useLazyGetFabricMovementsQuery } from '@admin/warehouse/data-access';
import { kyivToday, movementsWorkbook, XLSX_MIME_TYPE } from '@admin/warehouse/model';
import { useState } from 'react';

import { downloadFile } from '../files/download-file';

import type { FabricMovementQuery, FabricMovementRow } from '@admin/warehouse/model';

/** The server pages by 50; an export of the whole filter stops at this many pages. */
const MAX_PAGES = 400;

/** «Вивантажити рух в Excel»: reads every page of the current filter, not only the one shown. */
export function useMovementsExport(onError: (message: string) => void) {
  const [load] = useLazyGetFabricMovementsQuery();
  const [busy, setBusy] = useState(false);

  async function run(query: FabricMovementQuery) {
    if (busy) return;
    setBusy(true);
    const rows: FabricMovementRow[] = [];
    try {
      for (let page = 1; page <= MAX_PAGES; page++) {
        const result = await load({ ...query, page }).unwrap();
        rows.push(...result.rows);
        if (!result.hasMore) {
          downloadFile(movementsWorkbook(rows), `rukh-tkanyny-${kyivToday()}.xlsx`, XLSX_MIME_TYPE);
          return;
        }
      }
      onError(
        'Не вдалося вивантажити: рухів забагато для одного файлу. Звузьте фільтр за тканиною.',
      );
    } catch {
      onError(`Не вдалося зібрати всі сторінки (зібрано ${rows.length} рядків). Файл не створено.`);
    } finally {
      setBusy(false);
    }
  }

  return { busy, run };
}
