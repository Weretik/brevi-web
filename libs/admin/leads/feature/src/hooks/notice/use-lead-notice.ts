import { useState } from 'react';

/** A short message under the page after a change, like «Збережено: L&S Distributions». */
export function useLeadNotice() {
  const [message, setMessage] = useState<string | null>(null);
  return { message, notify: setMessage, close: () => setMessage(null) };
}
