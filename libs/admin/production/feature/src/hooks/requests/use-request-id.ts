import { useRef } from 'react';

/**
 * One id per attempt: a repeated press sends the same id, so the server returns the order it
 * already made instead of a duplicate. `renew` starts a new attempt after a success.
 */
export function useRequestId() {
  const id = useRef<string>(crypto.randomUUID());
  return {
    current: () => id.current,
    renew: () => {
      id.current = crypto.randomUUID();
    },
  };
}
