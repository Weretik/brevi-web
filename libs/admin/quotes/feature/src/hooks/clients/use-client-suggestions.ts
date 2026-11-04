import { useListCustomersQuery } from '@admin/clients/data-access';
import { useDeferredValue, useState } from 'react';

import type { QuoteClientSuggestion } from '@admin/quotes/model';

/** KeepinCRM clients for the «Клієнт або запит» field; the field still accepts any text. */
export function useClientSuggestions() {
  const [search, setSearch] = useState('');
  const deferred = useDeferredValue(search.trim());
  const query = useListCustomersQuery(
    { search: deferred, active: true, page: 1, pageSize: 20 },
    { skip: deferred.length < 2 },
  );
  const clients: QuoteClientSuggestion[] =
    query.data?.rows.map((row) => ({
      name: row.displayName,
      companyName: row.legalName ?? (row.kind === 'organization' ? row.displayName : null),
      contactName: row.contactName ?? (row.kind === 'person' ? row.displayName : null),
    })) ?? [];
  return { clients, search: setSearch };
}
