import { useSetContentProductVisibilityMutation } from '@admin/content/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ContentProductRow } from '@admin/content/model';

/** «Товари сайту»: the switch that shows a product on the site, with a notice when the site still hides it. */
export function useContentProductVisibility() {
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [setVisibility] = useSetContentProductVisibilityMutation();

  async function toggle(row: ContentProductRow, showOnSite: boolean) {
    setSavingId(row.productId);
    setNotice(null);
    try {
      const saved = await setVisibility({ productId: row.productId, showOnSite }).unwrap();
      if (saved.showOnSite && !saved.onSite)
        setNotice({
          text: `«${row.name}» позначено для сайту, але товар вимкнено в «Товари», тому сайт його не покаже.`,
          ok: false,
        });
    } catch (error) {
      setNotice({
        text: adminApiErrorMessage(error, `Не вдалося змінити показ товару «${row.name}».`),
        ok: false,
      });
    } finally {
      setSavingId(null);
    }
  }

  return { notice, setNotice, savingId, toggle };
}
