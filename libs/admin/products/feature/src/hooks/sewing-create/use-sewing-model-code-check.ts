import { useGetProductCodeCheckQuery } from '@admin/products/data-access';
import { useEffect, useState } from 'react';

const debounceMs = 400;

/**
 * The next free MOD-XXX for a new model and a debounced uniqueness check of the typed code.
 * The suggested code is free, so it is not checked again.
 */
export function useSewingModelCodeCheck(code: string) {
  const suggestion = useGetProductCodeCheckQuery({ type: 'Sewing' });
  const suggestedCode = suggestion.data?.suggestedCode ?? null;
  const trimmed = code.trim();
  const [debounced, setDebounced] = useState(trimmed);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(trimmed), debounceMs);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const skip = !debounced || debounced === suggestedCode;
  const check = useGetProductCodeCheckQuery({ type: 'Sewing', code: debounced }, { skip });
  const current = !skip && debounced === trimmed ? (check.data ?? null) : null;

  return {
    suggestedCode,
    /** The answer for the code as it is typed now; null while unknown. */
    check: current,
    checking: Boolean(trimmed) && (debounced !== trimmed || (!skip && check.isFetching)),
    available: Boolean(trimmed) && (trimmed === suggestedCode || current?.isAvailable === true),
  };
}
