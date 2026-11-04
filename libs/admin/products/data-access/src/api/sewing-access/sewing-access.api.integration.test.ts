import { adminApi, configureApiClient, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingAccessApi } from './sewing-access.api';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  configureAppConfig({ production: true });
  configureApiClient({});
  vi.unstubAllGlobals();
});

describe('Sewing access from the current session', () => {
  it('uses the server roles: User reads but cannot manage', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.example.test' } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ roles: ['User'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetcher);
    expect(
      await store.dispatch(sewingAccessApi.endpoints.getSewingAccess.initiate()).unwrap(),
    ).toEqual({ canRead: true, canManage: false, canManagePhotos: false });
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
