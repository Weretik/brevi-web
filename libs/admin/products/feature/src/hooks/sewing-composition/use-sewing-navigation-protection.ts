import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export function useSewingNavigationProtection(
  dirty: boolean,
  busy: boolean,
  onDirtyChange?: (dirty: boolean) => void,
) {
  const blocker = useBlocker(dirty || busy);

  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const protectUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', protectUnload);
    return () => window.removeEventListener('beforeunload', protectUnload);
  }, [dirty]);

  return blocker;
}
