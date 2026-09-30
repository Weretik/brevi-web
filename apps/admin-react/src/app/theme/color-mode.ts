import type { AdminColorMode } from '@admin/core/shell';

const storageKey = 'theme';

export function readColorMode(): AdminColorMode {
  try {
    const storedMode = window.localStorage.getItem(storageKey);
    return storedMode === 'light' || storedMode === 'dark' || storedMode === 'system'
      ? storedMode
      : 'system';
  } catch {
    return 'system';
  }
}

export function saveColorMode(mode: AdminColorMode): void {
  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    // The selection still applies for this session when browser storage is unavailable.
  }
}
