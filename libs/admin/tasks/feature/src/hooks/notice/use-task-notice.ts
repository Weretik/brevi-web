import { useState } from 'react';

/** A short message under the page after a change, like «Завдання ЗД-0142 виконано». */
export function useTaskNotice() {
  const [message, setMessage] = useState<string | null>(null);
  return { message, notify: setMessage, close: () => setMessage(null) };
}
