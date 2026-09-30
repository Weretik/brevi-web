import { listGarmentAccessories } from '@admin/references/data-access';
import { useEffect, useState } from 'react';

import type { GarmentAccessory } from '@admin/references/data-access';

export function useGarmentAccessories() {
  const [rows, setRows] = useState<GarmentAccessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void listGarmentAccessories(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setRows(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : 'Не вдалося завантажити фурнітуру.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  return { rows, loading, error, reload: () => setRevision((current) => current + 1) };
}
