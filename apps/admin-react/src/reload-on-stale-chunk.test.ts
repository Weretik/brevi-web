import { describe, expect, it, vi } from 'vitest';

import { reloadOnceForStaleChunk } from './reload-on-stale-chunk';

function makeDeps(now: number, stored: Record<string, string> = {}) {
  const reload = vi.fn();
  return {
    reload,
    deps: {
      storage: {
        getItem: (key: string) => stored[key] ?? null,
        setItem: (key: string, value: string) => {
          stored[key] = value;
        },
      },
      reload,
      now: () => now,
    },
  };
}

describe('reloadOnceForStaleChunk', () => {
  it('reloads on the first failure', () => {
    const { deps, reload } = makeDeps(100_000);
    expect(reloadOnceForStaleChunk(deps)).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });

  it('does not reload again right after a reload, so a broken build cannot loop', () => {
    const { deps, reload } = makeDeps(110_000, { 'admin:stale-chunk-reload-at': '100000' });
    expect(reloadOnceForStaleChunk(deps)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads again after the cooldown', () => {
    const { deps, reload } = makeDeps(200_000, { 'admin:stale-chunk-reload-at': '100000' });
    expect(reloadOnceForStaleChunk(deps)).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });

  it('does nothing when storage is unavailable', () => {
    const reload = vi.fn();
    const deps = {
      storage: {
        getItem: () => {
          throw new Error('blocked');
        },
        setItem: () => undefined,
      },
      reload,
      now: () => 1,
    };
    expect(reloadOnceForStaleChunk(deps)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
