import { useCallback, useState } from 'react';

import type { ReminderNotice } from '@admin/reminders/ui';

export function useReminderNotice() {
  const [notice, setNotice] = useState<ReminderNotice | null>(null);
  const success = useCallback((text: string) => setNotice({ tone: 'success', text }), []);
  const failure = useCallback((text: string) => setNotice({ tone: 'error', text }), []);
  const close = useCallback(() => setNotice(null), []);
  return { notice, success, failure, close };
}
