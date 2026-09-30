import { listGarmentPartOperations } from '@admin/references/data-access';
import { useEffect, useState } from 'react';

import type { GarmentPartOperation } from '@admin/references/data-access';

export function useGarmentPartOperations() {
  const [rows, setRows] = useState<GarmentPartOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void listGarmentPartOperations(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setRows(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : 'Не вдалося завантажити роботи.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  return { rows, loading, error, reload: () => setRevision((current) => current + 1) };
}
