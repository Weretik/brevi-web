import { configureApiClient, resetAdminApiState } from '@admin/shared/api-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initializeAdminAuth, login, logout } from './auth-session';
import { getSessionState, setSessionState } from './session-store';
import { requestCurrentUser, requestLogin, requestLogout } from './session-transport';

import type { SessionUser } from './session-user';

vi.mock('@admin/shared/api-client', () => ({
  configureApiClient: vi.fn(),
  resetAdminApiState: vi.fn(),
}));
vi.mock('./session-transport', () => ({
  requestCurrentUser: vi.fn(),
  requestLogin: vi.fn(),
  requestLogout: vi.fn(),
}));

const manager: SessionUser = {
  id: '7',
  email: 'manager@brevi.com.ua',
  fullName: 'Олена',
  roles: ['Manager'],
};

describe('admin cookie session lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSessionState({ status: 'loading' });
  });

  it('restores the signed-in user from the session cookie', async () => {
    vi.mocked(requestCurrentUser).mockResolvedValue(manager);

    await initializeAdminAuth();

    expect(getSessionState()).toEqual({ status: 'authenticated', user: manager });
  });

  it('starts anonymous without a session and when the API is unreachable', async () => {
    vi.mocked(requestCurrentUser).mockResolvedValueOnce(null);
    await initializeAdminAuth();
    expect(getSessionState()).toEqual({ status: 'anonymous' });

    vi.mocked(requestCurrentUser).mockRejectedValueOnce(new Error('offline'));
    await initializeAdminAuth();
    expect(getSessionState()).toEqual({ status: 'anonymous' });
  });

  it('a 401 from any API call ends the session and drops cached data', async () => {
    vi.mocked(requestCurrentUser).mockResolvedValue(manager);
    await initializeAdminAuth();

    const adapter = vi.mocked(configureApiClient).mock.calls[0]?.[0].authSession;
    await adapter?.onUnauthenticated?.();

    expect(getSessionState()).toEqual({ status: 'anonymous' });
    expect(resetAdminApiState).toHaveBeenCalledOnce();
  });

  it('keeps no token in browser storage after login', async () => {
    vi.mocked(requestLogin).mockResolvedValue(manager);

    await login({ email: manager.email, password: 'secret-pass' });

    expect(getSessionState()).toEqual({ status: 'authenticated', user: manager });
    expect(window.localStorage).toHaveLength(0);
    expect(window.sessionStorage).toHaveLength(0);
  });

  it('always ends the local session when logout transport fails', async () => {
    setSessionState({ status: 'authenticated', user: manager });
    vi.mocked(requestLogout).mockRejectedValue(new Error('offline'));

    await expect(logout()).rejects.toThrow('offline');

    expect(getSessionState()).toEqual({ status: 'anonymous' });
    expect(resetAdminApiState).toHaveBeenCalledOnce();
  });
});
