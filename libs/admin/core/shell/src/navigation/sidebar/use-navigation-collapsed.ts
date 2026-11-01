import { useState } from 'react';

const storageKey = 'brevi-admin:navigation-collapsed';

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(storageKey) === 'true';
  } catch {
    return false;
  }
}

/** Desktop sidebar width choice, remembered in the browser when storage is available. */
export function useNavigationCollapsed() {
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () => {
    setIsCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(storageKey, String(next));
      } catch {
        // The choice still applies for this page when browser storage is unavailable.
      }
      return next;
    });
  };

  return { isCollapsed, toggleCollapsed };
}
