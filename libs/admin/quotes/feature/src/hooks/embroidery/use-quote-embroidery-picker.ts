import { useGetEmbroideryCalculationsQuery } from '@admin/embroidery/data-access';
import { useAddQuoteEmbroideryMutation } from '@admin/quotes/data-access';
import { useDeferredValue, useState } from 'react';

import type { EmbroiderySavedSummary } from '@admin/embroidery/model';
import type { Quote } from '@admin/quotes/model';

/** Adding a saved embroidery calculation to a quote: the search, the choice, and adding it once the quote is saved. */
export function useQuoteEmbroideryPicker({
  ensureSaved,
  onAdded,
}: {
  ensureSaved: () => Promise<Quote | null>;
  onAdded: (quote: Quote) => void;
}) {
  const [search, setSearch] = useState('');
  const [calculation, setCalculation] = useState<EmbroiderySavedSummary | null>(null);
  const [tried, setTried] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const deferred = useDeferredValue(search);
  const list = useGetEmbroideryCalculationsQuery({ search: deferred, page: 1, pageSize: 25 });
  const [add, adding] = useAddQuoteEmbroideryMutation();
  const options = (list.data?.items ?? []).filter((x) => x.price !== null);

  const submit = async () => {
    setTried(true);
    setSaveFailed(false);
    if (!calculation) return;
    const quote = await ensureSaved();
    if (!quote) {
      setSaveFailed(true);
      return;
    }
    const result = await add({ id: quote.id, calculationId: calculation.id });
    if ('data' in result && result.data) onAdded(result.data);
  };
  return {
    setSearch,
    calculation,
    setCalculation,
    tried,
    saveFailed,
    list,
    adding,
    options,
    submit,
  };
}
