import { useState } from 'react';

import type { DeskKey } from '../model/desks';

const storageKey = 'brevi-admin:desks-open';

const readStored = (): string[] => {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

/** Which desks the director keeps unfolded under the main desk, kept in this browser; all folded at first. */
export function useOpenDesks() {
  const [open, setOpen] = useState<string[]>(readStored);

  const toggle = (key: DeskKey) => {
    const next = open.includes(key) ? open.filter((x) => x !== key) : [...open, key];
    setOpen(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // The choice simply is not remembered (private window, blocked storage).
    }
  };

  return { isOpen: (key: DeskKey) => open.includes(key), toggle };
}
