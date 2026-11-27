import { useEffect, useRef } from 'react';

/** `?task=<id>` from a client card: the board opens that task once it is on screen. */
export function useTaskLink(taskId: number | null | undefined, open: (id: number) => void) {
  const opened = useRef<number | null>(null);
  useEffect(() => {
    if (!taskId || opened.current === taskId) return;
    opened.current = taskId;
    open(taskId);
  }, [taskId, open]);
}
