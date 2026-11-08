import { useGetFinanceAuditQuery } from '@admin/accounting/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { AuditAction, AuditEntity } from '@admin/accounting/model';

/** «Журнал змін»: the page and the two filters; a new filter starts from the first page. */
export function useFinanceAudit() {
  const [entity, setEntityState] = useState<AuditEntity | null>(null);
  const [action, setActionState] = useState<AuditAction | null>(null);
  const [page, setPage] = useState(1);
  const query = useGetFinanceAuditQuery(
    { entity, action, page },
    { refetchOnMountOrArgChange: true },
  );
  return {
    entity,
    action,
    page,
    setPage,
    setEntity: (next: AuditEntity | null) => {
      setEntityState(next);
      setPage(1);
    },
    setAction: (next: AuditAction | null) => {
      setActionState(next);
      setPage(1);
    },
    data: query.data,
    loading: query.isLoading || query.isFetching,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити журнал змін.')
      : null,
    retry: () => void query.refetch(),
  };
}
