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

describe('Sewing access in temporary anonymous Admin', () => {
  it('enables reading and management without a session request', async () => {
    configureAppConfig({
      production: true,
      api: { baseUrl: 'https://api.example.test' },
      auth: { anonymousAccess: true },
    });
    const fetcher = vi.fn().mockRejectedValue(new Error('No session expected'));
    vi.stubGlobal('fetch', fetcher);
    const access = await store
      .dispatch(sewingAccessApi.endpoints.getSewingAccess.initiate())
      .unwrap();
    expect(access).toEqual({ canRead: true, canManage: true });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('restores the server-based read-only User role when disabled', async () => {
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
    ).toEqual({ canRead: true, canManage: false });
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
