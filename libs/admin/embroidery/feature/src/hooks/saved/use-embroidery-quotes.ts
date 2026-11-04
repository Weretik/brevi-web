import { useListQuotesQuery } from '@admin/quotes/data-access';
import { useDeferredValue, useState } from 'react';

import type { EmbroideryQuoteOption } from '@admin/embroidery/ui';

/** КП «Під запит» in work that a saved calculation can go to; a Manager gets only own ones from the server. */
export function useEmbroideryQuotes() {
  const [search, setSearch] = useState('');
  const deferred = useDeferredValue(search.trim());
  const query = useListQuotesQuery({
    archived: false,
    search: deferred,
    responsibleUserId: null,
    page: 1,
    pageSize: 20,
  });
  const options: EmbroideryQuoteOption[] =
    query.data?.items
      .filter((quote) => quote.kind === 'Request')
      .map((quote) => ({ id: quote.id, label: `${quote.number} · ${quote.internalName}` })) ?? [];
  return { options, loading: query.isFetching, search: setSearch };
}
