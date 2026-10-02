import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminShellSessionProvider, useAdminShellLogout } from './admin-shell-session-provider';

import type { PropsWithChildren } from 'react';

describe('AdminShellSessionProvider', () => {
  it('exposes the injected logout action without depending on auth implementation', async () => {
    const onLogout = vi.fn().mockResolvedValue(undefined);
    const wrapper = ({ children }: PropsWithChildren) => (
      <AdminShellSessionProvider onLogout={onLogout}>{children}</AdminShellSessionProvider>
    );

    const { result } = renderHook(() => useAdminShellLogout(), { wrapper });
    await result.current?.();

    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('returns null outside the provider', () => {
    const { result } = renderHook(() => useAdminShellLogout());

    expect(result.current).toBeNull();
  });
});
