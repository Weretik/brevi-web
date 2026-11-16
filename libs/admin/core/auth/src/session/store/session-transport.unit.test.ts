import { stubApiFetch, type StubHandler } from '@admin/shared/api-client/testing';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { requestCurrentUser, requestLogin, requestLogout } from './session-transport';

const meResponse = {
  userId: '1',
  email: 'admin@brevi.com.ua',
  fullName: 'Адміністратор',
  roles: ['Admin'],
};
const accessResponse = {
  allowAll: false,
  roles: [{ name: 'Admin', title: 'Адміністратор', builtIn: true }],
  grants: { quotes: ['view', 'create', 'edit'] },
};

const answer = (path: string) =>
  path === '/api/auth/session/access' ? { json: () => accessResponse } : { json: () => meResponse };

describe('cookie session transport', () => {
  beforeEach(() => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    document.cookie = 'brevi.csrf=; Max-Age=0; Path=/';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('signs in with the cookie endpoint and maps the user', async () => {
    const fetch = stubApiFetch(vi.fn(answer));

    await expect(
      requestLogin({ email: 'admin@brevi.com.ua', password: 'secret-pass' }),
    ).resolves.toEqual({
      id: '1',
      email: 'admin@brevi.com.ua',
      fullName: 'Адміністратор',
      roles: ['Admin'],
      avatarUrl: null,
      access: accessResponse,
    });
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/cookie/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@brevi.com.ua', password: 'secret-pass' }),
      }),
    );
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/session/access',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('signs out with the CSRF cookie value and no bearer token', async () => {
    document.cookie = 'brevi.csrf=csrf%20value; Path=/';
    const fetch = stubApiFetch(vi.fn<StubHandler>(() => ({ status: 204 })));

    await requestLogout();

    const [path, init] = fetch.mock.calls[0] ?? [];
    expect(path).toBe('/api/auth/cookie/logout');
    expect(init?.method).toBe('POST');
    expect(init?.headers.get('X-CSRF-Token')).toBe('csrf value');
    expect(init?.headers.get('Authorization')).toBeNull();
  });

  it('returns null for the current user without a session', async () => {
    stubApiFetch(() => ({ status: 401, json: () => ({}) }));

    await expect(requestCurrentUser()).resolves.toBeNull();
  });
});
