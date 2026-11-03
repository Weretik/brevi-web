// @vitest-environment jsdom
import { AxiosError, AxiosHeaders } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { attachCsrfHeader } from './csrf-request.interceptor';
import { handleUnauthorized } from './unauthorized.interceptor';
import { configureApiClient, configureApiErrorNotifier } from '../runtime/api-client-runtime';

import type { TimedRequestConfig } from './api-logging.interceptor';

const requestConfig = (method: string, url = '/api/products'): TimedRequestConfig =>
  ({ headers: new AxiosHeaders(), method, url }) as TimedRequestConfig;

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
  document.cookie = 'brevi.csrf=; Max-Age=0; Path=/';
});

describe('cookie session interceptors', () => {
  it('sends the CSRF cookie value only on requests that change data', () => {
    document.cookie = 'brevi.csrf=csrf%20value; Path=/';

    expect(attachCsrfHeader(requestConfig('post')).headers.get('X-CSRF-Token')).toBe('csrf value');
    expect(attachCsrfHeader(requestConfig('get')).headers.has('X-CSRF-Token')).toBe(false);
  });

  it('never adds a bearer token', () => {
    document.cookie = 'brevi.csrf=value; Path=/';

    expect(attachCsrfHeader(requestConfig('put')).headers.has('Authorization')).toBe(false);
  });

  it('ends the session on a 401 from a data request', async () => {
    const onUnauthenticated = vi.fn();
    configureApiClient({ authSession: { onUnauthenticated } });

    await expect(
      handleUnauthorized(unauthorizedError(requestConfig('get'))),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(onUnauthenticated).toHaveBeenCalledOnce();
  });

  it('leaves a 401 from sign-in to the login page', async () => {
    const onUnauthenticated = vi.fn();
    configureApiClient({ authSession: { onUnauthenticated } });

    await expect(
      handleUnauthorized(unauthorizedError(requestConfig('post', '/api/auth/cookie/login'))),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(onUnauthenticated).not.toHaveBeenCalled();
  });
});
