import { useCallback, useEffect, useRef, useState } from 'react';

import type { MediaToast, MediaToastTone } from '@admin/media/ui';

/** How long a notice stays: errors and warnings longer, so there is time to read them. */
const DURATION_MS: Record<MediaToastTone, number> = { success: 4000, warning: 8000, error: 8000 };
const MAX_TOASTS = 4;

/** Pop-up notices of the photo page; a text that starts with «Не вдалося» is an error. */
export function useMediaToasts() {
  const [toasts, setToasts] = useState<MediaToast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const close = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (text: string, tone?: MediaToastTone) => {
      const id = nextId.current++;
      const resolved = tone ?? (text.startsWith('Не вдалося') ? 'error' : 'success');
      setToasts((current) => [...current, { id, tone: resolved, text }].slice(-MAX_TOASTS));
      timers.current.set(
        id,
        setTimeout(() => close(id), DURATION_MS[resolved]),
      );
    },
    [close],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  return { toasts, show, close };
}
