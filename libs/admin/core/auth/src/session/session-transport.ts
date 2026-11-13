import { csrfHeaderName, readCsrfToken } from '@admin/shared/api-client';
import { appConfig } from '@admin/shared/config';
import axios from 'axios';

import type { SessionAccess, SessionUser } from './session-user';
import type { operations } from '@admin/shared/contracts';

export type LoginRequest =
  operations['loginCookieSession']['requestBody']['content']['application/json'];
type SessionUserResponse =
  operations['getCurrentSession']['responses'][200]['content']['application/json'];

type SessionAccessResponse =
  operations['getSessionAccess']['responses'][200]['content']['application/json'];

/** In development the API base URL is empty and the Vite dev server proxies `/api`, so the path stays relative. */
const getAuthUrl = (path: string): string =>
  appConfig.apiBaseUrl ? new URL(path, appConfig.apiBaseUrl).toString() : path;

const toSessionAccess = (response: SessionAccessResponse): SessionAccess => ({
  allowAll: response.allowAll,
  roles: response.roles,
  grants: response.grants,
});

/** What the signed-in user may open and do, per page of «Права доступу». */
const requestAccess = async (): Promise<SessionAccess> => {
  const response = await axios.get<SessionAccessResponse>(getAuthUrl('/api/auth/session/access'), {
    withCredentials: true,
  });

  return toSessionAccess(response.data);
};

const toSessionUser = (response: SessionUserResponse, access: SessionAccess): SessionUser => ({
  id: response.userId,
  email: response.email,
  fullName: response.fullName,
  roles: response.roles,
  avatarUrl: response.avatarUrl ?? null,
  access,
});

/** Signs in with the HttpOnly session cookie. Throws an axios error on 401 or 429. */
export const requestLogin = async (request: LoginRequest): Promise<SessionUser> => {
  const response = await axios.post<SessionUserResponse>(
    getAuthUrl('/api/auth/cookie/login'),
    request,
    {
      withCredentials: true,
    },
  );

  return toSessionUser(response.data, await requestAccess());
};

export const requestLogout = async (): Promise<void> => {
  const csrfToken = readCsrfToken();
  await axios.post(
    getAuthUrl('/api/auth/cookie/logout'),
    {},
    {
      headers: csrfToken ? { [csrfHeaderName]: csrfToken } : undefined,
      withCredentials: true,
    },
  );
};

/** Returns the signed-in user, or null when there is no valid session cookie. */
export const requestCurrentUser = async (): Promise<SessionUser | null> => {
  try {
    const response = await axios.get<SessionUserResponse>(getAuthUrl('/api/auth/session/me'), {
      withCredentials: true,
    });

    return toSessionUser(response.data, await requestAccess());
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};
