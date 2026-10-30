import { isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useRef, useState } from 'react';

export function useTemplateAction(onAccessLost?: () => void) {
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      captured.current = null;
    };
  }, []);
  const captured = useRef<null | (() => Promise<void>)>(null);
  const execute = async (run?: () => Promise<void>) => {
    if (!mounted.current || busy.current || forbidden || (run && captured.current)) return;
    if (run) captured.current = run;
    if (!captured.current) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      await captured.current();
      if (!mounted.current) return;
      captured.current = null;
      setUncertain(false);
    } catch (failure) {
      if (!mounted.current) return;
      const known = isAdminApiError(failure);
      const denied = known && [401, 403, 404].includes(failure.status);
      const unknown =
        !known || failure.status === 0 || failure.status === 408 || failure.status >= 500;
      setError(known ? failure.message : 'Результат дії невідомий. Повторіть той самий запит.');
      setForbidden(denied);
      if (denied) onAccessLost?.();
      setUncertain(!denied && unknown);
      if (denied || !unknown) captured.current = null;
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return { pending, uncertain, forbidden, error, execute, isCurrent: () => mounted.current };
}
