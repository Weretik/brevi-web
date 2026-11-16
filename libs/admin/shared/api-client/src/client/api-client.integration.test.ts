// @vitest-environment jsdom
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiCall } from './api-call';
import { apiClient } from './api-client';
import { toAdminApiError } from '../errors/api-error';
import { configureApiClient, configureApiErrorNotifier } from '../runtime/api-client-runtime';

const requests: Request[] = [];

function respond(status: number, body?: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (request: Request) => {
      requests.push(request);
      return new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  requests.length = 0;
  configureApiClient({});
  configureApiErrorNotifier(undefined);
  document.cookie = 'brevi.csrf=; Max-Age=0; Path=/';
});

describe('apiClient', () => {
  it('reads the API address on every call and maps the typed body', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test/' } });
    respond(200, [{ id: 7 }]);

    const result = await apiCall(apiClient.GET('/api/reference/fabrics'), (fabrics) =>
      fabrics.map((fabric) => fabric.id),
    );

    expect(result).toEqual({ data: [7] });
    expect(requests[0]?.url).toBe('https://api.brevi.test/api/reference/fabrics');
    expect(requests[0]?.credentials).toBe('include');
  });

  it('resolves an empty API address against the page origin', async () => {
    configureAppConfig({ production: false });
    respond(204);

    const result = await apiCall(
      apiClient.DELETE('/api/reference/fabrics/{id}', { params: { path: { id: 5 } } }),
    );

    expect(result).toEqual({ data: null });
    expect(requests[0]?.url).toBe(`${location.origin}/api/reference/fabrics/5`);
  });

  it('sends a list as repeated keys, the way the backend binds it', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    respond(200, []);

    await apiCall(
      apiClient.GET('/api/crm/quote-lookups/fabrics', { params: { query: { ids: [30, 46] } } }),
    );

    expect(new URL(requests[0]!.url).search).toBe('?ids=30&ids=46');
  });

  it('sends the CSRF cookie value only on requests that change data, and never a bearer token', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    document.cookie = 'brevi.csrf=csrf%20value; Path=/';
    respond(204);

    await apiCall(apiClient.GET('/api/reference/fabrics'));
    await apiCall(apiClient.DELETE('/api/reference/fabrics/{id}', { params: { path: { id: 1 } } }));

    expect(requests[0]?.headers.has('X-CSRF-Token')).toBe(false);
    expect(requests[1]?.headers.get('X-CSRF-Token')).toBe('csrf value');
    expect(requests[1]?.headers.has('Authorization')).toBe(false);
  });

  it('ends the session on a 401 from a data request, but not from sign-in', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    const onUnauthenticated = vi.fn();
    configureApiClient({ authSession: { onUnauthenticated } });
    respond(401);

    await apiCall(apiClient.GET('/api/reference/fabrics'));
    expect(onUnauthenticated).toHaveBeenCalledOnce();

    await apiCall(
      apiClient.POST('/api/auth/cookie/login', { body: { email: 'a@b.c', password: 'x' } }),
    );
    expect(onUnauthenticated).toHaveBeenCalledOnce();
  });

  it('notifies about a failed call and passes the error through the feature mapper', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    const notifier = vi.fn();
    configureApiErrorNotifier(notifier);
    respond(404, { title: 'Not Found' });

    const result = await apiCall(apiClient.GET('/api/reference/fabrics'), undefined, (error) =>
      toAdminApiError(error, { notFound: 'Тканину не знайдено.' }),
    );

    expect(result).toMatchObject({ error: { code: 'NotFound', message: 'Тканину не знайдено.' } });
    expect(notifier).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });

  it('reports a network failure', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    expect(await apiCall(apiClient.GET('/api/reference/fabrics'))).toMatchObject({
      error: { code: 'Network' },
    });
  });

  it('shows the message of a mapper that rejects the body, past the feature error mapper', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    respond(200, [{ id: 'broken' }]);

    const result = await apiCall(
      apiClient.GET('/api/reference/fabrics'),
      () => {
        throw new Error('Некоректний запис тканини.');
      },
      (error) => toAdminApiError(error, {}),
    );

    expect(result).toMatchObject({
      error: { code: 'Unknown', status: 200, message: 'Некоректний запис тканини.' },
    });
  });
});
