import { useRef } from 'react';

export function useStableRequest() {
  const current = useRef<{ payload: string; id: string } | null>(null);
  return {
    id: (intent: unknown): string => {
      const payload = JSON.stringify(intent);
      if (!current.current || current.current.payload !== payload)
        current.current = { payload, id: crypto.randomUUID() };
      return current.current.id;
    },
    reset: () => {
      current.current = null;
    },
  };
}
