const RELOAD_MARK = 'admin:stale-chunk-reload-at';
const RELOAD_COOLDOWN_MS = 30_000;

interface ReloadDeps {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  reload: () => void;
  now: () => number;
}

/**
 * After a deploy the hashed files of the previous build are gone, and an open tab
 * asks for them in vain. Reload once to pick up the new build; the mark stops a loop
 * when the new build is itself broken.
 */
export function reloadOnceForStaleChunk(deps: ReloadDeps): boolean {
  try {
    const last = Number(deps.storage.getItem(RELOAD_MARK) ?? 0);
    if (deps.now() - last < RELOAD_COOLDOWN_MS) {
      return false;
    }
    deps.storage.setItem(RELOAD_MARK, String(deps.now()));
  } catch {
    return false;
  }
  deps.reload();
  return true;
}

/** Vite fires `vite:preloadError` when a lazy route file cannot be loaded. */
export function installStaleChunkReload(): void {
  window.addEventListener('vite:preloadError', (event) => {
    const reloaded = reloadOnceForStaleChunk({
      storage: window.sessionStorage,
      reload: () => window.location.reload(),
      now: () => Date.now(),
    });
    if (reloaded) {
      event.preventDefault();
    }
  });
}
