import { useGetLeadStatsQuery, useSyncLeadsMutation } from '@admin/leads/data-access';
import { leadStatsRange } from '@admin/leads/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';

import type { LeadStatsPeriod } from '@admin/leads/model';

/** «Зведення»: the period chips, the statistics and «Синхронізувати зараз». */
export function useLeadStats(notify: (message: string) => void) {
  const [period, setPeriod] = useState<LeadStatsPeriod>('week');
  const range = useMemo(() => leadStatsRange(period, new Date()), [period]);
  const stats = useGetLeadStatsQuery(range);
  const [sync, syncing] = useSyncLeadsMutation();
  const [syncError, setSyncError] = useState<string | null>(null);

  return {
    period,
    setPeriod,
    stats: stats.data,
    loading: stats.isLoading,
    error: stats.isError
      ? adminApiErrorMessage(stats.error, 'Не вдалося завантажити зведення.')
      : null,
    retry: () => void stats.refetch(),
    syncing: syncing.isLoading,
    syncError,
    clearSyncError: () => setSyncError(null),
    sync: async () => {
      setSyncError(null);
      try {
        const result = await sync().unwrap();
        notify(
          `Таблицю прочитано: рядків ${result.rows}, нових ${result.added}, оновлено ${result.updated}` +
            (result.gone ? `, зникло ${result.gone}` : '') +
            (result.skipped ? `, пропущено ${result.skipped}` : ''),
        );
      } catch (error) {
        setSyncError(adminApiErrorMessage(error, 'Не вдалося синхронізувати таблицю.'));
      }
    },
  };
}

export type LeadStatsState = ReturnType<typeof useLeadStats>;
