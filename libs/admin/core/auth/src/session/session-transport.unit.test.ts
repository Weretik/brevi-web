import { configureAppConfig } from '@admin/shared/config';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { requestCurrentUser, requestLogin, requestLogout } from './session-transport';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return { ...actual, default: { ...actual.default, get: vi.fn(), post: vi.fn() } };
});

const post = vi.mocked(axios.post);
const get = vi.mocked(axios.get);
const meResponse = {
  userId: '1',
  email: 'admin@brevi.com.ua',
  fullName: 'Адміністратор',
  roles: ['Admin'],
};

describe('cookie session transport', () => {
  beforeEach(() => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    post.mockReset();
    get.mockReset();
    document.cookie = 'brevi.csrf=; Max-Age=0; Path=/';
  });

  it('signs in with the cookie endpoint and maps the user', async () => {
    post.mockResolvedValue({ data: meResponse });

    await expect(
      requestLogin({ email: 'admin@brevi.com.ua', password: 'secret-pass' }),
    ).resolves.toEqual({
      id: '1',
      email: 'admin@brevi.com.ua',
      fullName: 'Адміністратор',
      roles: ['Admin'],
      avatarUrl: null,
    });
    expect(post).toHaveBeenCalledWith(
      'http://localhost/api/auth/cookie/login',
      { email: 'admin@brevi.com.ua', password: 'secret-pass' },
      { withCredentials: true },
    );
  });

  it('signs out with the CSRF cookie value and no bearer token', async () => {
    document.cookie = 'brevi.csrf=csrf%20value; Path=/';
    post.mockResolvedValue({ data: undefined });

    await requestLogout();

    expect(post).toHaveBeenCalledWith(
      'http://localhost/api/auth/cookie/logout',
      {},
      { headers: { 'X-CSRF-Token': 'csrf value' }, withCredentials: true },
    );
  });

  it('returns null for the current user without a session', async () => {
    get.mockRejectedValue(
      new axios.AxiosError('Unauthorized', '401', undefined, undefined, {
        status: 401,
        data: {},
        statusText: '',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      }),
    );

    await expect(requestCurrentUser()).resolves.toBeNull();
  });
});
