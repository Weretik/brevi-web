import { listAdditionalReferences } from '@admin/references/data-access';
import { useEffect, useState } from 'react';

import type { AdditionalReference } from '@admin/references/data-access';

export function useAdditionalReferences() {
  const [rows, setRows] = useState<AdditionalReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void listAdditionalReferences(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setRows(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : 'Не вдалося завантажити додаткові довідники.',
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  return { rows, loading, error, reload: () => setRevision((current) => current + 1) };
}
