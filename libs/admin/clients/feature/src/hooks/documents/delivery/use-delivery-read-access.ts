import { isAdminApiError } from '@admin/shared/api-client';
import { useCallback, useRef, useState } from 'react';

/** A denied protected read stays parked even after the query cache clears its error. */
export function useDeliveryReadAccess(onAccessLost: () => void) {
  const [denied, setDenied] = useState(false);
  const allowed = useRef(true);
  const clear = useRef(onAccessLost);
  clear.current = onAccessLost;
  const observe = useCallback((...errors: unknown[]) => {
    if (
      !allowed.current ||
      !errors.some((error) => isAdminApiError(error) && [401, 403, 404].includes(error.status))
    )
      return;
    allowed.current = false;
    setDenied(true);
    clear.current();
  }, []);
  return { denied, observe, isCurrent: () => allowed.current };
}
