import { configureApiClient, resetAdminApiState } from '@admin/shared/api-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initializeAdminAuth, login, logout } from './auth-session';
import { getAccessToken, setAccessToken } from './session-state';
import { requestAccessTokenRefresh, requestLogin, requestLogout } from './session-transport';

vi.mock('@admin/shared/api-client', () => ({
  configureApiClient: vi.fn(),
  resetAdminApiState: vi.fn(),
}));
vi.mock('./session-transport', () => ({
  requestAccessTokenRefresh: vi.fn(),
  requestLogin: vi.fn(),
  requestLogout: vi.fn(),
}));

describe('admin auth lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAccessToken(null);
  });

  it('restores a session and configures the API adapter', async () => {
    vi.mocked(requestAccessTokenRefresh).mockResolvedValue('restored-token');

    await initializeAdminAuth();

    expect(getAccessToken()).toBe('restored-token');
    const adapter = vi.mocked(configureApiClient).mock.calls[0]?.[0].authSession;
    expect(await adapter?.getAccessToken()).toBe('restored-token');
    vi.mocked(requestAccessTokenRefresh).mockResolvedValue('refreshed-token');
    await expect(adapter?.refreshAccessToken?.()).resolves.toBe('refreshed-token');
    expect(getAccessToken()).toBe('refreshed-token');
    await adapter?.onUnauthenticated?.();
    expect(getAccessToken()).toBeNull();
    expect(resetAdminApiState).toHaveBeenCalledOnce();
  });

  it('fails closed when bootstrap refresh is unavailable', async () => {
    setAccessToken('stale-token');
    vi.mocked(requestAccessTokenRefresh).mockRejectedValue(new Error('unauthorized'));

    await expect(initializeAdminAuth()).resolves.toBeUndefined();
    expect(getAccessToken()).toBeNull();
    expect(resetAdminApiState).toHaveBeenCalledOnce();
  });

  it('stores login token only in memory', async () => {
    vi.mocked(requestLogin).mockResolvedValue('login-token');

    await login({ email: 'admin@brevi.test', password: 'secret' });

    expect(getAccessToken()).toBe('login-token');
    expect(window.localStorage).toHaveLength(0);
    expect(window.sessionStorage).toHaveLength(0);
  });

  it('always clears the session and API cache when logout transport fails', async () => {
    setAccessToken('active-token');
    vi.mocked(requestLogout).mockRejectedValue(new Error('offline'));

    await expect(logout()).rejects.toThrow('offline');

    expect(requestLogout).toHaveBeenCalledWith('active-token');
    expect(getAccessToken()).toBeNull();
    expect(resetAdminApiState).toHaveBeenCalledOnce();
  });
});
