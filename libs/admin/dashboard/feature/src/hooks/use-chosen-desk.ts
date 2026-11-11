import { useState } from 'react';

import type { DeskDefinition, DeskKey } from '../model/desks';

const storageKey = 'brevi-admin:desk';

const readStored = (): string | null => {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

/** The desk tab a person looked at last, kept in this browser; the first visible desk otherwise. */
export function useChosenDesk(visible: readonly DeskDefinition[]) {
  const [chosen, setChosen] = useState<string | null>(readStored);
  const current = visible.find((desk) => desk.key === chosen) ?? visible[0] ?? null;

  const choose = (key: DeskKey) => {
    setChosen(key);
    try {
      window.localStorage.setItem(storageKey, key);
    } catch {
      // The choice simply is not remembered (private window, blocked storage).
    }
  };

  return { current, choose };
}
