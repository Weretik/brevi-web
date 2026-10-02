import { AxiosError, AxiosHeaders } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { retryAfterAuthRefresh } from './auth-refresh.interceptor';
import { attachAuthorizationHeader } from './auth-request.interceptor';
import { configureApiClient, configureApiErrorNotifier } from '../runtime/api-client-runtime';

import type { TimedRequestConfig } from './api-logging.interceptor';
import type { AxiosInstance, AxiosResponse } from 'axios';

const requestConfig = (url = '/api/products'): TimedRequestConfig =>
  ({ headers: new AxiosHeaders(), url }) as TimedRequestConfig;

const unauthorizedError = (config: TimedRequestConfig): AxiosError =>
  new AxiosError('Unauthorized', undefined, config, undefined, {
    config,
    data: undefined,
    headers: {},
    status: 401,
    statusText: 'Unauthorized',
  });

afterEach(() => {
  configureApiClient({});
  configureApiErrorNotifier(undefined);
});

describe('auth interceptors', () => {
  it('adds the current access token without owning session state', async () => {
    configureApiClient({ authSession: { getAccessToken: () => 'access-token' } });
    const config = await attachAuthorizationHeader(requestConfig());
    expect(config.headers.get('Authorization')).toBe('Bearer access-token');
  });

  it('shares one refresh between concurrent unauthorized requests', async () => {
    const refreshAccessToken = vi.fn().mockResolvedValue('next-token');
    configureApiClient({ authSession: { getAccessToken: () => null, refreshAccessToken } });
    const request = vi.fn().mockResolvedValue({ status: 200 } satisfies Partial<AxiosResponse>);
    const client = { request } as unknown as AxiosInstance;
    const firstConfig = requestConfig();
    const secondConfig = requestConfig();

    await Promise.all([
      retryAfterAuthRefresh(client, unauthorizedError(firstConfig)),
      retryAfterAuthRefresh(client, unauthorizedError(secondConfig)),
    ]);

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(2);
    expect(firstConfig.headers.get('Authorization')).toBe('Bearer next-token');
    expect(secondConfig.headers.get('Authorization')).toBe('Bearer next-token');
  });

  it('fails closed when refresh cannot restore a session', async () => {
    const onUnauthenticated = vi.fn();
    configureApiClient({
      authSession: {
        getAccessToken: () => null,
        refreshAccessToken: async () => null,
        onUnauthenticated,
      },
    });
    const client = { request: vi.fn() } as unknown as AxiosInstance;

    await expect(
      retryAfterAuthRefresh(client, unauthorizedError(requestConfig())),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(onUnauthenticated).toHaveBeenCalledOnce();
    expect(client.request).not.toHaveBeenCalled();
  });
});
