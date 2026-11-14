import {
  useReorderSiteCategoriesMutation,
  useSetSiteCategoryVisibilityMutation,
} from '@admin/content/data-access';
import { moveSiteCategory, siteCategoryName } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SiteCategoryRow } from '@admin/content/model';

export interface SiteCategoryNotice {
  text: string;
  ok: boolean;
}

/** «Розділи сайту» row actions: show or hide a category and move it up or down, one row at a time. */
export function useSiteCategoryRowActions(rows: readonly SiteCategoryRow[]) {
  const [notice, setNotice] = useState<SiteCategoryNotice | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [setVisibility] = useSetSiteCategoryVisibilityMutation();
  const [reorder] = useReorderSiteCategoriesMutation();

  async function run(row: SiteCategoryRow, action: () => Promise<void>, failure: string) {
    setSavingId(row.id);
    setNotice(null);
    try {
      await action();
    } catch (error) {
      setNotice({ text: adminApiErrorMessage(error, failure), ok: false });
    } finally {
      setSavingId(null);
    }
  }

  const toggle = (row: SiteCategoryRow, showOnSite: boolean) =>
    run(
      row,
      async () => {
        const saved = await setVisibility({ id: row.id, showOnSite }).unwrap();
        if (saved.showOnSite && !saved.onSite)
          setNotice({
            text: `«${siteCategoryName(row)}» позначено для сайту, але його розділ верхнього рівня приховано, тому сайт його не покаже.`,
            ok: false,
          });
      },
      `Не вдалося змінити показ розділу «${siteCategoryName(row)}».`,
    );

  const move = (row: SiteCategoryRow, step: -1 | 1) => {
    const order = moveSiteCategory(rows, row.id, step);
    if (!order) return Promise.resolve();
    return run(
      row,
      async () => {
        await reorder(order).unwrap();
      },
      `Не вдалося змінити місце розділу «${siteCategoryName(row)}».`,
    );
  };

  return { notice, setNotice, savingId, toggle, move };
}
