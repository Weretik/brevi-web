import { appConfig } from '@admin/shared/config';
import axios from 'axios';

import type { operations } from '@admin/shared/contracts';

export type LoginRequest = operations['loginSession']['requestBody']['content']['application/json'];
type LoginSessionResponse =
  operations['loginSession']['responses'][200]['content']['application/json'];
type RefreshSessionResponse =
  operations['refreshSession']['responses'][200]['content']['application/json'];

function getAuthUrl(path: string): string {
  return new URL(path, appConfig.apiBaseUrl).toString();
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const prefix = `${name}=`;
  const cookie = document.cookie.split('; ').find((value) => value.startsWith(prefix));
  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return null;
  }
}

function readAccessToken(response: LoginSessionResponse | RefreshSessionResponse): string {
  if (typeof response.accessToken !== 'string' || response.accessToken.length === 0) {
    throw new Error('Session response does not contain an access token.');
  }

  return response.accessToken;
}

export async function requestLogin(request: LoginRequest): Promise<string> {
  const response = await axios.post<LoginSessionResponse>(
    getAuthUrl('/api/auth/session/login'),
    request,
    { withCredentials: true },
  );

  return readAccessToken(response.data);
}

export async function requestAccessTokenRefresh(): Promise<string> {
  const csrfToken = getCookieValue('kedr.csrf');
  const response = await axios.post<RefreshSessionResponse>(
    getAuthUrl('/api/auth/session/refresh'),
    {},
    {
      headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      withCredentials: true,
    },
  );

  return readAccessToken(response.data);
}

export async function requestLogout(accessToken: string): Promise<void> {
  await axios.post(
    getAuthUrl('/api/auth/session/logout'),
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    },
  );
}
