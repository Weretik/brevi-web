import { useGetQuoteEmailTemplatesQuery } from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useRef, useState } from 'react';

import type { IntroductionEmailTemplateOption } from '@admin/clients/model';

/** Immutable registry choices for the editor; historical references are never silently replaced. */
export function useIntroductionEmailTemplates(selectedId: string, storedId: string | null) {
  const [page, setPage] = useState(1);
  const registry = useGetQuoteEmailTemplatesQuery({ page, pageSize: 25 });
  const known = useRef(new Map<string, IntroductionEmailTemplateOption>());
  const denied = isAdminApiError(registry.error) && [401, 403, 404].includes(registry.error.status);
  const loading = registry.isLoading || registry.isFetching;
  const unavailable = loading || registry.isError || !registry.currentData;
  const rows = denied || unavailable ? [] : (registry.currentData?.rows ?? []);
  const options = rows.map((row) => ({ id: row.id, label: `${row.label} · версія ${row.number}` }));
  useEffect(() => {
    if (denied) known.current.clear();
    else if (!unavailable) {
      for (const row of registry.currentData?.rows ?? [])
        known.current.set(row.id, { id: row.id, label: `${row.label} · версія ${row.number}` });
    }
  }, [denied, unavailable, registry.currentData]);
  const selected = !denied && !unavailable ? known.current.get(selectedId) : undefined;
  if (selected && !options.some((row) => row.id === selected.id)) options.push(selected);
  const canUse = (id: string) =>
    !denied &&
    !!id &&
    (id === storedId ||
      (!unavailable && (rows.some((row) => row.id === id) || known.current.has(id))));
  return {
    options,
    page,
    setPage,
    totalPages: Math.max(1, registry.currentData?.totalPages ?? 1),
    loading,
    error: registry.isError,
    denied,
    unavailable,
    canUse,
    refetch: registry.refetch,
  };
}
