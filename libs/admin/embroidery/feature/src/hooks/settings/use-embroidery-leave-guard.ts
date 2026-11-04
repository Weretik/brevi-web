import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/** Asks before leaving the page, or closing the tab, while «Налаштування» has unsaved changes. */
export function useEmbroideryLeaveGuard(dirty: boolean) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  return blocker;
}
