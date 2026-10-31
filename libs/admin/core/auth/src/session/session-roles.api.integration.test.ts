import { adminApi, configureApiClient, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sessionRolesApi } from './session-roles.api';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  configureAppConfig({ production: true });
  configureApiClient({});
  vi.unstubAllGlobals();
});

describe('Admin access roles', () => {
  it('exposes every existing menu role anonymously without calling session me', async () => {
    configureAppConfig({
      production: true,
      api: { baseUrl: 'https://api.example.test' },
      auth: { anonymousAccess: true },
    });
    const fetcher = vi.fn().mockRejectedValue(new Error('Session transport must not be called'));
    vi.stubGlobal('fetch', fetcher);
    const roles = await store
      .dispatch(sessionRolesApi.endpoints.getAdminSessionRoles.initiate())
      .unwrap();
    expect(roles).toEqual(['Admin', 'Manager', 'User']);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('uses actual server roles with no invented Admin when anonymous mode is off', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.example.test' } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ roles: ['Manager'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetcher);
    const roles = await store
      .dispatch(sessionRolesApi.endpoints.getAdminSessionRoles.initiate())
      .unwrap();
    expect(roles).toEqual(['Manager']);
    expect((fetcher.mock.calls[0][0] as Request).url).toBe(
      'https://api.example.test/api/auth/session/me',
    );
  });
});
