import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export function useClientDirtyGuard(dirty: boolean) {
  const allow = useRef(false);
  const blocker = useBlocker(() => dirty && !allow.current);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty && !allow.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  return {
    blocker,
    allowNavigation: () => {
      allow.current = true;
    },
  };
}
