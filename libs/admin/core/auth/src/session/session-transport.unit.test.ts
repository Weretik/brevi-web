import { configureAppConfig } from '@admin/shared/config';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { requestAccessTokenRefresh, requestLogin, requestLogout } from './session-transport';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));

const post = vi.mocked(axios.post);

describe('session transport', () => {
  beforeEach(() => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    post.mockReset();
    document.cookie = 'kedr.csrf=; Max-Age=0; Path=/';
  });

  it('reads the CSRF cookie and maps the generated refresh response', async () => {
    document.cookie = 'kedr.csrf=csrf%20value; Path=/';
    post.mockResolvedValue({
      data: { tokenType: 'Bearer', accessToken: 'next-token', expiresIn: 900 },
    });

    await expect(requestAccessTokenRefresh()).resolves.toBe('next-token');
    expect(post).toHaveBeenCalledWith(
      'http://localhost/api/auth/session/refresh',
      {},
      expect.objectContaining({
        headers: { 'X-CSRF-Token': 'csrf value' },
        withCredentials: true,
      }),
    );
  });

  it('maps login and sends logout with the in-memory bearer token', async () => {
    post.mockResolvedValueOnce({
      data: { tokenType: 'Bearer', accessToken: 'login-token', expiresIn: 900 },
    });
    post.mockResolvedValueOnce({ data: undefined });

    await expect(requestLogin({ email: 'admin@brevi.test', password: 'secret' })).resolves.toBe(
      'login-token',
    );
    await requestLogout('login-token');

    expect(post).toHaveBeenNthCalledWith(
      2,
      'http://localhost/api/auth/session/logout',
      {},
      { headers: { Authorization: 'Bearer login-token' }, withCredentials: true },
    );
  });

  it('rejects a response without an access token', async () => {
    post.mockResolvedValue({ data: { tokenType: 'Bearer', expiresIn: 900 } });

    await expect(requestLogin({ email: 'admin@brevi.test', password: 'secret' })).rejects.toThrow(
      'access token',
    );
  });
});
