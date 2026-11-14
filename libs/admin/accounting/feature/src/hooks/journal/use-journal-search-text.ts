import { useEffect, useRef, useState } from 'react';

import type { FinanceJournalFilter } from '@admin/accounting/model';

const searchDelayMs = 350;

/**
 * The text of a journal search box: it follows the applied search and applies what the person types
 * after a short pause, against the latest filters.
 */
export function useJournalSearchText(
  applied: string,
  applyNow: (patch: Partial<FinanceJournalFilter>) => void,
) {
  const [text, setText] = useState(applied);
  // The latest applyNow, so a typed search applies against the current filters.
  const apply = useRef(applyNow);
  useEffect(() => {
    apply.current = applyNow;
  });

  useEffect(() => setText(applied), [applied]);
  useEffect(() => {
    if (text.trim() === applied.trim()) return undefined;
    const timer = setTimeout(() => apply.current({ search: text }), searchDelayMs);
    return () => clearTimeout(timer);
  }, [text, applied]);

  return { text, setText };
}
